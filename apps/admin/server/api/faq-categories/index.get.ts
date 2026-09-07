import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('faq_categories')
            .select('id, name')
            .order('sort_order')

        if (error) throw error

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error("Error fetching FAQ categories:", error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : "Failed to fetch FAQ categories"
        }
    }
})