export default defineEventHandler((event) => {
    const path = event.path || getRequestURL(event).pathname;

    if (!path.startsWith('/api/')) {
        return;
    }

    const userAgent = getHeader(event, 'user-agent') || '';
    const isSSRFetch =
        !userAgent ||
        userAgent.toLowerCase().includes('ofetch') ||
        userAgent.toLowerCase().includes('node-fetch') ||
        userAgent.toLowerCase().includes('undici') ||
        (!getHeader(event, 'sec-ch-ua') && !getHeader(event, 'origin') && !getHeader(event, 'referer'));

    if (isSSRFetch) {
        return;
    }

    const host = getHeader(event, 'host');
    if (!host) {
        return;
    }

    const origin = getHeader(event, 'origin');
    const referer = getHeader(event, 'referer');

    let isSelfRequest = false;

    if (origin) {
        try {
            const originUrl = new URL(origin);
            const config = useRuntimeConfig();
            const siteDomain = (config.public?.siteUrl || 'http://localhost:3000')
                .replace(/^https?:\/\//, '')
                .replace(/:\d+$/, '');

            // Fallback to match production proxy configurations securely
            if (originUrl.host === siteDomain || originUrl.host === host || host.includes(siteDomain)) {
                isSelfRequest = true;
            }
        } catch (e) { }
    }

    // 3. Validate Referer (Fallback)
    if (!isSelfRequest && referer) {
        try {
            const refererUrl = new URL(referer);
            const config = useRuntimeConfig();
            const siteDomain = (config.public?.siteUrl || 'http://localhost:3000')
                .replace(/^https?:\/\//, '')
                .replace(/:\d+$/, '');

            if (refererUrl.host === siteDomain || refererUrl.host === host || host.includes(siteDomain)) {
                isSelfRequest = true;
            }
        } catch (e) { }
    }

    if (!isSelfRequest) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: Direct API access is prohibited.',
        });
    }
});
