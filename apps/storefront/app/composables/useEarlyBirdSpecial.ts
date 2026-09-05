export const useEarlyBirdSpecial = () => {
  const earlyBirdExpiresAt = useState<string | null>(
    "earlyBirdExpiresAt",
    () => null,
  )
  const earlyBirdEnabled = useState<boolean>("earlyBirdEnabled", () => false)
  const earlyBirdTitle = useState<string>(
    "earlyBirdTitle",
    () => "Early Bird Special Pricing",
  )
  const earlyBirdDescription = useState<string>(
    "earlyBirdDescription",
    () => "See packages for details.",
  )
  const earlyBirdIconUrl = useState<string>("earlyBirdIconUrl", () => "")
  const earlyBirdIconSecondaryUrl = useState<string>(
    "earlyBirdIconSecondaryUrl",
    () => "",
  )
  const isLoading = useState<boolean>("earlyBirdLoading", () => false)

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
    if (
      isEarlyBirdLive.value &&
      salePrice != null &&
      salePrice !== "" &&
      !Number.isNaN(sale) &&
      sale > 0
    ) {
      return sale
    }
    return base
  }

  const showSale = (salePrice: number | string | null | undefined) =>
    isEarlyBirdLive.value &&
    salePrice != null &&
    salePrice !== "" &&
    Number(salePrice) > 0

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
    if (!import.meta.client) return

    isLoading.value = true

    try {
      const response = await $fetch<{ success: boolean; data: any }>('/api/early-bird')

      if (response.success && response.data) {
        const data = response.data

        if (data.early_bird_expires_at !== undefined) {
          earlyBirdExpiresAt.value = data.early_bird_expires_at
        }
        if (data.early_bird_enabled !== undefined) {
          earlyBirdEnabled.value = data.early_bird_enabled
        }
        if (data.early_bird_title) {
          earlyBirdTitle.value = data.early_bird_title
        }
        if (data.early_bird_description) {
          earlyBirdDescription.value = data.early_bird_description
        }
        if (data.early_bird_icon_url !== undefined) {
          earlyBirdIconUrl.value = data.early_bird_icon_url || ""
        }
        if (data.early_bird_icon_secondary_url !== undefined) {
          earlyBirdIconSecondaryUrl.value = data.early_bird_icon_secondary_url || ""
        }
      }
    } catch (e) {
      console.error("loadEarlyBird", e)
      earlyBirdEnabled.value = false
      earlyBirdExpiresAt.value = null
      earlyBirdIconUrl.value = ""
      earlyBirdIconSecondaryUrl.value = ""
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