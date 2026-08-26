import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event: any) => {
    if (event.path?.startsWith('/api')) {
        return
    }

    const csp = [
        "default-src 'self'",

        // Script sources - includes Converge/Elavon domains
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
        "https://cdnjs.cloudflare.com " +
        "https://cdn.jsdelivr.net " +
        "https://embeddable-widgets.pages.dev " +
        "https://us-assets.i.posthog.com " +
        "https://*.posthog.com " +
        "https://challenges.cloudflare.com " +
        "https://api.demo.convergepay.com " +
        "https://api.convergepay.com " +
        "https://*.convergepay.com",

        // Style sources
        "style-src 'self' 'unsafe-inline' " +
        "https://fonts.googleapis.com " +
        "https://fonts.gstatic.com " +
        "https://cdnjs.cloudflare.com " +
        "https://embeddable-widgets.pages.dev " +
        "https://challenges.cloudflare.com " +
        "https://api.demo.convergepay.com " +
        "https://api.convergepay.com",

        // Image sources
        "img-src 'self' data: https: blob: " +
        "https://*.supabase.co " +
        "https://*.googleapis.com " +
        "https://*.gstatic.com " +
        "https://*.posthog.com " +
        "https://*.convergepay.com",

        // Font sources
        "font-src 'self' " +
        "https://fonts.gstatic.com " +
        "https://cdnjs.cloudflare.com " +
        "https://cdn.jsdelivr.net",

        // Connect sources - for API calls
        "connect-src 'self' https: wss: " +
        "https://*.supabase.co " +
        "https://embeddable-widgets.pages.dev " +
        "https://*.posthog.com " +
        "https://us-assets.i.posthog.com " +
        "https://challenges.cloudflare.com " +
        "https://api.demo.convergepay.com " +
        "https://api.convergepay.com " +
        "https://*.convergepay.com",

        // Frame sources - for iframes/popups
        "frame-src 'self' " +
        "https://*.google.com " +
        "https://embeddable-widgets.pages.dev " +
        "https://challenges.cloudflare.com " +
        "https://api.demo.convergepay.com " +
        "https://api.convergepay.com " +
        "https://*.convergepay.com " +
        "https://checkout.demo.convergepay.com " +
        "https://checkout.convergepay.com",

        // Frame ancestors
        "frame-ancestors 'self'",

        // Object sources
        "object-src 'none'",

        // Base URI
        "base-uri 'self'",

        // Form actions
        "form-action 'self' " +
        "https://api.demo.convergepay.com " +
        "https://api.convergepay.com",

        // Upgrade insecure requests
        "upgrade-insecure-requests",
    ].join('; ')

    setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
    setHeader(event, 'Content-Security-Policy', csp)
})