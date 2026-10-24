import { MODELS } from '#shared/utils/models'

export function useModels() {
  const model = useCookie<string>('model', { default: () => 'nvidia/nemotron-3.5-lightning:free' })

  return {
    models: MODELS,
    model
  }
}
