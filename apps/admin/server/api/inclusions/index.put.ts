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
            name: body.name,
            slug: body.slug,
            description: body.description || null,
            image_url: body.image_url || null,
            sort_order: body.sort_order || 0,
            color_options: body.color_options || [],
            features: body.features || [],
            specifications: body.specifications || {},
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('inclusion_items')
            .update(payload)
            .eq('id', body.id)

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.INCLUSION_ITEMS)
        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating inclusion:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update inclusion'
        }
    }
})