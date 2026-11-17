import { getSupabase } from '~~/server/utils/supabase'

const STORAGE_BUCKET = 'project-gallery'

export default defineEventHandler(async (event) => {
    const supabase = getSupabase()
    const slug = getRouterParam(event, 'slug')
    const limit = Number(getQuery(event).limit) || 3

    if (!slug) throw createError({ statusCode: 400, message: 'Slug is required' })

    // 1. Find the current project's tag IDs
    const { data: current, error: currentError } = await supabase
        .from('projects')
        .select('id, project_tags ( tag_id )')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (currentError || !current) {
        throw createError({ statusCode: 404, message: 'Project not found' })
    }

    const tagIds = (current.project_tags || []).map((pt: any) => pt.tag_id)
    if (!tagIds.length) return { projects: [] }

    // 2. Find projects that share any of those tags
    const { data: matches, error: matchError } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            slug,
            summary,
            hero_image_url,
            published_at,
            project_tags!inner ( tag_id )
        `)
        .eq('status', 'published')
        .in('project_tags.tag_id', tagIds)
        .neq('id', current.id)
        .order('published_at', { ascending: false })
        .limit(limit)

    if (matchError) throw matchError

    // 3. De-dupe
    const seen = new Set<string>()
    const unique = (matches || []).filter((p: any) => {
        if (seen.has(p.id)) return false
        seen.add(p.id)
        return true
    })

    return {
        projects: unique.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            summary: p.summary,
            hero_image_url: p.hero_image_url,
            published_at: p.published_at,
        }))
    }
})