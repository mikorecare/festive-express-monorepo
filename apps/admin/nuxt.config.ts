// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@vueuse/nuxt',

  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api',   // Change when deploying
      imageBase: 'http://localhost:8000'
    }
  },

  css: [
      'bootstrap/dist/css/bootstrap.min.css',
      '~/assets/css/main.css'
      
      // 'sonner/dist/index.css'
    ],
  app: {
    head: {
      title: 'FLP Express Admin',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        // Roboto Font
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap' }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          defer: true
        }
      ],
    }
  },

  router: {
    options: {
      strict: true
    }
  }

})
