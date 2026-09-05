import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event)

        const { data, error } = await supabase
            .from('about_us')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .maybeSingle()

        if (error) {
            throw error
        }

        return {
            success: true,
            data: data || null
        }
    } catch (error) {
        console.error('Error fetching about us content:', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch about us content',
            data: null
        }
    }
})