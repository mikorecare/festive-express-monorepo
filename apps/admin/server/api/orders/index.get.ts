
import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const itemsPerPage = parseInt(query.limit as string) || 10
        const search = (query.search as string) || ''
        const status = (query.status as string) || ''
        const paymentStatus = (query.paymentStatus as string) || ''
        const isExport = query.export === 'true'
        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1

        let queryBuilder = supabase
            .from('orders')
            .select(
                `
        *,
        promo_codes (
          code,
          discount_type,
          discount_value
        )
        `,
                { count: 'exact' }
            )
            .order('created_at', { ascending: false })

        if (status) {
            queryBuilder = queryBuilder.eq('status', status)
        }

        if (paymentStatus) {
            queryBuilder = queryBuilder.eq('payment_status', paymentStatus)
        }

        if (search) {
            queryBuilder = queryBuilder.or(
                `order_number.ilike.%${search}%,` +
                `billing_first_name.ilike.%${search}%,` +
                `billing_last_name.ilike.%${search}%,` +
                `billing_email.ilike.%${search}%`
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
            pagination: isExport ? undefined : {
                currentPage: page,
                itemsPerPage: itemsPerPage,
                totalItems: count || 0,
                totalPages: Math.ceil((count || 0) / itemsPerPage)
            }
        }
    } catch (error) {
        console.error('Error fetching orders:', error)
        return {
            success: false,
            data: [],
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 0
            },
            error: error instanceof Error ? error.message : 'Failed to fetch orders'
        }
    }
})