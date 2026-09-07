import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw new Error('Package ID is required')
        }

        const { data, error } = await supabase
            .from('package_inclusions')
            .select('inclusion_item_id, quantity, is_included')
            .eq('package_id', id)

        if (error) throw error

        return {
            success: true,
            data: data || []
        }
    } catch (error) {
        console.error('Error fetching package inclusions:', error)
        return {
            success: false,
            data: [],
            error: error instanceof Error ? error.message : 'Failed to fetch package inclusions'
        }
    }
})