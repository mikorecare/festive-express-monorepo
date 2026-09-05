
import { serverSupabaseClient } from '#supabase/server'

type Category = {
    id: string
    name: string
}

type Product = {
    id: string
    name: string
    description: string | null
    price: number
    sku: string | null
    stock: number
    gallery: any | null
    status: 'draft' | 'publish'
    category_id: string | null
    image_url: string | null
    is_active: boolean
    has_variations: boolean
    created_at: string
    updated_at: string
    is_package: boolean
    package_data: any | null
    package_id: string | null
    color_key: string | null
    color_label: string | null
    sale_price: number | null
    categories: Category | null
}

type ProductsResponse = {
    products: Product[]
    total: number
    page: number
    limit: number
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const categoryId = String(query.category_id || "").trim();
    const stock = String(query.stock || "").trim();
    const status = String(query.status || "").trim();
    const search = String(query.search || "").trim();

    const supabase = await serverSupabaseClient<Product>(event);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = supabase
        .from("products")
        .select("*, categories(id, name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

    if (categoryId) q = q.eq("category_id", categoryId);
    if (status) q = q.eq("status", status);

    if (stock === "instock") q = q.gt("stock", 0);
    else if (stock === "outofstock") q = q.lte("stock", 0);
    else if (stock === "lowstock") q = q.gt("stock", 0).lte("stock", 10);

    if (search) {
        q = q.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data, error, count } = await q;

    if (error) {
        console.error("products list", error);
        throw createError({ statusCode: 500, message: "Failed to load products" });
    }

    const productsWithFullUrl = (data || []).map((product) => {
        let fullImageUrl = product.image_url;

        if (product.image_url) {
            if (product.image_url.startsWith('http://') || product.image_url.startsWith('https://')) {
                fullImageUrl = product.image_url;
            } else {
                const { data: urlData } = supabase
                    .storage
                    .from('Products')
                    .getPublicUrl(product.image_url);
                fullImageUrl = urlData?.publicUrl || product.image_url;
            }
        }

        let fullGallery = product.gallery;
        if (product.gallery && Array.isArray(product.gallery)) {
            fullGallery = product.gallery.map((image: string) => {
                if (image.startsWith('http://') || image.startsWith('https://')) {
                    return image;
                }
                const { data: urlData } = supabase
                    .storage
                    .from('Products')
                    .getPublicUrl(image);
                return urlData?.publicUrl || image;
            });
        }

        return {
            ...product,
            image_url: fullImageUrl,
            gallery: fullGallery
        };
    });

    const response: ProductsResponse = {
        products: productsWithFullUrl,
        total: count || 0,
        page,
        limit,
    };

    return response;
});