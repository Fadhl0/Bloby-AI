import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: useRuntimeConfig().OPENROUTER_API_KEY
})
