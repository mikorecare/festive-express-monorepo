import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { guestId } = body

    if (!guestId) {
        throw createError({
            statusCode: 400,
            message: 'Guest ID is required'
        })
    }

    const supabase = await serverSupabaseClient<any>(event)

    try {
        const { data, error } = await supabase
            .from("carts")
            .select("id")
            .eq("guest_id", guestId)
            .order("id", { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error) {
            console.error('Ensure cart select error:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to find cart'
            })
        }

        if (data?.id) {
            return {
                success: true,
                cartId: String(data.id)
            }
        }

        const { data: created, error: insertError } = await supabase
            .from("carts")
            .insert({ guest_id: guestId, total: 0 })
            .select("id")
            .single()

        if (insertError) {
            console.error('Create cart error:', insertError)
            throw createError({
                statusCode: 500,
                message: 'Failed to create cart'
            })
        }

        return {
            success: true,
            cartId: String((created as { id: string }).id)
        }

    } catch (error: any) {
        console.error('Cart ensure error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to ensure cart'
        })
    }
})