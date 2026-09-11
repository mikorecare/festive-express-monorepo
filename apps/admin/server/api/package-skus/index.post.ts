import { CACHE_MAP } from '~~/server/utils/cache-map'
import { purgeLandingCache } from '~~/server/utils/purge'
import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

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
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('products')
            .insert(payload)
            .select('id')
            .single()

        if (error) throw error
        await purgeLandingCache(CACHE_MAP.SKUS)
        return {
            success: true,
            id: (data as { id: string }).id
        }
    } catch (error) {
        console.error('Error creating package SKU:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create package SKU'
        }
    }
})