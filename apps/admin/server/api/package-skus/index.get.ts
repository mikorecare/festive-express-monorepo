import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const itemsPerPage = parseInt(query.limit as string) || 10
        const search = (query.search as string) || ''
        const packageId = (query.packageId as string) || ''
        const color = (query.color as string) || ''
        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1

        let queryBuilder = supabase
            .from('products')
            .select(
                'id, name, sku, price, stock, status, image_url, color_label, package_id',
                { count: 'exact' }
            )
            .eq('is_package', true)
            .order('name', { ascending: true })

        if (packageId) {
            queryBuilder = queryBuilder.eq('package_id', packageId)
        }

        if (color) {
            queryBuilder = queryBuilder.eq('color_label', color)
        }

        if (search) {
            queryBuilder = queryBuilder.or(
                `name.ilike.%${search}%,sku.ilike.%${search}%,color_label.ilike.%${search}%`
            )
        }

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
        console.error('Error fetching package SKUs:', error)
        return {
            success: false,
            data: [],
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 0
            },
            error: error instanceof Error ? error.message : 'Failed to fetch package SKUs'
        }
    }
})