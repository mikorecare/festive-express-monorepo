export interface SiteSettings {
  contact_email?: string
  contact_phone?: string
  contact_phone_display?: string
  contact_address?: string
  fl_tax_rate?: string
  social_facebook?: string
  social_instagram?: string
  social_x?: string
  social_youtube?: string
  social_pinterest?: string
  [key: string]: any
}

export const useSettings = () => {
  const { data: response } = useFetch<{ success: boolean; data: SiteSettings | null }>('/api/settings')

  const settings = useState<SiteSettings>("site-settings", () => ({
    contact_email: "",
    contact_phone: "",
    contact_phone_display: "",
    contact_address: "",
    fl_tax_rate: "",
    social_facebook: "",
    social_instagram: "",
    social_x: "",
    social_youtube: "",
    social_pinterest: "",
  }))

  watch(response, (newVal) => {
    if (newVal?.success && newVal.data) {
      settings.value = { ...settings.value, ...newVal.data }
    }
  }, { immediate: true })

  const loadSettings = async () => {
    try {
      const response = await $fetch<{ success: boolean; data: SiteSettings | null }>('/api/settings')
      if (response.success && response.data) {
        settings.value = { ...settings.value, ...response.data }
      }
    } catch (e) {
      console.error("Failed to re-fetch settings:", e)
    }
  }

  const telHref = computed(() => {
    const raw = settings.value.contact_phone || settings.value.contact_phone_display || ""
    const digits = raw.replace(/[^\d+]/g, "")
    return digits ? `tel:${digits}` : "tel:+19412221012"
  })

  return { settings, loadSettings, telHref }
}
