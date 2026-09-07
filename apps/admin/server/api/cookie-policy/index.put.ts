import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        if (!body.id) {
            throw new Error('ID is required for update')
        }

        const payload = {
            banner_image_url: body.banner_image_url || null,
            title: body.title,
            subtitle: body.subtitle || null,
            short_description: body.short_description || null,
            description: body.description || null,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from("cookie_policy")
            .update(payload)
            .eq("id", body.id)

        if (error) throw error

        return {
            success: true
        }
    } catch (error) {
        console.error("Error updating cookie policy:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update cookie policy"
        }
    }
})