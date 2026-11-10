import { getSupabase } from '~~/server/utils/supabase'

export type AddonCategory = {
    key: string
    label: string
    image_url: string | null
    image_alt: string | null
    description: string | null
    sort_order: number
}

export type AddonProduct = {
    id: string
    slug: string
    name: string
    category: string
    size_label: string | null
    size_value: number | null
    size_unit: string | null
    price: number
    sale_price: number | null
    description: string | null
    is_active: boolean
    sort_order: number
}

export type WreathRibbonBundle = {
    wreath_product_id: string
    ribbon_product_id: string
}

export type AddonsResponse = {
    categories: AddonCategory[]
    products: AddonProduct[]
    bundles: WreathRibbonBundle[]
}

const STORAGE_BUCKET = 'addon-images'

export default defineCachedEventHandler(async () => {
    const supabase = getSupabase()

    const [
        { data: categories, error: catError },
        { data: products, error: prodError },
        { data: bundles, error: bundleError },
    ] = await Promise.all([
        supabase
            .from('addon_categories')
            .select('key, label, image_url, image_alt, description, sort_order')
            .order('sort_order', { ascending: true }),
        supabase
            .from('addon_products')
            .select(
                'id, slug, name, category, size_label, size_value, size_unit, price, sale_price, description, is_active, sort_order',
            )
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
        supabase
            .from('wreath_ribbon_bundles')
            .select('wreath_product_id, ribbon_product_id'),
    ])

    if (catError || prodError || bundleError) {
        console.error('addons list', { catError, prodError, bundleError })
        throw createError({
            statusCode: 500,
            message: 'Failed to load add-ons',
        })
    }

    const transformedCategories = (categories || []).map((cat: any) => {
        let imageUrl = cat.image_url

        if (
            imageUrl &&
            !imageUrl.startsWith('http://') &&
            !imageUrl.startsWith('https://')
        ) {
            const { data: urlData } = supabase
                .storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(imageUrl.replace(/^\/+/, ''))
            imageUrl = urlData?.publicUrl || imageUrl
        }

        return {
            ...cat,
            image_url: imageUrl,
        }
    })

    const response: AddonsResponse = {
        categories: transformedCategories,
        products: (products || []) as AddonProduct[],
        bundles: (bundles || []) as WreathRibbonBundle[],
    }

    return response
}, {
    name: 'addons_catalog_cache',
    maxAge: 60 * 60 * 24 * 7,
    staleMaxAge: 60 * 60 * 24 * 30,
    swr: true,
})