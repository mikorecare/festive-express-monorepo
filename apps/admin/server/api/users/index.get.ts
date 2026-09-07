import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const itemsPerPage = parseInt(query.limit as string) || 10
        const search = (query.search as string) || ''
        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1

        let queryBuilder = supabase
            .from('user_profiles')
            .select(
                'id, display_name, first_name, last_name, email, department, role, phone, mobile_phone',
                { count: 'exact' }
            )
            .order('id', { ascending: false })

        if (search) {
            queryBuilder = queryBuilder.or(
                `display_name.ilike.%${search}%,` +
                `first_name.ilike.%${search}%,` +
                `last_name.ilike.%${search}%,` +
                `email.ilike.%${search}%,` +
                `department.ilike.%${search}%`
            )
        }

        queryBuilder = queryBuilder.range(from, to)

        const { data, error, count } = await queryBuilder

        if (error) throw error

        return {
            success: true,
            data: data || [],
            pagination: {
                currentPage: page,
                itemsPerPage: itemsPerPage,
                totalItems: count || 0,
                totalPages: Math.ceil((count || 0) / itemsPerPage)
            }
        }
    } catch (error) {
        console.error('Error fetching users:', error)
        return {
            success: false,
            data: [],
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 0
            },
            error: error instanceof Error ? error.message : 'Failed to fetch users'
        }
    }
})