import { getSupabase } from '~~/server/utils/supabase'

const STORAGE_BUCKET = 'Products'

export default defineEventHandler(async (event) => {
    const cartId = getRouterParam(event, 'id')

    if (!cartId) {
        throw createError({
            statusCode: 400,
            message: 'Cart ID is required'
        })
    }

    const supabase = getSupabase()

    try {
        const { data, error } = await supabase
            .from("cart_items")
            .select(`
                id,
                cart_id,
                product_id,
                quantity,
                price,
                product:products (
                    id,
                    name,
                    price,
                    image_url,
                    sku
                )
            `)
            .eq("cart_id", cartId)

        if (error) {
            console.error('Load cart error:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to load cart'
            })
        }

        const items = (data || []).map((item: any) => {
            let product = item.product || {}

            if (Array.isArray(product)) {
                product = product[0] || {}
            }

            let imageUrl = product.image_url

            if (imageUrl && typeof imageUrl === 'string' &&
                !imageUrl.startsWith('http://') &&
                !imageUrl.startsWith('https://')) {
                const { data: urlData } = supabase
                    .storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(imageUrl.replace(/^\/+/, ''))
                imageUrl = urlData?.publicUrl || imageUrl
            }

            // Return the item with transformed product
            return {
                ...item,
                product: {
                    ...product,
                    image_url: imageUrl
                }
            }
        })

        const count = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)

        return {
            success: true,
            items,
            count
        }

    } catch (error: any) {
        console.error('Cart load error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to load cart'
        })
    }
})