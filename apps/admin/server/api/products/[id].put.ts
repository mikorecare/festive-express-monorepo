import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const id = getRouterParam(event, 'id')
        const body = await readBody(event)

        if (!id) {
            throw new Error('Product ID is required')
        }

        const { error: productError } = await supabase
            .from('products')
            .update({
                name: body.name,
                description: body.description,
                price: body.price || 0,
                sale_price: body.sale_price || 0,
                stock: body.stock || 0,
                sku: body.sku,
                category_id: body.category_id,
                status: body.status,
                image_url: body.image_url || null,
                has_variations: body.has_variations || false,
                is_package: body.is_package || false,
                package_data: body.package_data || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (productError) throw productError

        const { error: deleteError } = await supabase
            .from('variations')
            .delete()
            .eq('product_id', id)

        if (deleteError) throw deleteError
        if (body.has_variations && body.variations?.length > 0) {
            for (const variation of body.variations) {
                if (!variation.name?.trim()) continue

                const { error: variationError } = await supabase
                    .from('variations')
                    .insert({
                        product_id: id,
                        name: variation.name,
                        options: variation.options || [],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })

                if (variationError) throw variationError
            }
        }

        return {
            success: true
        }
    } catch (error) {
        console.error('Error updating product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update product'
        }
    }
})