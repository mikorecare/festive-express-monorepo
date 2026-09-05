import { serverSupabaseClient } from '#supabase/server'

type ProductColor = {
    id: string
    color_key: string
    color_label: string
    hex: string
    swatch_css: string | null
    sort_order: number
}

type ProductColorsResponse = {
    success: boolean
    data: ProductColor[]
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from('product_colors')
            .select('id, color_key, color_label, hex, swatch_css, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        if (error) {
            console.error('Product colors fetch error:', error)
            throw createError({
                statusCode: 500,
                message: 'Failed to load product colors'
            })
        }

        return {
            success: true,
            data: data || []
        }

    } catch (error: any) {
        console.error('Product colors API error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to load product colors'
        })
    }
})