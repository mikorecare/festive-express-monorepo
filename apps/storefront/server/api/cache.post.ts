import { CACHE_MAP } from '~~/server/utils/cache-map'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { cacheKey } = body
    const config = useRuntimeConfig()
    const authToken = getHeader(event, 'Authorization')
    const expectedSecret = config.internalCachePurgeSecret || process.env.INTERNAL_CACHE_PURGE_SECRET

    if (!authToken || authToken !== `Bearer ${expectedSecret}`) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    if (!cacheKey) {
        throw createError({ statusCode: 400, message: 'Missing cacheKey parameter' })
    }

    const validKeys = Object.values(CACHE_MAP)
    if (!validKeys.includes(cacheKey)) {
        throw createError({ statusCode: 400, message: 'Invalid cache identifier key' })
    }

    try {
        const storage = useStorage('cache:nitro:handlers')
        const targetFile = `${cacheKey}.json`

        if (await storage.hasItem(targetFile)) {
            await storage.removeItem(targetFile)
            return { success: true, message: `Cache ${cacheKey} flushed successfully.` }
        }

        return { success: true, message: `Cache ${cacheKey} was already clear.` }
    } catch (error: any) {
        throw createError({ statusCode: 500, message: error.message || 'Cache cleanup failed' })
    }
})
