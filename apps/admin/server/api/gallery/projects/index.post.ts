import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const body = await readBody(event)

        if (!body.title?.trim()) throw new Error('Title is required')
        if (!body.slug?.trim()) throw new Error('Slug is required')

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) throw new Error('Not authenticated')

        const status = body.status || 'draft'

        const payload = {
            title: body.title.trim(),
            slug: body.slug.trim(),
            category_id: body.category_id ?? null,
            client_name: body.client_name || null,
            location_city: body.location_city || null,
            location_state: body.location_state || null,
            completion_date: body.completion_date || null,
            summary: body.summary || null,
            description: body.description || null,
            hero_image_url: body.hero_image_url || null,
            hero_image_alt: body.hero_image_alt || null,
            hero_image_title: body.hero_image_title || null,
            hero_seo: body.hero_seo || {},
            status,
            published_at:
                status === 'published'
                    ? body.published_at || new Date().toISOString()
                    : body.published_at || null,
        }

        const { data: project, error } = await supabase
            .from('projects')
            .insert(payload)
            .select('id')
            .single()

        if (error) throw error

        const tagIds: number[] = Array.isArray(body.tag_ids)
            ? body.tag_ids.map(Number)
            : []
        if (tagIds.length) {
            const rows = tagIds.map((tag_id) => ({
                project_id: project.id,
                tag_id,
            }))
            const { error: tagError } = await supabase
                .from('project_tags')
                .insert(rows)
            if (tagError) throw tagError
        }

        return { success: true, id: project.id }
    } catch (error) {
        console.error('Error creating project:', error)
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to create project',
        }
    }
})