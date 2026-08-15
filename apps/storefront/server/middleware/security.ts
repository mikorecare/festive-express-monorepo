import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event: any) => {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

    event.context.nonce = nonce

    const csp = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://embeddable-widgets.pages.dev https://us-assets.i.posthog.com https://*.posthog.com`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://embeddable-widgets.pages.dev",
        "img-src 'self' data: https: blob: https://*.supabase.co https://*.googleapis.com https://*.gstatic.com https://*.posthog.com",
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
        "connect-src 'self' https: wss: https://*.supabase.co https://embeddable-widgets.pages.dev https://*.posthog.com https://us-assets.i.posthog.com",
        "frame-ancestors 'self'",
        "frame-src 'self' https://*.google.com https://embeddable-widgets.pages.dev",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
    ].join('; ')

    setHeader(event, 'Content-Security-Policy', csp)
    setHeader(event, 'X-Nonce', nonce)
    setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    setHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
    setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()')
    setHeader(event, 'Cross-Origin-Resource-Policy', 'cross-origin')
    setHeader(event, 'Cross-Origin-Embedder-Policy', 'credentialless')
    setHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin')
    setHeader(event, 'X-Powered-By', 'Festive Express')
})