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
      titleTemplate: '%s - Festive Express',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'Images/favicon.png' },
        { rel: 'stylesheet', href: 'https://googleapis.com' },
        { rel: 'stylesheet', href: 'https://googleapis.com' },
        { rel: 'stylesheet', href: 'https://googleapis.com' },
        { rel: 'stylesheet', href: 'https://cloudflare.com' }
      ],
      script: [
        {
          src: 'https://jsdelivr.net',
          defer: true
        }
      ],
      meta: [
        { name: 'description', content: 'Premium festive lighting solutions' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxtjs/turnstile'],

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
  },

  supabase: {
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }
  },

  runtimeConfig: {
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    },
    supabaseServiceKey: process.env.NUXT_SUPABASE_SECRET_KEY,
    elavonAccountId: process.env.ELAVON_ACCOUNT_ID,
    elavonUserId: process.env.ELAVON_USER_ID,
    elavonPin: process.env.ELAVON_PIN,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      flTaxRate: 0.07,
      apiBase: process.env.NUXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000/api',
    }
  },

  nitro: {
    minify: true,
    compressPublicAssets: true,
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

          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://jsdelivr.net https://pages.dev https://posthog.com https://*.posthog.com https://challenges.cloudflare.com; worker-src 'self' blob: https://pages.dev; connect-src 'self' https://pages.dev https://*.posthog.com https://posthog.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://googleapis.com https://pages.dev https://challenges.cloudflare.com; font-src 'self' https://gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https://*.posthog.com; frame-src 'self' https://pages.dev https://challenges.cloudflare.com;"
        }
      }
    }
  }
})
