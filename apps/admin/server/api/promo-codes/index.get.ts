import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error fetching promo codes:', error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch promo codes'
        }
    }
})