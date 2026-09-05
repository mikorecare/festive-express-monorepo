
import { serverSupabaseClient } from '#supabase/server'

// Helper function to check if early bird is active (duplicated from composable for server use)
const isEarlyBirdActive = (enabled?: boolean, expiresAt?: string | null) => {
    if (!enabled) return false;
    if (!expiresAt) return true;
    return new Date(expiresAt).getTime() > Date.now();
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { cartId, productId, quantity } = body

    if (!cartId || !productId) {
        throw createError({
            statusCode: 400,
            message: 'Cart ID and Product ID are required'
        })
    }

    const supabase = await serverSupabaseClient<any>(event)

    try {
        const { data: productData, error: productError } = await supabase
            .from("products")
            .select("id, price, sale_price")
            .eq("id", productId)
            .maybeSingle()

        if (productError) {
            console.error('Product fetch error:', productError)
            throw createError({
                statusCode: 500,
                message: 'Failed to fetch product'
            })
        }

        if (!productData) {
            throw createError({
                statusCode: 404,
                message: 'Product not found'
            })
        }

        const { data: settings } = await supabase
            .from("settings")
            .select("key, value")
            .in("key", ["early_bird_enabled", "early_bird_expires_at"])

        let earlyBirdEnabled = false
        let earlyBirdExpiresAt: string | null = null

        if (settings && Array.isArray(settings)) {
            for (const row of settings) {
                const value = typeof row.value === "string" ? row.value.replace(/^"|"$/g, "") : row.value
                if (row.key === "early_bird_enabled") {
                    earlyBirdEnabled = value === "true" || value === "1" || value === "yes"
                }
                if (row.key === "early_bird_expires_at") {
                    earlyBirdExpiresAt = value
                }
            }
        }

        const isEarlyBird = isEarlyBirdActive(earlyBirdEnabled, earlyBirdExpiresAt)
        const unitPrice = isEarlyBird && productData.sale_price != null && Number(productData.sale_price) > 0
            ? Number(productData.sale_price)
            : Number(productData.price ?? 0)

        const { data: existing } = await supabase
            .from("cart_items")
            .select("id, quantity")
            .eq("cart_id", cartId)
            .eq("product_id", productId)
            .maybeSingle()

        if (existing?.id) {
            const { error } = await supabase
                .from("cart_items")
                .update({
                    quantity: (existing.quantity || 0) + quantity,
                    price: unitPrice
                })
                .eq("id", existing.id)

            if (error) {
                console.error('Update cart item error:', error)
                throw createError({
                    statusCode: 500,
                    message: 'Failed to update cart'
                })
            }
        } else {
            const { error } = await supabase
                .from("cart_items")
                .insert({
                    cart_id: cartId,
                    product_id: productId,
                    quantity,
                    price: unitPrice
                })

            if (error) {
                console.error('Insert cart item error:', error)
                throw createError({
                    statusCode: 500,
                    message: 'Failed to add to cart'
                })
            }
        }

        return {
            success: true
        }

    } catch (error: any) {
        console.error('Add to cart error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to add to cart'
        })
    }
})