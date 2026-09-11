import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'
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
            description: body.description || null,
            description_image_url: body.description_image_url || null,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from("about_us")
            .update(payload)
            .eq("id", body.id)

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.ABOUT_US)
        return {
            success: true
        }
    } catch (error) {
        console.error("Error updating about us:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update about us"
        }
    }
})