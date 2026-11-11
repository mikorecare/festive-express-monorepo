import { useAddons } from "~/composables/useAddons"
import { useEstimateHandoff } from "~/composables/useEstimateHandoff"
import type { ApiResponse, PackageRow, SkuRow } from "~/pages/packages/types"

export function usePackagePage() {
    const route = useRoute()
    const slug = computed(() => String(route.params.slug || ""))

    const extrasOpen = ref(false)
    const overagePrice = ref(0)
    const overageFt = ref(0)
    const estimatedFootage = ref<number | null>(null)
    const packageIncludedFt = ref<number | null>(null)

    // Track if we are editing an existing cart item
    const editingCartItemId = ref<string | number | null>(null)

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
        if (!skusForPkg.value.length) return null
        if (selectedSkuId.value != null) {
            return skusForPkg.value.find((s) => String(s.id) === String(selectedSkuId.value)) ?? null
        }
        return skusForPkg.value[0] ?? null
    })

    const selectedPrice = computed(() => {
        const sku = selectedSku.value
        return Number(sku?.price ?? pkg.value?.price ?? 0)
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
            // Force string comparison so it doesn't fail on UUID types
            const p = addonProducts.value.find((x) => String(x.id) === String(id))
            if (p) sum += Number(p.price) * qty
        }
        return sum
    })

    const cart = useCart()
    const adding = ref(false)
    const cartModal = reactive({
        open: false,
        type: "success" as "success" | "error",
        title: "",
        message: "",
    })
    const openCartModal = (type: "success" | "error", title: string, message: string) => {
        cartModal.type = type
        cartModal.title = title
        cartModal.message = message
        cartModal.open = true
    }

    const { $fbq } = useNuxtApp()

    // Function to pre-fill state for editing
    const loadCartItemForEdit = (item: any) => {
        editingCartItemId.value = item.id

        if (item.product_id) {
            selectedSkuId.value = item.product_id
        }

        Object.keys(addonQty).forEach((key) => delete addonQty[key])
        if (item.options?.addons) {
            item.options.addons.forEach((a: any) => {
                addonQty[a.product_id] = a.quantity
            })
        }

        if (item.options?.overage) {
            overagePrice.value = Number(item.options.overage.amount) || 0
            overageFt.value = Number(item.options.overage.feet) || 0
            estimatedFootage.value = Number(item.options.overage.estimated_footage) || null
            packageIncludedFt.value = Number(item.options.overage.package_included_ft) || null
        } else {
            setOverage(null)
        }
    }

    const addToCart = async (serviceable: boolean, address: string, placeId: string, phone: string) => {
        const sku = selectedSku.value
        if (!sku?.id || adding.value) return false
        if (!serviceable || !placeId) {
            openCartModal("error", "Address required", "Please select a serviceable installation address first.")
            return false
        }

        adding.value = true
        try {
            const selectedAddons = Object.entries(addonQty)
                .filter(([_, qty]) => qty > 0)
                .map(([id, qty]) => {
                    // Force string comparison to find the product correctly
                    const p = addonProducts.value.find((x) => String(x.id) === String(id))

                    if (!p) {
                        console.warn("Addon not found for ID:", id)
                    }

                    return {
                        product_id: String(id),
                        name: p?.name || "Add-on",
                        price: Number(p?.price || 0),
                        quantity: qty,
                    }
                })

            const options = {
                address: address,
                place_id: placeId,
                phone: phone,
                addons: selectedAddons.length > 0 ? selectedAddons : undefined,
                overage: overagePrice.value > 0 ? {
                    amount: overagePrice.value,
                    feet: overageFt.value,
                    estimated_footage: estimatedFootage.value,
                    package_included_ft: packageIncludedFt.value
                } : undefined,
            }

            const isEdit = !!editingCartItemId.value

            // If editing, remove old item first
            if (isEdit) {
                await cart.removeFromCart(editingCartItemId.value!)
            }

            const ok = await cart.addToCart(sku.id, 1, options)

            if (ok !== false) {
                if (typeof cart.loadCart === "function") await cart.loadCart()

                const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price * a.quantity, 0)
                const mainPrice = Number(sku.price ?? pkg.value?.price ?? 0)
                const overageAmt: number = Number(overagePrice.value || 0)

                    ; ($fbq as any)("track", "AddToCart", {
                        content_name: pkg.value?.name ?? sku.name,
                        content_ids: [sku.id, ...selectedAddons.map((a) => a.product_id)],
                        content_type: "product",
                        contents: [
                            { id: sku.id, quantity: 1, item_price: mainPrice },
                            ...selectedAddons.map((a) => ({ id: a.product_id, quantity: a.quantity, item_price: a.price })),
                        ],
                        value: mainPrice + addonTotal + overageAmt,
                        currency: "USD",
                        num_items: 1 + selectedAddons.reduce((n, a) => n + a.quantity, 0),
                    })

                Object.keys(addonQty).forEach((key) => delete addonQty[key])
                extrasOpen.value = false

                // Clear edit mode AFTER success
                if (isEdit) {
                    editingCartItemId.value = null
                }

                openCartModal(
                    "success",
                    isEdit ? "Cart updated" : "Added to cart",
                    `${pkg.value?.name} was ${isEdit ? 'updated' : 'added'}.`
                )
                return true
            } else {
                openCartModal("error", "Could not add", "Something went wrong. Please try again.")
                return false
            }
        } catch (e: any) {
            openCartModal("error", "Could not add", e?.message || "Something went wrong.")
            return false
        } finally {
            adding.value = false
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
        extrasOpen, editingCartItemId, loadCartItemForEdit,
        cartModal, openCartModal, adding, addToCart,
    }
}