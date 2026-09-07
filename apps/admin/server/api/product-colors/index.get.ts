import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('product_colors')
            .select('id, color_key, color_label, hex, swatch_css, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        if (error) {
            throw error
        }

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error fetching product colors:', error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch product colors'
        }
    }
})