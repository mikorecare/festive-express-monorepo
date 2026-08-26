import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event: any) => {
    if (event.path?.startsWith('/api')) {
        return
    }

    const convergeDomains = [
        'api.demo.convergepay.com',
        'api.convergepay.com',
        'checkout.demo.convergepay.com',
        'checkout.convergepay.com',
        '*.convergepay.com',
    ].join(' ')

    const iframeDomains = [
        'http://52.204.215.130',
        'https://52.204.215.130',
        'http://52.204.215.130/estimator',
        'https://52.204.215.130/estimator'
    ].join(' ')

    const csp = [
        "default-src 'self'",

        `script-src 'self' 'unsafe-inline' 'unsafe-eval' ` +
        `https://cdnjs.cloudflare.com ` +
        `https://cdn.jsdelivr.net ` +
        `https://embeddable-widgets.pages.dev ` +
        `https://us-assets.i.posthog.com ` +
        `https://*.posthog.com ` +
        `https://challenges.cloudflare.com ` +
        convergeDomains,

        `style-src 'self' 'unsafe-inline' ` +
        `https://fonts.googleapis.com ` +
        `https://fonts.gstatic.com ` +
        `https://cdnjs.cloudflare.com ` +
        `https://embeddable-widgets.pages.dev ` +
        `https://challenges.cloudflare.com ` +
        convergeDomains,

        `img-src 'self' data: https: blob: ` +
        `https://*.supabase.co ` +
        `https://*.googleapis.com ` +
        `https://*.gstatic.com ` +
        `https://*.posthog.com ` +
        convergeDomains,

        `font-src 'self' ` +
        `https://fonts.gstatic.com ` +
        `https://cdnjs.cloudflare.com ` +
        `https://cdn.jsdelivr.net`,

        `connect-src 'self' https: wss: ` +
        `https://*.supabase.co ` +
        `https://embeddable-widgets.pages.dev ` +
        `https://*.posthog.com ` +
        `https://us-assets.i.posthog.com ` +
        `https://challenges.cloudflare.com ` +
        convergeDomains,

        `frame-src 'self' ` +
        `https://*.google.com ` +
        `https://embeddable-widgets.pages.dev ` +
        `https://challenges.cloudflare.com ` +
        convergeDomains + ' ' +
        iframeDomains,

        "frame-ancestors 'self'",

        "object-src 'none'",
        "base-uri 'self'",

        `form-action 'self' ` +
        `https://api.demo.convergepay.com ` +
        `https://api.convergepay.com`,

    ].join('; ')

    setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
    setHeader(event, 'Content-Security-Policy', csp)
})
