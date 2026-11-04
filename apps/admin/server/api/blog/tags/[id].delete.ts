import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')
        if (!id) throw new Error('Tag ID is required')

        // post_tags has ON DELETE CASCADE on tag_id, so no manual cleanup
        const { error } = await admin.from('tags').delete().eq('id', id)
        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error deleting tag:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete tag',
        }
    }
})