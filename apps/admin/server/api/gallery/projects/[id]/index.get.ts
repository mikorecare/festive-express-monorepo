import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const id = getRouterParam(event, 'id')
        if (!id) throw new Error('Missing id')

        const isUuid = /^[0-9a-f-]{36}$/i.test(id)

        let q = supabase
            .from('projects')
            .select(`
              id, title, slug, category_id, client_name,
              location_city, location_state, completion_date,
              summary, description,
              hero_image_url, hero_image_alt, hero_image_title, hero_seo,
              status, published_at, created_at, updated_at,
              post_categories ( id, name, slug ),
              project_tags ( tag_id, tags ( id, name, slug ) ),
              project_images ( id, image_url, alt_text, title, caption, description, room_or_area, sort_order, is_featured )
            `)

        q = isUuid ? q.eq('id', id) : q.eq('slug', id)
        q = q.order('sort_order', { referencedTable: 'project_images', ascending: true })

        const { data, error } = await q.maybeSingle()
        if (error) throw error
        if (!data) throw new Error('Project not found')

        return { success: true, data }
    } catch (error) {
        console.error('Error fetching project:', error)
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to load project',
        }
    }
})