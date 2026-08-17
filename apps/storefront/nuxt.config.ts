// nuxt.config.ts

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/main.css',
    '~/assets/css/pages.css',
  ],

  app: {
    head: {
      titleTemplate: '%s - Festive Lighting Pros Express',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'Images/favicon.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css' }
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

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],

  supabase: {
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }
  },

  runtimeConfig: {
    supabaseServiceKey: process.env.NUXT_SUPABASE_SECRET_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      flTaxRate: 0.07,
      apiBase: process.env.NUXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000/api'
    }
  },

  vite: {
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console'] : []
    }
  },

  nitro: {
    minify: true,
    compressPublicAssets: true,
    esbuild: {
      options: {
        drop: process.env.NODE_ENV === 'production' ? ['console'] : []
      }
    },
    routeRules: {
      '/**': {
        headers: {
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Cross-Origin-Embedder-Policy': 'credentialless',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'X-Powered-By': 'Festive Express',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://embeddable-widgets.pages.dev https://us-assets.i.posthog.com https://*.posthog.com blob:; worker-src 'self' blob: https://embeddable-widgets.pages.dev; connect-src 'self' https://embeddable-widgets.pages.dev https://*.posthog.com https://us-assets.i.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://embeddable-widgets.pages.dev; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https://*.posthog.com; frame-src 'self' https://embeddable-widgets.pages.dev;"
        }
      },
      '/api/**': {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'X-Powered-By': 'Festive Express API',
        }
      },
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/Images/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      }
    }
  }
})