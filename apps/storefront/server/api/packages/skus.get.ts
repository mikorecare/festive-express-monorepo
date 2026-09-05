import { serverSupabaseClient } from '#supabase/server'

type SkuRow = {
    id: string | number
    name: string
    price?: number | string | null
    sale_price?: number | string | null
    stock?: number | null
    image_url?: string | null
    package_id: string | number
    color_key?: string | null
    color_label?: string | null
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("products")
            .select(
                "id, name, price, sale_price, stock, image_url, package_id, color_key, color_label"
            )
            .eq("is_package", true)
            .eq("is_active", true)

        if (error) {
            console.error("SKUs fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load SKUs"
            })
        }

        const bucket = 'Products'

        const transformedData = (data || []).map((sku: any) => {
            let imageUrl = sku.image_url
            if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                const { data: urlData } = supabase
                    .storage
                    .from(bucket)
                    .getPublicUrl(imageUrl.replace(/^\/+/, ''))
                imageUrl = urlData?.publicUrl || imageUrl
            }
            return {
                ...sku,
                image_url: imageUrl
            }
        })

        return {
            success: true,
            data: transformedData
        }

    } catch (error: any) {
        console.error("SKUs API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load SKUs"
        })
    }
})