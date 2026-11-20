export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    console.error('[SSR ERROR]', event?.path, error?.message, error?.stack)
  })
})
