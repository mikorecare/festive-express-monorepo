
export const useHeroSettings = () => {
  const heroH1White = useState("heroH1White", () => "RENT THE MAGIC")
  const heroH1Orange = useState("heroH1Orange", () => "ENJOY THE SEASON")
  const heroDescription1 = useState(
    "heroDescription1",
    () => "Giftwrapped in One Simple Package.",
  )
  const heroDescription2 = useState(
    "heroDescription2",
    () => "(No ladders. No tangled cords. No storage. No stress.)",
  )
  const heroButtonLabel = useState(
    "heroButtonLabel",
    () => "Explore the Packages",
  )
  const heroCountdownEnabled = useState("heroCountdownEnabled", () => true)
  const isLoading = useState("heroLoading", () => false)

  const loadHeroSettings = async () => {
    if (!import.meta.client) return

    isLoading.value = true

    try {
      const response = await $fetch<{ success: boolean; data: any }>('/api/hero-settings')

      if (response.success && response.data) {
        const data = response.data

        if (data.hero_h1_white) {
          heroH1White.value = data.hero_h1_white
        }
        if (data.hero_h1_orange) {
          heroH1Orange.value = data.hero_h1_orange
        }
        if (data.hero_description_1) {
          heroDescription1.value = data.hero_description_1
        }
        if (data.hero_description_2) {
          heroDescription2.value = data.hero_description_2
        }
        if (data.hero_button_label) {
          heroButtonLabel.value = data.hero_button_label
        }
        if (data.hero_countdown_enabled !== undefined) {
          heroCountdownEnabled.value = data.hero_countdown_enabled
        }
      }
    } catch (e) {
      console.error("loadHeroSettings", e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    heroH1White,
    heroH1Orange,
    heroDescription1,
    heroDescription2,
    heroButtonLabel,
    heroCountdownEnabled,
    loadHeroSettings,
    isLoading,
  }
}