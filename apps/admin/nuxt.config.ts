// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  ssr: true,

  routeRules: {
    "/admin/**": { ssr: false },
    "/login": { ssr: false },
    "/confirm": { ssr: false },
  },

  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxtjs/turnstile', 'nuxt-security'],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/login"],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  runtimeConfig: {
    azureClientId: process.env.AZURE_CLIENT_ID,
    azureTenantId: process.env.AZURE_TENANT_ID,
    azureClientSecret: process.env.AZURE_CLIENT_SECRET,
    azureRedirectUri: process.env.AZURE_REDIRECT_URI,
    supabaseServiceKey: process.env.NUXT_SUPABASE_SECRET_KEY,
    turnstileSecretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    elavonAccountId: process.env.ELAVON_ACCOUNT_ID || "",
    elavonUserId: process.env.ELAVON_USER_ID || "",
    elavonPin: process.env.ELAVON_PIN || "",
    elavonDemo: process.env.NUXT_ELAVON_DEMO !== "false",
    elavonVendorId: process.env.ELAVON_VENDOR_ID || "",
    elavonPartnerAppId: process.env.ELAVON_PARTNER_APP_ID || "",
    elavonConsumerKey: process.env.ELAVON_CONSUMER_KEY || "",
    elavonConsumerSecret: process.env.ELAVON_CONSUMER_SECRET || "",
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      storageBucket: process.env.NUXT_PUBLIC_STORAGE_BUCKET || 'Products',
      azureClientId: process.env.AZURE_CLIENT_ID,
    },
  },

  css: ["bootstrap/dist/css/bootstrap.min.css", "~/assets/css/main.css"],

  app: {
    head: {
      title: "Festive Express Admin",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap",
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          defer: true
        },
      ],
    },
  },

  router: {
    options: {
      strict: true,
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
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://challenges.cloudflare.com"
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
          "https://challenges.cloudflare.com"
        ],
        'img-src': [
          "'self'",
          "data:",
          "https:",
          "blob:",
          "https://*.supabase.co",
          "https://*.cloudflare.com"
        ],
        'font-src': [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com"
        ],
        'connect-src': [
          "'self'",
          "https:",
          "wss:",
          "https://*.supabase.co",
          "https://challenges.cloudflare.com"
        ],
        'frame-src': [
          "'self'",
          "https://challenges.cloudflare.com"
        ],
        'frame-ancestors': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
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
    routeRules: {
      "/**": {
        headers: {
          'X-Powered-By': 'FLP Express Admin',
        }
      },
      "/api/**": {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      },
      "/_nuxt/**": {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
    },
  },
});
