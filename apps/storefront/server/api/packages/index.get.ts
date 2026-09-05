// server/api/packages/index.get.ts
import { serverSupabaseClient } from '#supabase/server'

type InclusionItem = {
    id: string
    name: string
    image_url: string | null
}

type PackageInclusion = {
    id: string
    is_included: boolean
    inclusion_items: InclusionItem | null
}

type Package = {
    id: string
    name: string
    slug: string
    price: number
    sale_price: number | null
    description: string | null
    max_roofline_ft: number | null
    features: any | null
    is_popular: boolean
    color: string | null
    title_image_url: string | null
    icon_url: string | null
    image_url: string | null
    sort_order: number
    is_active: boolean
    created_at: string
    updated_at: string
    package_inclusions: PackageInclusion[]
}

type PackagesResponse = {
    packages: Package[]
}

const STORAGE_BUCKET = 'Products'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient<Package>(event);

    const { data, error } = await supabase
        .from("packages")
        .select(`
            *,
            package_inclusions (
                id,
                is_included,
                inclusion_items (
                    id,
                    name,
                    image_url
                )
            )
        `)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

    if (error) {
        console.error("packages list", error);
        throw createError({
            statusCode: 500,
            message: "Failed to load packages",
        });
    }

    const transformedPackages = (data || []).map((pkg) => {
        let titleImageUrl = pkg.title_image_url;
        if (titleImageUrl && !titleImageUrl.startsWith('http://') && !titleImageUrl.startsWith('https://')) {
            const { data: urlData } = supabase
                .storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(titleImageUrl.replace(/^\/+/, ''));
            titleImageUrl = urlData?.publicUrl || titleImageUrl;
        }

        let imageUrl = pkg.image_url;
        if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
            const { data: urlData } = supabase
                .storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(imageUrl.replace(/^\/+/, ''));
            imageUrl = urlData?.publicUrl || imageUrl;
        }

        let iconUrl = pkg.icon_url;
        if (iconUrl && !iconUrl.startsWith('http://') && !iconUrl.startsWith('https://')) {
            const { data: urlData } = supabase
                .storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(iconUrl.replace(/^\/+/, ''));
            iconUrl = urlData?.publicUrl || iconUrl;
        }

        // Transform inclusion_items image_url
        const transformedInclusions = pkg.package_inclusions?.map((inclusion: any) => {
            if (inclusion.inclusion_items) {
                let inclusionImageUrl = inclusion.inclusion_items.image_url;
                if (inclusionImageUrl && !inclusionImageUrl.startsWith('http://') && !inclusionImageUrl.startsWith('https://')) {
                    const { data: urlData } = supabase
                        .storage
                        .from(STORAGE_BUCKET)
                        .getPublicUrl(inclusionImageUrl.replace(/^\/+/, ''));
                    inclusionImageUrl = urlData?.publicUrl || inclusionImageUrl;
                }
                return {
                    ...inclusion,
                    inclusion_items: {
                        ...inclusion.inclusion_items,
                        image_url: inclusionImageUrl
                    }
                };
            }
            return inclusion;
        });

        return {
            ...pkg,
            title_image_url: titleImageUrl,
            image_url: imageUrl,
            icon_url: iconUrl,
            package_inclusions: transformedInclusions || pkg.package_inclusions
        };
    });

    const response: PackagesResponse = {
        packages: transformedPackages || []
    };

    return response;
});