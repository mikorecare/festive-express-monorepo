import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('faqs')
            .select(`
        id,
        question,
        answer,
        sort_order,
        is_active,
        category_id,
        category:faq_categories (
          id,
          name
        )
      `)
            .order('sort_order', { ascending: true })

        if (error) throw error

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error("Error fetching FAQs:", error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : "Failed to fetch FAQs"
        }
    }
})