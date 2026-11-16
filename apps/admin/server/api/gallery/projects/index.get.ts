
import { getAuthenticatedSupabase } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await getAuthenticatedSupabase(event)
        const query = getQuery(event)

        const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1)
        const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '9'), 10) || 9))
        const from = (page - 1) * limit
        const to = from + limit - 1

        const status = query.status as string | undefined
        const categoryId = query.category_id as string | undefined
        const search = query.search as string | undefined

        let q = supabase
            .from('projects')
            .select(
                `
          id, title, slug, category_id, client_name,
          location_city, location_state, completion_date,
          summary, hero_image_url, hero_image_alt,
          status, published_at, created_at, updated_at,
          post_categories ( id, name, slug )
        `,
                { count: 'exact' },
            )
            .order('created_at', { ascending: false })
            .range(from, to)

        if (status) q = q.eq('status', status)
        if (categoryId) q = q.eq('category_id', categoryId)
        if (search) q = q.ilike('title', `%${search}%`)

        const { data, error, count } = await q
        if (error) throw error

        const total = count ?? data?.length ?? 0
        return {
            success: true,
            data: data ?? [],
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        }
    } catch (error) {
        console.error('Error listing projects:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to load projects',
        }
    }
})