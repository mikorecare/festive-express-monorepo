import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw new Error('Order ID is required')
        }

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id)

        if (error) {
            throw error
        }

        return {
            success: true,
            message: 'Order deleted successfully'
        }
    } catch (error) {
        console.error('Error deleting order:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete order'
        }
    }
})