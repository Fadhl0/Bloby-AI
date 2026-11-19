import type { UIMessage } from 'ai'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, isStepCount, smoothStream, streamText, toUIMessageStream } from 'ai'
import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { blob } from 'hub:blob'
import { documentTool } from '~~/shared/utils/tools/document'
import { useOpenRouter } from '~~/server/utils/openrouter'

defineRouteMeta({
  openAPI: {
    description: 'Chat with AI.',
    tags: ['ai']
  }
})

async function resolveFileParts(messages: UIMessage[], ownerId: string): Promise<UIMessage[]> {
  return Promise.all(
    messages.map(async (message) => {
      // Skip messages that carry no file parts (assistant turns, plain text).
      if (!message.parts.some(part => part.type === 'file')) return message

      const parts: typeof message.parts = await Promise.all(
        message.parts.map(async (part) => {
          if (part.type !== 'file') return part

          // added
          if (!part.url.startsWith(`${ownerId}/`) || part.url.includes('..')) {
            return {
              type: 'text' as const,
              text: `_(Attached file "${part.filename ?? 'file'}" is not accessible.)_\n\n`
            }
          }
          // end

          try {
            const fileBlob = await blob.get(part.url)
            if (!fileBlob) {
              return {
                type: 'text' as const,
                text: `_(Attached file "${part.filename ?? part.url}" is no longer available.)_\n\n`
              }
            }

            const text = await fileBlob.text()
            return {
              type: 'text' as const,
              text: `**Attached file: ${part.filename ?? 'file'}**\n\n\`\`\`\n${text}\n\`\`\`\n\n`
            }
          } catch (error) {
            console.error('[resolveFileParts] Failed to read file from R2:', part.url, error)
            return {
              type: 'text' as const,
              text: `_(Could not read attached file "${part.filename ?? part.url}".)_\n\n`
            }
          }
        })
      )

      return { ...message, parts }
    })
  )
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const provider = useOpenRouter(event)

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const { model, messages, reasoning } = await readValidatedBody(event, z.object({
    model: z.string().refine(value => MODELS.some(m => m.value === value), {
      message: 'Invalid model'
    }),
    messages: z.array(z.custom<UIMessage>()),
    reasoning: z.boolean().default(false)
  }).parse)

  const chat = await db.query.chats.findFirst({
    where: () => and(
      eq(schema.chats.id, id as string),
      eq(schema.chats.userId, session.user?.id || session.id)
    ),
    with: {
      messages: true
    }
  })
  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  const resolvedMessages = await resolveFileParts(messages, session.user?.id || session.id)

  if (!chat.title) {
    const { text: title } = await generateText({
      model: provider('nvidia/nemotron-3.5-lightning:free'),
      instructions: `You are a title generator for a chat:
          - Generate a short title based on the first user's message
          - The title should be less than 30 characters long
          - The title should be a summary of the user's message
          - Do not use quotes (' or ") or colons (:) or any other punctuation
          - Do not use markdown, just plain text`,
      prompt: JSON.stringify(resolvedMessages[0])
    })

    await db.update(schema.chats).set({ title }).where(eq(schema.chats.id, id as string))
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(schema.messages).values({
      id: lastMessage.id,
      chatId: id as string,
      role: 'user',
      parts: lastMessage.parts
    }).onConflictDoUpdate({ target: schema.messages.id, set: { parts: lastMessage.parts } })

    await db.update(schema.chats)
      .set({ updatedAt: new Date() })
      .where(eq(schema.chats.id, chat.id))
  }

  const abortController = new AbortController()

  event.node.req.on('close', () => abortController.abort())

  const runtimeConfig = useRuntimeConfig(event)

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        abortSignal: abortController.signal,
        model: provider(model),
        instructions: `You are **${runtimeConfig.public.name}** a knowledgeable and helpful AI assistant. an AI assistant created by **FADHL AL FADHILI** (GitHub: https://github.com/Fadhl0). ${session.user?.name ? `The user's name is ${session.user?.name}.` : ''} Your goal is to provide clear, accurate, and well-structured responses.

**FORMATTING RULES (CRITICAL):**
- ABSOLUTELY NO MARKDOWN HEADINGS: Never use #, ##, ###, ####, #####, or ######
- NO underline-style headings with === or ---
- Use **bold text** for emphasis and section labels instead
- Examples:
  * Instead of "## Usage", write "**Usage:**" or just "Here's how to use it:"
  * Instead of "# Complete Guide", write "**Complete Guide**" or start directly with content
- Start all responses with content, never with a heading

**RESPONSE QUALITY:**
- Be concise yet comprehensive
- Use examples when helpful
- Break down complex topics into digestible parts
- Maintain a friendly, professional tone

**TOOLS:**
- quiz: ALWAYS call the quiz tool when the user asks for a quiz, MCQs, a test, or practice, including when they paste questions. Never rewrite the questions as text or code. Reply with at most one short sentence after the tool runs.
- document: ALWAYS call the document tool when the user asks you to write an essay, create a document, draft an article, or edit/write text inside the document editor. Do not output the document content as normal chat text; let the tool handle it.`,
        messages: await convertToModelMessages(resolvedMessages),
        tools: {
          chart: chartTool,
          weather: weatherTool,
          quiz: quizTool,
          document: documentTool
        },
        providerOptions: {
          openrouter: {
            reasoning: reasoning
              ? { effort: 'medium' }
              : { enabled: false }
          }
        },
        stopWhen: isStepCount(5),
        experimental_transform: smoothStream()
      })

      if (!chat.title) {
        writer.write({
          type: 'data-chat-title',
          data: { message: 'Generating title...' },
          transient: true
        })
      }

      writer.merge(toUIMessageStream({
        stream: result.stream,
        sendSources: true,
        sendReasoning: reasoning
      }))
    },
    onEnd: async ({ messages }) => {
      await db.insert(schema.messages).values(messages.map(message => ({
        id: message.id,
        chatId: chat.id,
        role: message.role as 'user' | 'assistant',
        parts: message.parts
      }))).onConflictDoNothing()
    }
  })

  return createUIMessageStreamResponse({
    stream
  })
})
