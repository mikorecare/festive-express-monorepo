import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        const payload = {
            banner_image_url: body.banner_image_url || null,
            title: body.title,
            subtitle: body.subtitle || null,
            short_description: body.short_description || null,
            description: body.description || null,
            is_active: true,
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from("cookie_policy")
            .insert(payload)
            .select("id")
            .single()

        if (error) throw error

        return {
            success: true,
            id: (data as { id: string }).id
        }
    } catch (error) {
        console.error("Error creating cookie policy:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create cookie policy"
        }
    }
})