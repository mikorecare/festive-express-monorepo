import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const itemsPerPage = parseInt(query.limit as string) || 10
        const search = (query.search as string) || ''
        const status = (query.status as string) || ''
        const rating = (query.rating as string) || ''
        const isExport = query.export === 'true'
        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1
        const { data: allReviews, error: statsError } = await supabase
            .from('reviews')
            .select('status')

        if (statsError) throw statsError

        const stats = {
            total: allReviews?.length || 0,
            pending: allReviews?.filter((r: any) => r.status === 'pending').length || 0,
            completed: allReviews?.filter((r: any) => r.status === 'completed').length || 0,
            expired: allReviews?.filter((r: any) => r.status === 'expired').length || 0,
        }

        let queryBuilder = supabase
            .from('reviews')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (status) {
            queryBuilder = queryBuilder.eq('status', status)
        }

        if (rating) {
            queryBuilder = queryBuilder.eq('rating_overall', parseInt(rating))
        }

        if (search) {
            queryBuilder = queryBuilder.or(
                `customer_name.ilike.%${search}%,` +
                `order_number.ilike.%${search}%,` +
                `customer_email.ilike.%${search}%`
            )
        }

        if (!isExport) {
            queryBuilder = queryBuilder.range(from, to)
        }

        const { data, error, count } = await queryBuilder

        if (error) throw error

        return {
            success: true,
            data: data || [],
            stats,
            pagination: isExport ? undefined : {
                currentPage: page,
                itemsPerPage: itemsPerPage,
                totalItems: count || 0,
                totalPages: Math.ceil((count || 0) / itemsPerPage)
            }
        }
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return {
            success: false,
            data: [],
            stats: { total: 0, pending: 0, completed: 0, expired: 0 },
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 0
            },
            error: error instanceof Error ? error.message : 'Failed to fetch reviews'
        }
    }
})