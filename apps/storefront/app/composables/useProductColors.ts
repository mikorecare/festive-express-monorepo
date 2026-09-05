export type ProductColor = {
  id: string
  color_key: string
  color_label: string
  hex: string
  swatch_css?: string | null
  sort_order: number
}

export const useProductColors = () => {
  const colors = useState<ProductColor[]>('storefront-product-colors', () => [])
  const loaded = useState('storefront-product-colors-loaded', () => false)
  const isLoading = useState('storefront-product-colors-loading', () => false)

  const loadColors = async (force = false) => {
    if (!force && loaded.value && colors.value.length) {
      return colors.value
    }

    isLoading.value = true

    try {
      const response = await $fetch<{ success: boolean; data: ProductColor[] }>('/api/product-colors')

      if (response.success) {
        colors.value = response.data || []
        loaded.value = true
        return colors.value
      } else {
        throw new Error('Failed to load product colors')
      }
    } catch (error) {
      console.error('loadColors', error)
      colors.value = []
      loaded.value = false
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const byKey = (key?: string | null) => {
    if (!key) return null
    return colors.value.find((c) => c.color_key === key) || null
  }

  const swatchStyle = (key?: string | null): Record<string, string> => {
    const c = byKey(key)
    if (!c) return { backgroundColor: '#e2e8f0' }
    if (c.swatch_css) return { backgroundImage: c.swatch_css }
    return { backgroundColor: c.hex || '#e2e8f0' }
  }

  return {
    colors,
    loadColors,
    byKey,
    swatchStyle,
    isLoading,
    loaded,
  }
}