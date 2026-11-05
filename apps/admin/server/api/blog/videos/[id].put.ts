import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) throw new Error('Video ID is required')

        const { data, error } = await admin
            .from('videos')
            .update({ title: body.title || null })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error updating video:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update video',
        }
    }
})