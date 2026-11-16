import { getSupabase } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'

const STORAGE_BUCKET = 'project-gallery'

export default defineCachedEventHandler(async (event) => {
    const supabase = getSupabase()
    const query = getQuery(event)
    const limit = Number(query.limit) || 100

    const { data, error } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            slug,
            summary,
            hero_image_url,
            location_city,
            location_state,
            completion_date,
            published_at,
            category:post_categories ( id, name, slug ),
            project_tags ( tag: tags ( id, name, slug ) ),
            project_images ( id, image_url, sort_order )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('project list', error)
        throw createError({ statusCode: 500, message: 'Failed to load projects' })
    }

    // Transform the junction table arrays (project_tags) into flat tag arrays
    const transformed = (data || []).map((p: any) => ({
        ...p,
        tags: (p.project_tags || []).map((pt: any) => pt.tag).filter(Boolean),
        project_tags: undefined,
    }))

    return { projects: transformed }
}, {
    name: CACHE_MAP.PROJECTS_PUBLIC,
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true,
})