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

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  sitemap: {
    exclude: [
      '/admin/**',
      '/dashboard/**',
      '/api/**',
      '/auth/**',
      '/checkout/**',
      '/account/**',
      '/cart-back',
      '/packages-back',
      '/packages-back2NEW',
      '/preview-your-home.back',
      '/**/*back*',
      '/**/*BACK*',
      '/**/*.back',
      '/reviews',
      '/membership',
      '/track-order',
      '/track-order-backup',
    ],
    autoLastmod: true,
  },

  app: {
    head: {
      titleTemplate: "%s - Festive Express",
      htmlAttrs: {
        lang: "en-US",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "Images/favicon.png" },
        { rel: "canonical", href: "https://festive.express" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "preconnect", href: "https://cdnjs.cloudflare.com" },
        { rel: "preconnect", href: "https://cdn.jsdelivr.net" },
        {
          rel: "preload",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Raleway:wght@400;500;600;700;800;900&display=swap",
          as: "style"
        },

        // Original stylesheets
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
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Festive Express",
            description: "Professional holiday lighting installation and removal services in Sarasota, Bradenton, and Lakewood Ranch. Premium Christmas light installation for homes and businesses.",
            image: "https://festive.express/Images/logo.png",
            "@id": "https://festive.express",
            url: "https://festive.express",
            telephone: "+19412394722",
            email: "info@festive.express",
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1973 Northgate Blvd",
              addressLocality: "Sarasota",
              addressRegion: "FL",
              postalCode: "34234",
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 27.3712,
              longitude: -82.5298,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "07:00",
                closes: "20:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Sunday",
                opens: "08:00",
                closes: "18:00",
              },
            ],
            sameAs: [
              "https://www.facebook.com/flp-express",
              "https://www.instagram.com/flp-express",
              "https://www.x.com/flp-express",
              "https://www.youtube.com/flp-express",
              "https://www.pinterest.com/flp-express",
            ],
          }),
        },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Premium festive lighting solutions in Florida. Professional holiday light setup, custom displays, and residential services out of Sarasota." },
        { name: "robots", content: "index, follow" },
        { name: "googlebot", content: "index, follow" },
        { property: "og:title", content: "Festive Express - Premium Festive & Holiday Lighting" },
        { property: "og:description", content: "Professional festive lighting solutions based in Sarasota, FL. Transform your home with customized holiday installation plans." },
        { property: "og:image", content: "https://festive.express/Images/FE-Logo-2.png" },
        { property: "og:url", content: "https://festive.express" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Festive Express" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Festive Express - Premium Festive & Holiday Lighting" },
        { name: "twitter:description", content: "Professional festive lighting solutions based in Sarasota, FL. Transform your home with customized holiday installation plans." },
        { name: "twitter:image", content: "https://festive.express/Images/FE-Logo-2.png" },
      ],
    },
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase", "@nuxtjs/turnstile", "nuxt-security", '@nuxtjs/sitemap'],

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
    // PRIVATE - Server only
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
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://us-assets.i.posthog.com",
          "https://*.posthog.com",
          "https://challenges.cloudflare.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "https://chat.actm.xyz",
          "https://challenges.cloudflare.com",
          "https://*.cloudflare.com",
        ],

        'style-src': [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://challenges.cloudflare.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "https://chat.actm.xyz",
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
          "https://chat.actm.xyz",
        ],

        'font-src': [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
        ],

        'connect-src': [
          "'self'",
          "https:",
          "wss:",
          "https://*.supabase.co",
          "https://*.posthog.com",
          "https://us-assets.i.posthog.com",
          "https://challenges.cloudflare.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "https://*.challenges.cloudflare.com",
          "https://brunhild.challenges.cloudflare.com",
          "https://chat.actm.xyz",
          "wss://chat.actm.xyz",
          "https://brunhild.challenges.cloudflare.com",
          "wss://*.challenges.cloudflare.com",
        ],

        'frame-src': [
          "'self'",
          "https://*.google.com",
          "https://challenges.cloudflare.com",
          "https://api.demo.convergepay.com",
          "https://api.convergepay.com",
          "https://checkout.demo.convergepay.com",
          "https://checkout.convergepay.com",
          "https://chat.actm.xyz",
          "https://challenges.cloudflare.com",
          "https://*.challenges.cloudflare.com",
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

  routeRules: {
    '/**': {
      headers: {
        'alt-svc': 'h3=":443"; ma=86400',
      }
    }
  },

  nitro: {
    minify: true,
    compressPublicAssets: true, // This enables Brotli/gzip automatically
    routeRules: {
      '/api/**': {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
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
      },
      '/fonts/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      }
    }
  }
});