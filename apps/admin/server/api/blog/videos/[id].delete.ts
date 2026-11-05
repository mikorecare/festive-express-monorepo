import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')
        if (!id) throw new Error('Video ID is required')

        // 1. Fetch the row so we know the storage path
        const { data: video, error: fetchErr } = await admin
            .from('videos')
            .select('storage_path')
            .eq('id', id)
            .single()

        if (fetchErr || !video) throw new Error('Video not found')

        // 2. Delete the file from storage
        const { error: storageErr } = await admin.storage
            .from('videos')
            .remove([video.storage_path])

        if (storageErr) {
            // Log it, but don't block the DB delete
            console.warn('Storage delete failed (continuing):', storageErr)
        }

        // 3. Delete the row (cascades post_videos)
        const { error } = await admin.from('videos').delete().eq('id', id)
        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error deleting video:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete video',
        }
    }
})