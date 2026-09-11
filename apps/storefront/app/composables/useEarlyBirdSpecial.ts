
export const useEarlyBirdSpecial = () => {
  const { data: earlyBirdResponse } = useFetch<{ success: boolean; data: any }>('/api/early-bird')

  const earlyBirdExpiresAt = useState<string | null>("earlyBirdExpiresAt", () => null)
  const earlyBirdEnabled = useState<boolean>("earlyBirdEnabled", () => false)
  const earlyBirdTitle = useState<string>("earlyBirdTitle", () => "Early Bird Special Pricing")
  const earlyBirdDescription = useState<string>("earlyBirdDescription", () => "See packages for details.")
  const earlyBirdIconUrl = useState<string>("earlyBirdIconUrl", () => "")
  const earlyBirdIconSecondaryUrl = useState<string>("earlyBirdIconSecondaryUrl", () => "")
  const isLoading = useState<boolean>("earlyBirdLoading", () => false)

  watch(earlyBirdResponse, (newVal) => {
    if (newVal?.success && newVal.data) {
      const d = newVal.data
      if (d.early_bird_expires_at !== undefined) earlyBirdExpiresAt.value = d.early_bird_expires_at
      if (d.early_bird_enabled !== undefined) earlyBirdEnabled.value = d.early_bird_enabled
      if (d.early_bird_title) earlyBirdTitle.value = d.early_bird_title
      if (d.early_bird_description) earlyBirdDescription.value = d.early_bird_description
      if (d.early_bird_icon_url !== undefined) earlyBirdIconUrl.value = d.early_bird_icon_url || ""
      if (d.early_bird_icon_secondary_url !== undefined) earlyBirdIconSecondaryUrl.value = d.early_bird_icon_secondary_url || ""
    }
  }, { immediate: true }) // immediate ensures it syncs if data is already available on Server Side Rendering

  // --- REST OF YOUR ORIGINAL HELPER LOGIC ---
  const isEarlyBirdActive = (enabled?: boolean, expiresAt?: string | null) => {
    if (!enabled) return false
    if (!expiresAt) return true
    return new Date(expiresAt).getTime() > Date.now()
  }

  const isEarlyBirdLive = computed(() =>
    isEarlyBirdActive(earlyBirdEnabled.value, earlyBirdExpiresAt.value),
  )

  const effectivePrice = (
    price: number | string | null | undefined,
    salePrice: number | string | null | undefined,
  ) => {
    const sale = Number(salePrice)
    const base = Number(price ?? 0)
    if (isEarlyBirdLive.value && salePrice != null && salePrice !== "" && !Number.isNaN(sale) && sale > 0) {
      return sale
    }
    return base
  }

  const showSale = (salePrice: number | string | null | undefined) =>
    isEarlyBirdLive.value && salePrice != null && salePrice !== "" && Number(salePrice) > 0

  const formatEndsLabel = computed(() => {
    if (!earlyBirdExpiresAt.value) return null
    const date = new Date(earlyBirdExpiresAt.value)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York"
    })
  })

  const loadEarlyBird = async () => {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; data: any }>('/api/early-bird')
      if (response.success && response.data) {
        const d = response.data
        if (d.early_bird_expires_at !== undefined) earlyBirdExpiresAt.value = d.early_bird_expires_at
        if (d.early_bird_enabled !== undefined) earlyBirdEnabled.value = d.early_bird_enabled
        if (d.early_bird_title) earlyBirdTitle.value = d.early_bird_title
        if (d.early_bird_description) earlyBirdDescription.value = d.early_bird_description
        if (d.early_bird_icon_url !== undefined) earlyBirdIconUrl.value = d.early_bird_icon_url || ""
        if (d.early_bird_icon_secondary_url !== undefined) earlyBirdIconSecondaryUrl.value = d.early_bird_icon_secondary_url || ""
      }
    } catch (e) {
      console.error("loadEarlyBird manual refresh failed", e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    earlyBirdExpiresAt,
    earlyBirdEnabled,
    earlyBirdTitle,
    earlyBirdDescription,
    earlyBirdIconUrl,
    earlyBirdIconSecondaryUrl,
    isEarlyBirdLive,
    isEarlyBirdActive,
    effectivePrice,
    showSale,
    formatEndsLabel,
    loadEarlyBird,
    isLoading,
  }
}
