import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const itemsPerPage = parseInt(query.limit as string) || 10
        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1

        let queryBuilder = admin
            .from('posts')
            .select(
                `id, title, slug, summary, status, featured_image, published_at, created_at, updated_at,
         category:post_categories ( id, name, slug ),
         post_tags ( tag:tags ( id, name, slug ) )`,
                { count: 'exact' }
            )
            .order('created_at', { ascending: false })
            .range(from, to)

        if (query.status) {
            queryBuilder = queryBuilder.eq('status', query.status as string)
        }
        if (query.category_id) {
            queryBuilder = queryBuilder.eq('category_id', Number(query.category_id))
        }
        if (query.search) {
            queryBuilder = queryBuilder.ilike('title', `%${query.search}%`)
        }

        const { data, error, count } = await queryBuilder
        if (error) throw error

        const transformed = (data || []).map((post: any) => ({
            ...post,
            tags: (post.post_tags || []).map((pt: any) => pt.tag).filter(Boolean),
            post_tags: undefined,
        }))

        return {
            success: true,
            data: transformed,
            pagination: {
                currentPage: page,
                itemsPerPage,
                totalItems: count || 0,
                totalPages: Math.ceil((count || 0) / itemsPerPage),
            },
        }
    } catch (error) {
        console.error('Error fetching posts:', error)
        return {
            success: false,
            data: [],
            pagination: { currentPage: 1, itemsPerPage: 10, totalItems: 0, totalPages: 0 },
            error: error instanceof Error ? error.message : 'Failed to fetch posts',
        }
    }
})