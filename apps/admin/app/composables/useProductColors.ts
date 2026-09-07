// /composables/useProductColors.ts
export type ProductColor = {
  id: string
  color_key: string
  color_label: string
  hex: string
  swatch_css?: string | null
  sort_order: number
}

export const useProductColors = () => {
  const colors = useState<ProductColor[]>('product-colors', () => [])
  const loaded = useState('product-colors-loaded', () => false)
  const loading = ref(false)

  const loadColors = async () => {
    if (loaded.value && colors.value.length) return colors.value
    if (loading.value) return colors.value

    loading.value = true

    try {
      const response = await $fetch<{ success: boolean; data: ProductColor[] }>('/api/product-colors')

      if (response.success) {
        colors.value = response.data || []
        loaded.value = true
        return colors.value
      } else {
        throw new Error('Failed to load colors')
      }
    } catch (error) {
      console.error('Error loading product colors:', error)
      return colors.value
    } finally {
      loading.value = false
    }
  }

  const byKey = (key?: string | null) => {
    if (!key) return null
    return colors.value.find((c) => c.color_key === key) || null
  }

  const swatchStyle = (key?: string | null) => {
    const c = byKey(key)
    if (!c) return { backgroundColor: '#e2e8f0' }
    if (c.swatch_css) return { backgroundImage: c.swatch_css }
    return { backgroundColor: c.hex }
  }

  const clearCache = () => {
    colors.value = []
    loaded.value = false
  }

  return {
    colors,
    loadColors,
    byKey,
    swatchStyle,
    clearCache,
    loaded: readonly(loaded),
    loading: readonly(loading)
  }
}