import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { cartId } = body

    if (!cartId) {
        throw createError({
            statusCode: 400,
            message: 'Cart ID is required'
        })
    }

    const supabase = await serverSupabaseClient(event)

    try {
        const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("cart_id", cartId)

        if (error) {
            console.error('Clear cart error:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to clear cart'
            })
        }

        return {
            success: true
        }

    } catch (error: any) {
        console.error('Clear cart error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to clear cart'
        })
    }
})