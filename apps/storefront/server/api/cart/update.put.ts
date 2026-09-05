import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { cartId, itemId, quantity } = body

    if (!cartId || !itemId || quantity === undefined) {
        throw createError({
            statusCode: 400,
            message: 'Cart ID, Item ID, and quantity are required'
        })
    }

    const supabase = await serverSupabaseClient<any>(event)

    try {
        const { error } = await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("id", itemId)
            .eq("cart_id", cartId)

        if (error) {
            console.error('Update cart item error:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to update cart item'
            })
        }

        return {
            success: true
        }

    } catch (error: any) {
        console.error('Update cart error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to update cart'
        })
    }
})