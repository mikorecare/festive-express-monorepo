import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw new Error('Package ID is required')
        }

        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        return {
            success: true,
            data: data || null
        }
    } catch (error) {
        console.error('Error fetching package:', error)
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch package'
        }
    }
})