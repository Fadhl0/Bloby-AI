import { tool, type UIToolInvocation } from 'ai'
import { z } from 'zod'

export type DocumentUIToolInvocation = UIToolInvocation<typeof documentTool>

export const documentTool = tool({
  description:
    'Create and open a WYSIWYG document editor whenever the user asks to write, draft, compose, or edit an article, blog post, essay, guide, report, documentation, newsletter, or long-form text. After calling this tool, reply in chat with only a brief 1–2 sentence confirmation rather than repeating the full document.',
  inputSchema: z.object({
    title: z.string().describe('A clear, engaging title for the document.'),
    type: z
      .enum(['article', 'blog-post', 'essay', 'guide', 'report', 'other'])
      .default('article')
      .describe('The type of document being written.'),
    content: z
      .string()
      .describe(
        'The full document body in clean Markdown (#, ##, ### headings, **bold**, *italic*, bullet/numbered lists, > blockquotes, ``` code blocks, and | pipe | tables |).'
      )
  }),
  execute: async ({ title, type, content }) => {
    const trimmed = content.trim()
    if (!trimmed) {
      throw new Error('No document content was generated.')
    }

    return {
      title: title.trim() || 'Untitled Document',
      type,
      content: trimmed
    }
  }
})
