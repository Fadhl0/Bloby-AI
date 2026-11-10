import type { H3Event } from 'h3'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export function useOpenRouter(event: H3Event) {
  return createOpenRouter({ apiKey: useRuntimeConfig(event).openrouterApiKey })
}
