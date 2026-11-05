import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const body = await readBody(event)

        if (!body.storage_path) throw new Error('storage_path is required')
        if (!body.public_url) throw new Error('public_url is required')

        const { data, error } = await admin
            .from('videos')
            .insert({
                post_id: body.post_id || null,
                title: body.title || null,
                storage_path: body.storage_path,
                public_url: body.public_url,
                mime_type: body.mime_type || null,
                size_bytes: body.size_bytes || null,
            })
            .select()
            .single()

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error saving video metadata:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save video',
        }
    }
})