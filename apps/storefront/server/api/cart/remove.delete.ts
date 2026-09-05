import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { cartId, itemId } = body

    if (!cartId || !itemId) {
        throw createError({
            statusCode: 400,
            message: 'Cart ID and Item ID are required'
        })
    }

    const supabase = await serverSupabaseClient(event)

    try {
        const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("id", itemId)
            .eq("cart_id", cartId)

        if (error) {
            console.error('Remove cart item error:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to remove item from cart'
            })
        }

        return {
            success: true
        }

    } catch (error: any) {
        console.error('Remove from cart error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to remove item'
        })
    }
})