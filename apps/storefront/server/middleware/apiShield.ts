export default defineEventHandler((event) => {
    const path = event.path || getRequestURL(event).pathname;

    if (!path.startsWith('/api/')) {
        return;
    }

    if (event.context.nitro) {
        return;
    }

    const host = getHeader(event, 'host');
    if (!host) {
        // Drop network calls that don't pass an HTTP host identity
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request: Missing host execution wrapper.',
        });
    }

    const origin = getHeader(event, 'origin');
    const referer = getHeader(event, 'referer');
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

    // Validate Client Referer (Fallback)
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
