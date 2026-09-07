import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const itemsPerPage = parseInt(query.limit as string) || 10
        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1

        let queryBuilder = supabase
            .from('packages')
            .select(
                'id, name, slug, price, sale_price, sort_order, is_popular, is_active, image_url',
                { count: 'exact' }
            )
            .order('sort_order', { ascending: true })

        queryBuilder = queryBuilder.range(from, to)

        const { data, error, count } = await queryBuilder

        if (error) throw error

        const transformedData = (data || []).map((item) => {
            let imageUrl = item.image_url

            if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                const { data: urlData } = supabase
                    .storage
                    .from('Products')
                    .getPublicUrl(imageUrl.replace(/^\/+/, ''))
                imageUrl = urlData?.publicUrl || imageUrl
            }

            return {
                ...item,
                image_url: imageUrl || null
            }
        })

        return {
            success: true,
            data: transformedData || [],
            pagination: {
                currentPage: page,
                itemsPerPage: itemsPerPage,
                totalItems: count || 0,
                totalPages: Math.ceil((count || 0) / itemsPerPage)
            }
        }
    } catch (error) {
        console.error('Error fetching packages:', error)
        return {
            success: false,
            data: [],
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 0
            },
            error: error instanceof Error ? error.message : 'Failed to fetch packages'
        }
    }
})