import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const query = getQuery(event)
        const categoryId = query.categoryId as string

        if (!categoryId) {
            return {
                success: true,
                nextOrder: 1
            }
        }

        const { data, error } = await supabase
            .from('faqs')
            .select('sort_order')
            .eq('category_id', categoryId)
            .order('sort_order', { ascending: false })
            .limit(1)

        if (error) throw error

        const last = (data as { sort_order: number }[] | null)?.[0]?.sort_order
        return {
            success: true,
            nextOrder: (Number(last) || 0) + 1
        }
    } catch (error) {
        console.error("Error fetching next order:", error)
        return {
            success: false,
            nextOrder: 1,
            error: error instanceof Error ? error.message : "Failed to fetch next order"
        }
    }
})