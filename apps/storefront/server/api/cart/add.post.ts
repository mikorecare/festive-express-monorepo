import { getSupabase } from '~~/server/utils/supabase'
import { createHash } from 'node:crypto'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { cartId, productId, quantity, options } = body

    if (!cartId || !productId) {
        throw createError({
            statusCode: 400,
            message: 'Cart ID and Product ID are required'
        })
    }

    const supabase = getSupabase()

    try {
        // 1. Fetch the base product
        const { data: productData, error: productError } = await supabase
            .from("products")
            .select("id, price")
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

        // 2. Calculate prices
        const baseUnitPrice = Number(productData.price ?? 0)

        let addonsTotal = 0
        if (options?.addons && Array.isArray(options.addons)) {
            addonsTotal = options.addons.reduce(
                (sum: number, a: any) => sum + (Number(a.price) * Number(a.quantity)),
                0
            )
        }

        const overageAmount = Number(options?.overage?.amount ?? 0)

        // Total price for ONE item (Package + Add-ons + Overage)
        const finalUnitPrice = baseUnitPrice + addonsTotal + overageAmount

        // 3. Generate options_hash
        // We only hash the specific fields that define a unique installation:
        // address, place_id, phone, overage, and the addons (ID + Qty).
        // We DO NOT hash the addon prices, so if prices change slightly, it doesn't create a new row.
        const optionsToHash = options ? {
            address: options.address || "",
            place_id: options.place_id || "",
            phone: options.phone || "",
            overage: options.overage || null,
            addons: options.addons?.map((a: any) => ({
                id: a.product_id,
                qty: a.quantity
            })) || []
        } : null

        const optionsHash = optionsToHash
            ? createHash('md5').update(JSON.stringify(optionsToHash)).digest('hex')
            : null

        // 4. Check if this EXACT configuration is already in the cart
        let existingQuery = supabase
            .from("cart_items")
            .select("id, quantity")
            .eq("cart_id", cartId)
            .eq("product_id", productId)

        if (optionsHash) {
            existingQuery = existingQuery.eq("options_hash", optionsHash)
        } else {
            existingQuery = existingQuery.is("options_hash", null)
        }

        const { data: existing } = await existingQuery.maybeSingle()

        if (existing?.id) {
            // Update existing row
            const { error } = await supabase
                .from("cart_items")
                .update({
                    quantity: (existing.quantity || 0) + quantity,
                    price: finalUnitPrice, // Update price just in case
                    options: options || null, // <--- Saves the full options (including address, phone, addons)
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
            // Insert new row
            const { error } = await supabase
                .from("cart_items")
                .insert({
                    cart_id: cartId,
                    product_id: productId,
                    quantity,
                    price: finalUnitPrice,
                    options: options || null, // <--- Saves the full options (including address, phone, addons)
                    options_hash: optionsHash,
                    is_package: true
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