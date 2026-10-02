import { CACHE_MAP } from '~~/server/utils/cache-map'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { cacheKey } = body
    const config = useRuntimeConfig()
    const authToken = getHeader(event, 'Authorization')
    const expectedSecret =
        config.internalCachePurgeSecret ||
        process.env.INTERNAL_CACHE_PURGE_SECRET

    if (!authToken || authToken !== `Bearer ${expectedSecret}`) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    if (!cacheKey) {
        throw createError({
            statusCode: 400,
            message: 'Missing cacheKey parameter',
        })
    }

    const validKeys = Object.values(CACHE_MAP)
    if (!validKeys.includes(cacheKey)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid cache identifier key',
        })
    }

    try {
        const cacheStorage = useStorage('cache')

        // Match any key that starts with `nitro:handlers:${cacheKey}`
        const prefix = `nitro:handlers:${cacheKey}`
        const allKeys = await cacheStorage.getKeys()
        const matching = allKeys.filter((key) => key.startsWith(prefix))

        if (matching.length === 0) {
            return {
                success: true,
                message: `Cache ${cacheKey} was already clear.`,
                removed: [],
            }
        }

        await Promise.all(
            matching.map((key) => cacheStorage.removeItem(key)),
        )

        return {
            success: true,
            message: `Cache ${cacheKey} flushed successfully (${matching.length} entries).`,
            removed: matching,
        }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message || 'Cache cleanup failed',
        })
    }
})