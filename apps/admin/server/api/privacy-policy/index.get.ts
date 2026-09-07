import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('privacy_policy')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .maybeSingle()

        if (error) throw error

        return {
            success: true,
            data: data || null
        }
    } catch (error) {
        console.error("Error fetching privacy policy:", error)
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Failed to fetch privacy policy"
        }
    }
})