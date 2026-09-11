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
            steps: body.steps || [],
            footer_description: body.footer_description || null,
            is_active: true,
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('how_it_works')
            .insert(payload)
            .select('id')
            .single()

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.HOW_IT_WORKS)
        return {
            success: true,
            id: (data as { id: string }).id
        }
    } catch (error) {
        console.error("Error creating how it works:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create how it works"
        }
    }
})