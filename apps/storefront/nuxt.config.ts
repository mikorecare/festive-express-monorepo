// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api',   // Change when deploying
      imageBase: 'http://localhost:8000',
      flTaxRate: 0.07
    }
  },

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
      '~/assets/css/main.css',
      '~/assets/css/pages.css',
    ],

  app: {
    head: {
      // Global template
      titleTemplate: '%s - Festive Lighting Pros Express',
      
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'Images/favicon.png' },
        // Roboto Font
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap' },
        // Poppins Font
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' 
        },
        // Playfair Display + Poppins (for body text)
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap' 
        },
        // Font Awesome 6 Free
        { 
          rel: 'stylesheet', 
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css' 
        }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          defer: true
        },
      ],

      meta: [
        { name: 'description', content: 'Premium festive lighting solutions' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  modules: ['@nuxtjs/tailwindcss'],

})