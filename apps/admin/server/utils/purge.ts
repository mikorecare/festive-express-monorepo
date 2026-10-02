import { CACHE_MAP, type CacheKey } from '~~/server/utils/cache-map'

const LANDING_DOMAINS = [
    'https://festive.express',
    'https://festive-express-monorepo-mu.vercel.app',
]

export const purgeLandingCache = async (cacheKey: CacheKey) => {
    const results = await Promise.all(
        LANDING_DOMAINS.map(async (domain) => {
            try {
                const response = await $fetch<{ success: boolean; message: string }>(
                    `${domain}/api/cache`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${process.env.INTERNAL_CACHE_PURGE_SECRET}`,
                        },
                        body: { cacheKey },
                    },
                )
                return { domain, success: true, response }
            } catch (error) {
                console.error(`Failed to remote-purge cache target [${cacheKey}] on ${domain}:`, error)
                return { domain, success: false, error }
            }
        }),
    )

    const allSucceeded = results.every((r) => r.success)
    return { success: allSucceeded, results }
}