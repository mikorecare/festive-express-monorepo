import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw new Error('Product color ID is required')
        }

        const { error } = await supabase
            .from('product_colors')
            .delete()
            .eq('id', id)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error('Error deleting product color:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete product color'
        }
    }
})