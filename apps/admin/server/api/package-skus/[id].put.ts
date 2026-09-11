import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'
import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) {
            throw new Error('Package SKU ID is required')
        }

        const payload = {
            name: body.name,
            sku: body.sku || null,
            package_id: body.package_id,
            color_key: body.color_key || null,
            color_label: body.color_label || null,
            price: body.price || 0,
            stock: body.stock || 0,
            status: body.status || 'draft',
            description: body.description || null,
            image_url: body.image_url || null,
            is_package: true,
            is_active: true,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', id)
            .eq('is_package', true)

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.SKUS)
        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating package SKU:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update package SKU'
        }
    }
})