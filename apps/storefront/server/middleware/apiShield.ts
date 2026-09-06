export default defineEventHandler((event) => {
    const path = event.path || getRequestURL(event).pathname;

    if (!path.startsWith('/api/')) {
        return;
    }

    const userAgent = getHeader(event, 'user-agent') || '';
    const origin = getHeader(event, 'origin');
    const referer = getHeader(event, 'referer');
    const host = getHeader(event, 'host') || '';
    const isSSRFetch =
        !userAgent ||
        userAgent.toLowerCase().includes('ofetch') ||
        userAgent.toLowerCase().includes('node-fetch') ||
        userAgent.toLowerCase().includes('undici') ||
        userAgent.toLowerCase().includes('nitro') ||
        (!getHeader(event, 'sec-ch-ua') && !origin && !referer);

    if (isSSRFetch) {
        return;
    }

    if (!host) {
        return;
    }

    let isSelfRequest = false;
    const config = useRuntimeConfig();
    const siteDomain = (config.public?.siteUrl || 'http://localhost:3000')
        .replace(/^https?:\/\//, '')
        .replace(/:\d+$/, '');

    if (origin) {
        try {
            const originUrl = new URL(origin);
            if (originUrl.host === siteDomain || originUrl.host === host || host.includes(siteDomain)) {
                isSelfRequest = true;
            }
        } catch (e) { }
    }

    if (!isSelfRequest && referer) {
        try {
            const refererUrl = new URL(referer);
            if (refererUrl.host === siteDomain || refererUrl.host === host || host.includes(siteDomain)) {
                isSelfRequest = true;
            }
        } catch (e) { }
    }

    if (!isSelfRequest && host && (host === siteDomain || host.includes(siteDomain))) {
        isSelfRequest = true;
    }

    if (!isSelfRequest) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: Direct API access is prohibited.',
        });
    }
});
