import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const id = getRouterParam(event, 'id')
        if (!id) throw new Error('Missing id')

        const body = await readBody(event)

        if (!body.title?.trim()) throw new Error('Title is required')
        if (!body.slug?.trim()) throw new Error('Slug is required')

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) throw new Error('Not authenticated')

        const { data: existing, error: fetchErr } = await supabase
            .from('projects')
            .select('published_at')
            .eq('id', id)
            .maybeSingle()
        if (fetchErr) throw fetchErr
        if (!existing) throw new Error('Project not found')

        const status = body.status || 'draft'
        const publishedAt =
            status === 'published'
                ? existing.published_at || new Date().toISOString()
                : existing.published_at

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
            published_at: publishedAt,
        }

        const { error } = await supabase
            .from('projects')
            .update(payload)
            .eq('id', id)
        if (error) throw error

        const tagIds: number[] = Array.isArray(body.tag_ids)
            ? body.tag_ids.map(Number)
            : []

        const { data: current, error: curErr } = await supabase
            .from('project_tags')
            .select('tag_id')
            .eq('project_id', id)
        if (curErr) throw curErr

        const currentIds = new Set((current ?? []).map((r) => Number(r.tag_id)))
        const nextIds = new Set(tagIds)

        const toDelete = [...currentIds].filter((t) => !nextIds.has(t))
        const toInsert = [...nextIds].filter((t) => !currentIds.has(t))

        if (toDelete.length) {
            const { error: delErr } = await supabase
                .from('project_tags')
                .delete()
                .eq('project_id', id)
                .in('tag_id', toDelete)
            if (delErr) throw delErr
        }

        if (toInsert.length) {
            const rows = toInsert.map((tag_id) => ({
                project_id: id,
                tag_id,
            }))
            const { error: insErr } = await supabase
                .from('project_tags')
                .insert(rows)
            if (insErr) throw insErr
        }

        return { success: true, id }
    } catch (error) {
        console.error('Error updating project:', error)
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to update project',
        }
    }
})