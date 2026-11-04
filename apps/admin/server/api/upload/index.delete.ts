import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const body = await readBody(event)

        if (!body.path) {
            throw new Error('File path is required')
        }

        const bucket = body.bucket || 'about-us'

        const { error } = await admin.storage
            .from(bucket)
            .remove([body.path])

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error deleting file:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete file',
        }
    }
})