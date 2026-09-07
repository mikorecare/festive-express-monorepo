import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('how_it_works')
            .select('id, banner_image_url, title, subtitle, steps, footer_description')
            .eq('is_active', true)
            .limit(1)
            .maybeSingle()

        if (error) throw error

        return {
            success: true,
            data: data || null
        }
    } catch (error) {
        console.error("Error fetching how it works:", error)
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Failed to fetch how it works"
        }
    }
})