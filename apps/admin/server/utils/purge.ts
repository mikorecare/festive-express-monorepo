import { CACHE_MAP, type CacheKey } from '~~/server/utils/cache-map'

export const purgeLandingCache = async (cacheKey: CacheKey) => {
    try {
        const landingDomain = 'https://festive.express'
        const response = await $fetch<{ success: boolean; message: string }>(`${landingDomain}/api/admin/purge-cache`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.INTERNAL_CACHE_PURGE_SECRET}`
            },
            body: { cacheKey }
        })

        return response
    } catch (error) {
        console.error(`Failed to remote-purge cache target [${cacheKey}]:`, error)
        return { success: false, error }
    }
}
