export default defineEventHandler((event) => {
    const path = event.path || getRequestURL(event).pathname;

    if (!path.startsWith('/api/')) {
        return;
    }

    if (process.env.NODE_ENV === 'development') {
        return;
    }

    const host = getHeader(event, 'host');
    if (!host) {
        return;
    }

    const origin = getHeader(event, 'origin');
    const referer = getHeader(event, 'referer');

    // Check if request is from your own domain
    let isSelfRequest = false;

    if (origin) {
        try {
            const originUrl = new URL(origin);
            const config = useRuntimeConfig();
            const siteDomain = (config.public?.siteUrl || 'http://localhost:3000')
                .replace(/^https?:\/\//, '')
                .replace(/:\d+$/, '');

            if (originUrl.host === siteDomain || originUrl.host === host) {
                isSelfRequest = true;
            }
        } catch (e) { }
    }

    if (!isSelfRequest && referer) {
        try {
            const refererUrl = new URL(referer);
            const config = useRuntimeConfig();
            const siteDomain = (config.public?.siteUrl || 'http://localhost:3000')
                .replace(/^https?:\/\//, '')
                .replace(/:\d+$/, '');

            if (refererUrl.host === siteDomain || refererUrl.host === host) {
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