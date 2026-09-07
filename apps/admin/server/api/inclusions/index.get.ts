import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('inclusion_items')
            .select('id, name, slug, description, image_url, sort_order, color_options, features, specifications')
            .order('sort_order', { ascending: true })

        if (error) throw error

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error fetching inclusions:', error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch inclusions'
        }
    }
})