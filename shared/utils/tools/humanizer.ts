import { tool, generateText, type UIToolInvocation } from 'ai'
import { z } from 'zod'
import { openrouter } from '@openrouter/ai-sdk-provider'
import { HUMANIZER_PROMPT } from '../prompts/humanizer'

export type HumanizerUIToolInvocation = UIToolInvocation<ReturnType<typeof humanizerTool>>

export function humanizerTool(model: string) {
  return tool({
    description: 'Rewrite English text so it reads like a human writer, not an AI. English only. Use when the user asks to humanize, de-slop, or make text sound less AI-generated.',
    inputSchema: z.object({
      text: z.string().describe('The exact English text to rewrite.')
    }),
    execute: async ({ text }) => {
      if (!text.trim()) {
        return { humanized: '', error: 'No text provided.' }
      }

      const { text: humanized } = await generateText({
        model: openrouter(model),
        instructions: HUMANIZER_PROMPT,
        prompt: `Rewrite the following text following the process and rules above. Run the full process (mark the tells, draft, check, final). Return only the final rewrite — no preamble, no notes, no headings. If the input is not English, return the original text unchanged and state that only English is supported.\n\n---\n${text}\n---`,
        temperature: 0.7
      })

      return { humanized: humanized.trim() }
    }
  })
}
