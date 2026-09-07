import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw new Error('Package SKU ID is required')
        }

        const { data, error } = await supabase
            .from('products')
            .select('id, name, sku, price, stock, status, description, image_url, color_key, color_label, package_id, is_package')
            .eq('id', id)
            .eq('is_package', true)
            .single()

        if (error) throw error

        return {
            success: true,
            data: data || null
        }
    } catch (error) {
        console.error('Error fetching package SKU:', error)
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch package SKU'
        }
    }
})