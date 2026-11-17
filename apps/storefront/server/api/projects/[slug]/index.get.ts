import { getSupabase } from '~~/server/utils/supabase'
import { CACHE_MAP } from '~~/server/utils/cache-map'

const STORAGE_BUCKET = 'project-gallery'

export default defineCachedEventHandler(async (event) => {
    const supabase = getSupabase()
    const slug = getRouterParam(event, 'slug')

    if (!slug) throw createError({ statusCode: 400, message: 'Slug is required' })

    const { data, error } = await supabase
        .from('projects')
        .select(`
            *,
            category:post_categories ( id, name, slug ),
            project_tags ( tag:tags ( id, name, slug ) ),
            project_images ( id, image_url, alt_text, title, caption, description, room_or_area, sort_order, is_featured )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (error || !data) {
        throw createError({ statusCode: 404, message: 'Project not found' })
    }

    // Sort images natively (in case PostgREST doesn't respect referencedTable ordering properly)
    const sortedImages = (data.project_images || []).sort(
        (a: any, b: any) => a.sort_order - b.sort_order
    )

    return {
        ...data,
        tags: (data.project_tags || []).map((pt: any) => pt.tag).filter(Boolean),
        project_tags: undefined,
        images: sortedImages,
        project_images: undefined,
    }
}, {
    name: CACHE_MAP.PROJECT_DETAIL,
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true,
    getKey: (event) => event.path,
})