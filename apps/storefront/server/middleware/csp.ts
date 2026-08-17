import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event: any) => {
    if (event.path?.startsWith('/api')) {
        return
    }

    const csp = [
        "default-src 'self'",
        `script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://embeddable-widgets.pages.dev https://us-assets.i.posthog.com https://*.posthog.com`,
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
})