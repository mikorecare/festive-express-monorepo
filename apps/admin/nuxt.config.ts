// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enforce Single Page Application (Client-Side Rendering) mode for all routes
  ssr: false,

  routeRules: {
    '/**': { ssr: false }
  },

  modules: ['@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',

  ],

  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login'], // Protects every route except /login
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }
  },

  runtimeConfig: {
    // public: {
    //   apiBase: 'http://localhost:8000/api',   // Change when deploying
    //   imageBase: 'http://localhost:8000'
    // }

    // Private keys (only available server-side)
    azureClientId: process.env.AZURE_CLIENT_ID,
    azureTenantId: process.env.AZURE_TENANT_ID,
    azureClientSecret: process.env.AZURE_CLIENT_SECRET,
    azureRedirectUri: process.env.AZURE_REDIRECT_URI,

    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Public keys exposed to client
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.yourdomain.com',
      storageBucket: process.env.NUXT_PUBLIC_STORAGE_BUCKET || 'Products',

      azureClientId: process.env.AZURE_CLIENT_ID,
    },

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
