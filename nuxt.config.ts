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
    nitro: { preset: 'cloudflare_pages', minify: false },
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
    },
    session: {
      name: 'bloby-session',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      password: ''
    }
  },

  build: {
    transpile: ['motion-v']
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
        '@shikijs/langs/xml',
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
        '@tiptap/pm/state',
        '@tiptap/pm/view'
      ]
    },
    resolve: {
      dedupe: [
        'vue',
        'prosemirror-model',
        'prosemirror-model',
        'prosemirror-state',
        'prosemirror-transform',
        'prosemirror-view',
        '@tiptap/core'
      ]
    },
    ssr: {
      noExternal: ['motion-v']
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
