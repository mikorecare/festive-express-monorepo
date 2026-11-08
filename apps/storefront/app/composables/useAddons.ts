import type { AddonCategory, AddonProduct, WreathRibbonBundle, AddonsResponse } from "~~/server/api/addons/index.get"

export const useAddons = () => {
    const categories = useState<AddonCategory[]>('storefront-addon-categories', () => [])
    const products = useState<AddonProduct[]>('storefront-addon-products', () => [])
    const bundles = useState<WreathRibbonBundle[]>('storefront-addon-bundles', () => [])
    const loaded = useState('storefront-addons-loaded', () => false)
    const isLoading = useState('storefront-addons-loading', () => false)

    const loadAddons = async (force = false) => {
        if (!force && loaded.value && products.value.length) {
            return { categories: categories.value, products: products.value, bundles: bundles.value }
        }

        isLoading.value = true

        try {
            const response = await $fetch<AddonsResponse>('/api/addons')

            categories.value = response?.categories || []
            products.value = response?.products || []
            bundles.value = response?.bundles || []
            loaded.value = true

            return { categories: categories.value, products: products.value, bundles: bundles.value }
        } catch (error) {
            console.error('loadAddons', error)
            categories.value = []
            products.value = []
            bundles.value = []
            loaded.value = false
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const productsByCategory = (key: string) =>
        products.value
            .filter((p) => p.category === key)
            .sort((a, b) => a.sort_order - b.sort_order)

    const productById = (id?: string | null) => {
        if (!id) return null
        return products.value.find((p) => p.id === id) || null
    }

    /**
     * Returns the ribbon product bundled with a given wreath, or null.
     * Wreath prices already include the ribbon — this is for display only.
     */
    const bundledRibbonFor = (wreathProductId: string): AddonProduct | null => {
        const b = bundles.value.find((x) => x.wreath_product_id === wreathProductId)
        if (!b) return null
        return products.value.find((p) => p.id === b.ribbon_product_id) ?? null
    }

    return {
        categories,
        products,
        bundles,
        loadAddons,
        productsByCategory,
        productById,
        bundledRibbonFor,
        isLoading,
        loaded,
    }
}