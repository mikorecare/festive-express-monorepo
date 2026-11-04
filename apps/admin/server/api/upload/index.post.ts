import { getSupabaseAdmin } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    console.log("HI")
    try {
        const admin = getSupabaseAdmin()
        const formData = await readMultipartFormData(event)
        if (!formData) throw new Error('No file uploaded')

        const fileField = formData.find((f) => f.name === 'file')
        const folderField = formData.find((f) => f.name === 'folder')
        if (!fileField?.data) throw new Error('File is required')

        const folder = folderField?.data?.toString() || 'uploads'
        const ext = fileField.filename?.split('.').pop() || 'jpg'
        const path = `${folder}/${crypto.randomUUID()}.${ext}`

        const { error } = await admin.storage
            .from('about-us')
            .upload(path, fileField.data, {
                contentType: fileField.type,
                upsert: false,
            })
        if (error) throw error

        const { data } = admin.storage.from('about-us').getPublicUrl(path)
        return { success: true, url: data.publicUrl }
    } catch (error) {
        console.error('Upload error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        }
    }
})