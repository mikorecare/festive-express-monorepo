export type ProductColor = {
  id: string
  color_key: string
  color_label: string
  hex: string
  swatch_css?: string | null
  sort_order: number
}

export const useProductColors = () => {
  const supabase = useSupabaseClient()
  const db = supabase as any
  const colors = useState<ProductColor[]>('product-colors', () => [])
  const loaded = useState('product-colors-loaded', () => false)

  const loadColors = async () => {
    if (loaded.value && colors.value.length) return colors.value
    const { data, error } = await db
      .from('product_colors')
      .select('id, color_key, color_label, hex, swatch_css, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    if (error) throw error
    colors.value = data || []
    loaded.value = true
    return colors.value
  }

  const byKey = (key?: string | null) =>
    colors.value.find((c) => c.color_key === key) || null

  const swatchStyle = (key?: string | null) => {
    const c = byKey(key)
    if (!c) return { backgroundColor: '#e2e8f0' }
    if (c.swatch_css) return { backgroundImage: c.swatch_css }
    return { backgroundColor: c.hex }
  }

  return { colors, loadColors, byKey, swatchStyle }
}