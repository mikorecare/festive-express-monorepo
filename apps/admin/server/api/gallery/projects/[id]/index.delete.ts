import { getAuthenticatedSupabase } from '~~/server/utils/auth'
import { getSupabaseAdmin } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const id = getRouterParam(event, 'id')
        if (!id) throw new Error('Missing id')

        // RLS-enforced delete (admin only)
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)

        if (error) throw error

        // Best-effort storage cleanup (service role, bypasses RLS)
        const admin = getSupabaseAdmin()
        const marker = '/storage/v1/object/public/project-gallery/'

        const { data: project } = await admin
            .from('projects')
            .select('hero_image_url')
            .eq('id', id)
            .maybeSingle()

        const urls = [project?.hero_image_url].filter(Boolean) as string[]

        const paths = urls
            .map((u) => {
                const i = u.indexOf(marker)
                return i === -1 ? null : u.substring(i + marker.length)
            })
            .filter(Boolean) as string[]

        if (paths.length) {
            await admin.storage.from('project-gallery').remove(paths)
        }

        await Promise.all([
            purgeLandingCache(CACHE_MAP.PROJECTS_PUBLIC),
            purgeLandingCache(CACHE_MAP.PROJECTS_ADMIN),
            purgeLandingCache(CACHE_MAP.PROJECT_DETAIL),
        ])

        return { success: true }
    } catch (error) {
        console.error('Error deleting project:', error)
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to delete project',
        }
    }
})