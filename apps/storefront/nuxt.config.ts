import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,

  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/main.css",
    "~/assets/css/pages.css",
  ],

  app: {
    head: {
      titleTemplate: "%s - Festive Express",
      link: [
        { rel: "icon", type: "image/x-icon", href: "Images/favicon.png" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Raleway:wght@400;500;600;700;800;900&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
        },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
          defer: true,
        },
      ],
      meta: [
        { name: "description", content: "Premium festive lighting solutions" },
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase", "@nuxtjs/turnstile", "nuxt-security"],

  turnstile: {
    siteKey:
      process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
  },

  supabase: {
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano: {
        preset: [
          "default",
          {
            mergeLonghand: false,
          },
        ],
      },
    },
  },

  runtimeConfig: {
    // PRIVATE
    convergeMerchantId: process.env.CONVERGE_MERCHANT_ID || "",
    convergeUserId: process.env.CONVERGE_USER_ID || "",
    convergePin: process.env.CONVERGE_PIN || "",
    convergeDemo: process.env.CONVERGE_DEMO !== "false",

    estimatorApiUrl:
      process.env.NUXT_ESTIMATOR_API_URL || "http://52.204.215.130/estimator",

    estimatorAssetUrl:
      process.env.NUXT_ESTIMATOR_ASSET_URL || "http://52.204.215.130",

    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || "",
    },

    supabaseServiceKey: process.env.NUXT_SUPABASE_SECRET_KEY || "",

    elavonAccountId: process.env.ELAVON_ACCOUNT_ID || "",

    elavonUserId: process.env.ELAVON_USER_ID || "",

    elavonPin: process.env.ELAVON_PIN || "",

    elavonDemo: process.env.NUXT_ELAVON_DEMO !== "false",
    elavonVendorId: process.env.ELAVON_VENDOR_ID || "",
    elavonPartnerAppId: process.env.ELAVON_PARTNER_APP_ID || "",
    public: {
      supabaseUrl: process.env.SUPABASE_URL || "",

      supabaseKey: process.env.SUPABASE_KEY || "",

      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3000/api",
    },
  },

  security: {
    nonce: true,

    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],

        'script-src': [
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://embeddable-widgets.pages.dev",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://embeddable-widgets.pages.dev",
          "https://us-assets.i.posthog.com",
          "https://*.posthog.com",
          "https://challenges.cloudflare.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "http://52.204.215.130",
          "https://52.204.215.130",
        ],

        'style-src': [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://embeddable-widgets.pages.dev",
          "https://challenges.cloudflare.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "http://52.204.215.130",
          "https://52.204.215.130",
        ],

        'img-src': [
          "'self'",
          "data:",
          "https:",
          "blob:",
          "https://*.supabase.co",
          "https://phwcfiukyiexdvtccopt.supabase.co",
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://*.posthog.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "http://52.204.215.130",
          "https://52.204.215.130",
        ],

        'font-src': [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "http://52.204.215.130",
          "https://52.204.215.130",
        ],

        'connect-src': [
          "'self'",
          "https:",
          "wss:",
          "https://*.supabase.co",
          "https://embeddable-widgets.pages.dev",
          "https://*.posthog.com",
          "https://us-assets.i.posthog.com",
          "https://challenges.cloudflare.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "https://*.challenges.cloudflare.com",
          "https://brunhild.challenges.cloudflare.com",
          "http://52.204.215.130",
          "https://52.204.215.130",
        ],

        'frame-src': [
          "'self'",
          "https://*.google.com",
          "https://embeddable-widgets.pages.dev",
          "https://challenges.cloudflare.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "http://52.204.215.130",
          "https://52.204.215.130",
        ],

        'frame-ancestors': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': [
          "'self'",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
        ],
        'upgrade-insecure-requests': true,
      },

      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true,
      },

      xFrameOptions: 'SAMEORIGIN',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',

      permissionsPolicy: {
        camera: false,
        microphone: false,
        geolocation: false,
        payment: false,
        usb: false,
      },

      crossOriginResourcePolicy: 'cross-origin',
      crossOriginEmbedderPolicy: 'credentialless',
      crossOriginOpenerPolicy: 'same-origin',
    },
  },

  nitro: {
    minify: true,
    compressPublicAssets: true,
    routeRules: {
      '/**': {
        headers: {
          'X-Powered-By': 'Festive Express',
        }
      },
      '/api/**': {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        }
      },
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      }
    }
  },
});