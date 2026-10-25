// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@comark/nuxt',
    '@nuxthub/core',
    'nuxt-auth-utils',
    'nuxt-csurf'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      name: 'Bloby'
    }
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: { databaseId: 'cbcbc73e-e37a-494f-8347-f4daa66bf1ac' }
    },
    blob: true
  },

  vite: {
    optimizeDeps: {
      include: [
        'striptags', // CJS
        'ai',
        '@ai-sdk/vue',
        'date-fns',
        '@shikijs/langs/c',
        '@shikijs/langs/cpp',
        '@shikijs/langs/css',
        '@shikijs/langs/diff',
        '@shikijs/langs/dockerfile',
        '@shikijs/langs/go',
        '@shikijs/langs/graphql',
        '@shikijs/langs/html',
        '@shikijs/langs/java',
        '@shikijs/langs/kotlin',
        '@shikijs/langs/php',
        '@shikijs/langs/python',
        '@shikijs/langs/ruby',
        '@shikijs/langs/rust',
        '@shikijs/langs/sql',
        '@shikijs/langs/swift',
        '@shikijs/langs/toml',
        '@shikijs/langs/xml'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
