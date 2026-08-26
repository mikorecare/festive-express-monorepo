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

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase", "@nuxtjs/turnstile"],

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
      process.env.NUXT_ESTIMATOR_URL ||
      "http://52.204.215.130/estimator",

    estimatorAssetUrl:
      process.env.NUXT_ESTIMATOR_ASSET_URL ||
      "http://52.204.215.130",

    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || "",
    },

    supabaseServiceKey:
      process.env.NUXT_SUPABASE_SECRET_KEY || "",

    elavonAccountId:
      process.env.ELAVON_ACCOUNT_ID || "",

    elavonUserId:
      process.env.ELAVON_USER_ID || "",

    elavonPin:
      process.env.ELAVON_PIN || "",

    public: {
      supabaseUrl:
        process.env.SUPABASE_URL || "",

      supabaseKey:
        process.env.SUPABASE_KEY || "",

      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        "http://localhost:3000/api",
    },
  },

  nitro: {
    minify: true,
    compressPublicAssets: true,
    routeRules: {
      "/**": {
        headers: {
          "Strict-Transport-Security":
            "max-age=31536000; includeSubDomains; preload",
          "X-Frame-Options": "SAMEORIGIN",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Permissions-Policy":
            "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          "Cross-Origin-Resource-Policy": "cross-origin",
          "Cross-Origin-Embedder-Policy": "credentialless",
          "Cross-Origin-Opener-Policy": "same-origin",
          "X-Powered-By": "Festive Express",
        },
      },
    },
  },
});
