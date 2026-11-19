import { useAddons } from "~/composables/useAddons"
import { useEstimateHandoff } from "~/composables/useEstimateHandoff"
import type { ApiResponse, PackageRow, SkuRow } from "~~/server/api/packages/types"

export function usePackagePage() {
    const route = useRoute()
    const slug = computed(() => String(route.params.slug || ""))

    const extrasOpen = ref(false)
    const overagePrice = ref(0)
    const overageFt = ref(0)
    const estimatedFootage = ref<number | null>(null)
    const packageIncludedFt = ref<number | null>(null)

    const setOverage = (data: any | null) => {
        if (!data) {
            overagePrice.value = 0
            overageFt.value = 0
            estimatedFootage.value = null
            packageIncludedFt.value = null
            return
        }
        overagePrice.value = Number(data.overagePrice) || 0
        overageFt.value = Number(data.overageFt) || 0
        estimatedFootage.value = Number(data.estimatedFootage) || null
        packageIncludedFt.value = Number(data.packageIncludedFt) || null
    }

    const { calculatedOveragePrice, calculatedOverageFt } = useEstimator()
    const { load: loadEstimateHandoff } = useEstimateHandoff()

    onMounted(() => {
        const livePrice = Number(calculatedOveragePrice.value) || 0
        const liveFt = Number(calculatedOverageFt.value) || 0
        if (livePrice > 0) {
            overagePrice.value = livePrice
            overageFt.value = liveFt
            return
        }
        if (route.query.estimate === "true") {
            const snap = loadEstimateHandoff()
            if (snap) {
                overagePrice.value = snap.overagePrice
                overageFt.value = snap.overageFt
            }
        }
    })

    const { data, pending } = useAsyncData(
        `package-${slug.value}`,
        async () => {
            const [packagesRes, skusRes] = await Promise.all([
                $fetch<ApiResponse<PackageRow[]>>("/api/packages/main-list"),
                $fetch<ApiResponse<SkuRow[]>>("/api/packages/skus"),
            ])
            return {
                packages: packagesRes.success ? packagesRes.data || [] : [],
                skus: skusRes.success ? skusRes.data || [] : [],
            }
        },
        { watch: [slug] },
    )

    const pkg = computed<PackageRow | null>(
        () => data.value?.packages.find((p) => p.slug === slug.value) || null,
    )

    const inclusions = computed(() => {
        if (!pkg.value) return []
        return (pkg.value.package_inclusions || [])
            .filter((r) => r.is_included && r.inclusion_items?.name)
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((r) => {
                const item = Array.isArray(r.inclusion_items) ? r.inclusion_items[0] : r.inclusion_items
                return {
                    name: r.label_override || item?.name,
                    quantity: r.quantity ?? 1,
                    image_url: item?.image_url || null,
                }
            })
    })

    const { colors, loadColors, swatchStyle, byKey } = useProductColors()

    const skusForPkg = computed<SkuRow[]>(() => {
        if (!pkg.value) return []
        return (data.value?.skus || [])
            .filter((s) => String(s.package_id) === String(pkg.value!.id))
            .sort((a, b) => {
                const orderOf = (key?: string | null) => {
                    const i = colors.value.findIndex((c) => c.color_key === key)
                    return i === -1 ? 999 : i
                }
                return orderOf(a.color_key) - orderOf(b.color_key)
            })
    })

    const selectedSkuId = ref<string | number | null>(null)
    const selectedSku = computed<SkuRow | null>(() => {
        if (!pkg.value) return null

        if (selectedSkuId.value != null) {
            const found = skusForPkg.value.find(
                (s) => String(s.id) === String(selectedSkuId.value)
            )
            if (found) return found
        }

        const first = skusForPkg.value[0]
        if (first) return first

        const rawSku = data.value?.skus?.find((s) => s.price != null)
        return rawSku ?? null
    })

    const selectedPrice = computed(() => {
        const sku = selectedSku.value
        if (sku?.price != null) return Number(sku.price)

        if (pkg.value?.price != null) return Number(pkg.value.price)

        const anySku = data.value?.skus?.find((s) => s.price != null && Number(s.price) > 0)
        if (anySku?.price != null) return Number(anySku.price)

        return 0
    })

    const shortDescription = computed(() => {
        const raw = pkg.value?.description
        if (!raw) return ""
        return raw.split(/\n\s*\n/)[0]?.trim() || ""
    })

    const selectSku = (id: string | number) => (selectedSkuId.value = id)

    const {
        categories: addonCategories,
        loadAddons,
        productsByCategory,
        bundledRibbonFor,
        products: addonProducts,
    } = useAddons()

    const addonQty = reactive<Record<string, number>>({})
    const incrementAddon = (id: string) => (addonQty[id] = (addonQty[id] || 0) + 1)
    const decrementAddon = (id: string) => {
        const next = (addonQty[id] || 0) - 1
        if (next <= 0) delete addonQty[id]
        else addonQty[id] = next
    }

    const addonSubtotal = computed(() => {
        let sum = 0
        for (const [id, qty] of Object.entries(addonQty)) {
            const p = addonProducts.value.find((x) => String(x.id) === String(id))
            if (p) sum += Number(p.price) * qty
        }
        return sum
    })

    // Same `options` object addToCart() used to send to /api/cart/add.
    // NOTE: the cart API may have added more keys server-side (e.g. alacarte_total).
    const buildOptions = (address: string, placeId: string, phone: string) => {
        const selectedAddons = Object.entries(addonQty)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => {
                const p = addonProducts.value.find((x) => String(x.id) === String(id))
                return {
                    product_id: String(id),
                    name: p?.name || "Add-on",
                    price: Number(p?.price || 0),
                    quantity: qty,
                }
            })

        return {
            address,
            place_id: placeId,
            phone,
            addons: selectedAddons.length > 0 ? selectedAddons : undefined,
            overage: overagePrice.value > 0 ? {
                amount: overagePrice.value,
                feet: overageFt.value,
                estimated_footage: estimatedFootage.value,
                package_included_ft: packageIncludedFt.value,
            } : undefined,
        }
    }

    onMounted(async () => {
        await loadColors()
        await loadAddons()
    })

    useHead(() => ({
        title: pkg.value ? `${pkg.value.name} | Festive Express` : "Package | Festive Express",
    }))

    return {
        slug, pkg, pending, inclusions, skusForPkg, selectedSku, selectedPrice,
        shortDescription, selectSku, byKey, swatchStyle,
        addonCategories, productsByCategory, bundledRibbonFor, addonProducts,
        addonQty, incrementAddon, decrementAddon, addonSubtotal,
        overagePrice, overageFt, estimatedFootage, packageIncludedFt, setOverage,
        extrasOpen, buildOptions,
    }
}