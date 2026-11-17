import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Not authenticated')

        await Promise.all([
            purgeLandingCache(CACHE_MAP.PROJECTS_PUBLIC),
            purgeLandingCache(CACHE_MAP.PROJECTS_ADMIN),
            purgeLandingCache(CACHE_MAP.PROJECT_DETAIL),
        ])

        return { success: true }
    } catch (error) {
        console.error('Error syncing gallery cache:', error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to sync gallery cache',
        }
    }
})