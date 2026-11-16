import { getSupabaseAdmin } from '~~/server/utils/supabase'

const ALLOWED_BUCKETS = new Set(['about-us', 'project-gallery'])
const DEFAULT_BUCKET = 'about-us'

export default defineEventHandler(async (event) => {
    try {
        const admin = getSupabaseAdmin()
        const formData = await readMultipartFormData(event)
        if (!formData) throw new Error('No file uploaded')

        const fileField = formData.find((f) => f.name === 'file')
        const folderField = formData.find((f) => f.name === 'folder')
        const bucketField = formData.find((f) => f.name === 'bucket')
        if (!fileField?.data) throw new Error('File is required')

        const bucket = bucketField?.data?.toString() || DEFAULT_BUCKET
        if (!ALLOWED_BUCKETS.has(bucket)) {
            throw new Error(`Bucket "${bucket}" is not allowed`)
        }

        const folder = folderField?.data?.toString() || 'uploads'
        const ext = fileField.filename?.split('.').pop() || 'jpg'
        const path = `${folder}/${crypto.randomUUID()}.${ext}`

        const { error } = await admin.storage
            .from(bucket)
            .upload(path, fileField.data, {
                contentType: fileField.type,
                upsert: false,
            })
        if (error) throw error

        const { data } = admin.storage.from(bucket).getPublicUrl(path)
        return { success: true, url: data.publicUrl }
    } catch (error) {
        console.error('Upload error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        }
    }
})