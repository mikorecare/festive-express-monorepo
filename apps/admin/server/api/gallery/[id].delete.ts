import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw new Error('Gallery item ID is required')
        }

        const { error } = await supabase
            .from('gallery_items')
            .delete()
            .eq('id', id)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error("Error deleting gallery item:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete gallery item"
        }
    }
})