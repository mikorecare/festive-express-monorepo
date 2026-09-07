import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)
        const { data: product, error: productError } = await supabase
            .from('products')
            .insert({
                name: body.name,
                description: body.description,
                price: body.price || 0,
                stock: body.stock || 0,
                sku: body.sku,
                category_id: body.category_id,
                status: body.status,
                image_url: body.image_url || null,
                has_variations: body.has_variations || false,
                is_package: body.is_package || false,
                package_data: body.package_data || null,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select('id')
            .single()

        if (productError) throw productError

        if (body.has_variations && body.variations?.length > 0 && product?.id) {
            for (const variation of body.variations) {
                if (!variation.name?.trim()) continue

                const { error: variationError } = await supabase
                    .from('variations')
                    .insert({
                        product_id: product.id,
                        name: variation.name,
                        options: variation.options || [],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })

                if (variationError) throw variationError
            }
        }

        return {
            success: true,
            id: product?.id
        }
    } catch (error) {
        console.error('Error creating product:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create product'
        }
    }
})