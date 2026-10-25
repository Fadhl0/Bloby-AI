import { tool } from 'ai'
import { z } from 'zod'
import type { UIToolInvocation } from 'ai'

export type QuizUIToolInvocation = UIToolInvocation<typeof quizTool>

export const quizTool = tool({
  description: 'Show an interactive multiple-choice quiz. Use this whenever the user asks for a quiz, test, practice, or MCQs, whether from an uploaded file, a topic, or questions they paste. If the user pasted questions, keep their wording and options, fix obvious typos and broken formatting, and set correctIndex from the given answer (for True/False use two options). Do not repeat the questions in your text reply; add at most one short sentence.',
  inputSchema: z.object({
    title: z.string().optional().describe('Short title for the quiz (3-8 words) that names the topic of the document, e.g. "Chapter 3: Photosynthesis".'),
    questions: z.array(z.object({
      question: z.string().describe('The question text. It must be clear and self-contained, answerable from the document, and written in the same language as the document unless the user asks otherwise. Do not write "according to the text" or refer to page numbers.'),
      options: z.array(
        z.string()
          .describe('One answer choice. Keep it short and do not prefix it with "A)", "B)", "1." etc. because the UI adds labels. Wrong options must be plausible and similar in length and style to the correct one. Avoid "All of the above" and "None of the above".'))
        .min(2)
        .max(6)
        .describe('The answer choices, normally 4. Exactly one is correct. Put the correct answer at a varied position, not always first.'),
      correctIndex: z.number().int()
        .describe('Zero-based index of the correct option in "options" (0 is the first option). Must be less than options.length.')
    })).min(1).max(40).describe('The quiz questions in the order they should be shown. Cover the main ideas of the document evenly, with no duplicate or near-duplicate questions. Use the number of questions the user asked for, or about 10 if they did not say.')
  }),
  execute: async ({ title, questions }) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      title,
      questions
    }
  }
})
