import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')
        if (!id) throw new Error('Category ID is required')

        // posts.category_id has ON DELETE SET NULL, so affected posts just
        // become uncategorized — no orphan cleanup needed.
        const { error } = await admin
            .from('post_categories')
            .delete()
            .eq('id', id)

        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error deleting category:', error)
        return {
            success: false,
            error:
                error instanceof Error ? error.message : 'Failed to delete category',
        }
    }
})