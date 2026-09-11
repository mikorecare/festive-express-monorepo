import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'
import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        const payload = {
            year: body.year || null,
            description: body.description || null,
            image_url: body.image_url,
            image_position: body.image_position || 'right',
            divider_image_url: body.divider_image_url || null,
            sort_order: body.sort_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('gallery_items')
            .insert(payload)

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.GALLERY)
        return {
            success: true
        }
    } catch (error) {
        console.error("Error creating gallery item:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create gallery item"
        }
    }
})