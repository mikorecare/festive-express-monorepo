import { getHeader, createError, defineEventHandler, getRequestURL } from 'h3'

export default defineEventHandler((event) => {
    const path = event.path || getRequestURL(event).pathname

    if (!path.startsWith('/api/')) {
        return
    }

    if (event.context.nitro) {
        return
    }

    const secFetchMode = getHeader(event, 'sec-fetch-mode')

    if (secFetchMode === 'navigate') {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        })
    }

    // Domain validation for API requests
    const host = getHeader(event, 'host')
    if (!host) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request: Missing host.',
        })
    }

    const config = useRuntimeConfig()
    const siteDomain = (config.public?.siteUrl || 'http://localhost:3000')
        .replace(/^https?:\/\//, '')
        .replace(/:\d+$/, '')

    const origin = getHeader(event, 'origin')
    const referer = getHeader(event, 'referer')
    let isSelfRequest = false

    if (origin) {
        try {
            const originUrl = new URL(origin)
            if (originUrl.host === siteDomain || originUrl.host === host || host.includes(siteDomain)) {
                isSelfRequest = true
            }
        } catch (e) { }
    }

    if (!isSelfRequest && referer) {
        try {
            const refererUrl = new URL(referer)
            if (refererUrl.host === siteDomain || refererUrl.host === host || host.includes(siteDomain)) {
                isSelfRequest = true
            }
        } catch (e) { }
    }

    if (!isSelfRequest && host && (host === siteDomain || host.includes(siteDomain))) {
        isSelfRequest = true
    }

    if (!isSelfRequest) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        })
    }
})