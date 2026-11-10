export function useServiceableAddress(opts: {
    packageSlug: () => string
    onEstimator?: (data: any | null) => void
}) {
        const { address, placeId, suggestions, suggestionsOpen, errors, debouncedSearch, selectAddress } = useEstimator()

    const addressError = ref<string | null>(null)
    const serviceable = ref(false)
    const validating = ref(false)
    const estimatorResult = ref<any>(null)

    const onSelectAddress = async (s: { placeId: string; main: string; secondary: string }) => {
        addressError.value = null
        serviceable.value = false

        // Apply immediately — same as the old behavior
        selectAddress(s as any)

        validating.value = true
        try {
            const res = await ($fetch as any)("/api/service-zip/validate", {
                method: "POST",
                body: { place_id: s.placeId, package: opts.packageSlug(), save: true },
            })

            if (res?.in_service_area === false || res?.ok === false) {
                addressError.value =
                    res.message ||
                    (res.reason === "no_postal_code"
                        ? "We couldn’t determine a ZIP for this address. Please pick another."
                        : "This address is outside our service area.")
                opts.onEstimator?.(null)
                return
            }

            estimatorResult.value = res.estimator ?? null
            serviceable.value = true
            opts.onEstimator?.(res.estimator ?? null)
        } catch (e: any) {
            addressError.value =
                e?.data?.message || e?.statusMessage || "Could not validate this address."
            opts.onEstimator?.(null)
        } finally {
            validating.value = false
        }
    }

    return {
        address,
        suggestions,
        placeId,
        suggestionsOpen,
        errors,
        debouncedSearch,
        addressError,
        serviceable,
        validating,
        estimatorResult,
        onSelectAddress,
    }
}