import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'
import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        const payload = {
            banner_image_url: body.banner_image_url || null,
            title: body.title,
            subtitle: body.subtitle || null,
            description: body.description || null,
            description_image_url: body.description_image_url || null,
            is_active: true,
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from("about_us")
            .insert(payload)
            .select("id")
            .single()

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.ABOUT_US)
        return {
            success: true,
            id: (data as { id: string }).id
        }
    } catch (error) {
        console.error("Error creating about us:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create about us"
        }
    }
})