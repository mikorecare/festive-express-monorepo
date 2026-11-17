import { getSupabase } from '~~/server/utils/supabase'

const STORAGE_BUCKET = 'project-gallery'

export default defineEventHandler(async (event) => {
    const supabase = getSupabase()
    const slug = getRouterParam(event, 'slug')

    if (!slug) throw createError({ statusCode: 400, message: 'Tag slug is required' })

    // 1. Get the tag by slug
    const { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('id, name, slug')
        .eq('slug', slug)
        .single()

    if (tagError || !tag) {
        throw createError({ statusCode: 404, message: 'Tag not found' })
    }

    // 2. Get projects that have this tag
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            slug,
            summary,
            hero_image_url,
            location_city,
            location_state,
            published_at,
            category:post_categories ( id, name, slug ),
            project_tags!inner ( tag_id )
        `)
        .eq('status', 'published')
        .eq('project_tags.tag_id', tag.id)
        .order('published_at', { ascending: false })

    if (projectsError) throw projectsError

    return {
        tag,
        projects: (projects || []).map((p: any) => ({
            ...p,
            project_tags: undefined // remove junction data
        }))
    }
})