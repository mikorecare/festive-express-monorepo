import { serverSupabaseClient } from '#supabase/server'

type InclusionItem = {
    id: string
    name: string
    slug?: string
    image_url?: string | null
}

type PackageInclusion = {
    quantity: number
    is_included: boolean
    label_override?: string | null
    sort_order?: number
    inclusion_items?: InclusionItem | null
}

type PackageRow = {
    id: string | number
    name: string
    slug: string
    description?: string | null
    price?: number | string | null
    sale_price?: number | string | null
    title_image_url?: string | null
    icon_url?: string | null
    is_popular?: boolean
    sort_order?: number
    package_inclusions?: PackageInclusion[]
}

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from("packages")
            .select(`
                id, 
                name, 
                slug, 
                description, 
                price, 
                sale_price,
                title_image_url, 
                icon_url, 
                is_popular, 
                sort_order,
                package_inclusions (
                    quantity, 
                    is_included, 
                    label_override, 
                    sort_order,
                    inclusion_items (
                        id, 
                        name, 
                        slug, 
                        image_url
                    )
                )
            `)
            .eq("is_active", true)
            .order("sort_order", { ascending: true })

        if (error) {
            console.error("Packages fetch error:", error)
            throw createError({
                statusCode: 500,
                message: "Failed to load packages"
            })
        }

        const bucket = 'Products'

        // Transform image URLs using storage.getPublicUrl
        const transformedData = (data || []).map((pkg: any) => {
            // Transform title_image_url
            let titleImageUrl = pkg.title_image_url
            if (titleImageUrl && !titleImageUrl.startsWith('http://') && !titleImageUrl.startsWith('https://')) {
                const { data: urlData } = supabase
                    .storage
                    .from(bucket)
                    .getPublicUrl(titleImageUrl.replace(/^\/+/, ''))
                titleImageUrl = urlData?.publicUrl || titleImageUrl
            }

            // Transform icon_url
            let iconUrl = pkg.icon_url
            if (iconUrl && !iconUrl.startsWith('http://') && !iconUrl.startsWith('https://')) {
                const { data: urlData } = supabase
                    .storage
                    .from(bucket)
                    .getPublicUrl(iconUrl.replace(/^\/+/, ''))
                iconUrl = urlData?.publicUrl || iconUrl
            }

            // Transform inclusion_items image_url
            const transformedInclusions = pkg.package_inclusions?.map((inclusion: any) => {
                if (inclusion.inclusion_items) {
                    let inclusionImageUrl = inclusion.inclusion_items.image_url
                    if (inclusionImageUrl && !inclusionImageUrl.startsWith('http://') && !inclusionImageUrl.startsWith('https://')) {
                        const { data: urlData } = supabase
                            .storage
                            .from(bucket)
                            .getPublicUrl(inclusionImageUrl.replace(/^\/+/, ''))
                        inclusionImageUrl = urlData?.publicUrl || inclusionImageUrl
                    }
                    return {
                        ...inclusion,
                        inclusion_items: {
                            ...inclusion.inclusion_items,
                            image_url: inclusionImageUrl
                        }
                    }
                }
                return inclusion
            })

            return {
                ...pkg,
                title_image_url: titleImageUrl,
                icon_url: iconUrl,
                package_inclusions: transformedInclusions || pkg.package_inclusions
            }
        })

        return {
            success: true,
            data: transformedData
        }

    } catch (error: any) {
        console.error("Packages API error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to load packages"
        })
    }
})