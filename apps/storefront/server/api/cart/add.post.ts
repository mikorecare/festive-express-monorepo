import { getSupabase } from '~~/server/utils/supabase'
import { createHash } from 'node:crypto' // 👈 Added for hashing options

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { cartId, productId, quantity, options } = body // 👈 Extract options

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

        // Total price for ONE item (Package + Add-ons)
        const finalUnitPrice = baseUnitPrice + addonsTotal

        // 3. Generate options_hash
        // If there are no options, hash is null.
        // If there are options, we hash them so we can group identical configurations.
        const optionsHash = options
            ? createHash('md5').update(JSON.stringify(options)).digest('hex')
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
                    options: options || null,
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
                    options: options || null,
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