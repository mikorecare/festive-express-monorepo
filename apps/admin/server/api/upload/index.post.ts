import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const formData = await readMultipartFormData(event)

        if (!formData) {
            throw new Error('No file uploaded')
        }

        const fileField = formData.find(field => field.name === 'file')
        const folderField = formData.find(field => field.name === 'folder')

        if (!fileField || !fileField.data) {
            throw new Error('File is required')
        }

        const folder = folderField?.data?.toString() || 'uploads'
        const ext = fileField.filename?.split('.').pop() || 'jpg'
        const path = `${folder}/${Date.now()}.${ext}`

        const { error } = await supabase.storage
            .from('about-us')
            .upload(path, fileField.data, { upsert: true })

        if (error) throw error

        const { data } = supabase.storage.from('about-us').getPublicUrl(path)

        return {
            success: true,
            url: data.publicUrl
        }
    } catch (error) {
        console.error("Upload error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Upload failed"
        }
    }
})