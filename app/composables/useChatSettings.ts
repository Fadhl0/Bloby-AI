export function useChatSettings() {
  const reasoning = useCookie<boolean>('reasoning', { default: () => false })

  return {
    reasoning
  }
}
