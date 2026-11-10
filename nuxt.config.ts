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

  $development: {
    nitro: {
      experimental: {
        openAPI: true
      }
    }
  },

  $production: {
    nitro: { preset: 'cloudflare_pages' },
    hub: {
      db: {
        dialect: 'sqlite',
        driver: 'd1',
        connection: { databaseId: 'd8f852d9-5a38-47e7-a88a-43df27e6f299' }
      },
      blob: {
        driver: 'cloudflare-r2',
        bucketName: 'bolby-bucket',
        binding: 'BLOB'
      }
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    openrouterApiKey: '',
    public: {
      name: ''
    }
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2026-06-30',
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },

  hub: {
    db: 'sqlite',
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
