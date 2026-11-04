import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) throw new Error('Post ID is required')
        if (!['draft', 'published', 'archived'].includes(body.status)) {
            throw new Error('Invalid status')
        }

        // Preserve first publish date: only set published_at when
        // transitioning to published AND it was null before.
        const { data: current, error: fetchErr } = await supabase
            .from('posts')
            .select('published_at')
            .eq('id', id)
            .single()
        if (fetchErr) throw fetchErr

        const published_at =
            body.status === 'published'
                ? current?.published_at || new Date().toISOString()
                : current?.published_at || null

        const { error } = await supabase
            .from('posts')
            .update({ status: body.status, published_at, updated_at: new Date().toISOString() })
            .eq('id', id)
        if (error) throw error

        await Promise.all([
            purgeLandingCache(CACHE_MAP.POSTS_PUBLIC),
            purgeLandingCache(CACHE_MAP.POSTS_ADMIN),
        ])

        return { success: true, published_at }
    } catch (error) {
        console.error('Error updating status:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update status',
        }
    }
})