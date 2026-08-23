interface PromoCode {
  id: string
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  min_order_amount: number | null
  max_discount_amount: number | null
  usage_limit: number | null
  used_count: number
  starts_at: string | null
  expires_at: string | null
  is_active: boolean
}

export const usePromo = () => {
  const supabase = useSupabaseClient()

  const promoCode = ref('')
  const promoError = ref('')
  const appliedPromo = ref<PromoCode | null>(null)
  const isChecking = ref(false)

  const discountAmount = (subtotal: number) => {
    if (!appliedPromo.value) return 0
    const promo = appliedPromo.value

    if (promo.min_order_amount && subtotal < Number(promo.min_order_amount)) {
      return 0
    }

    let discount = 0
    if (promo.discount_type === 'percent') {
      discount = (subtotal * Number(promo.discount_value)) / 100
    } else {
      discount = Number(promo.discount_value)
    }

    // Apply max discount cap if set
    if (promo.max_discount_amount != null) {
      discount = Math.min(discount, Number(promo.max_discount_amount))
    }

    // Ensure discount doesn't exceed subtotal
    return Math.min(Math.max(discount, 0), subtotal)
  }

  const applyPromo = async (subtotal: number) => {
    promoError.value = ''
    isChecking.value = true

    const code = promoCode.value.trim().toUpperCase()
    if (!code) {
      promoError.value = 'Please enter a promo code'
      isChecking.value = false
      return false
    }

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        promoError.value = 'Invalid promo code'
        appliedPromo.value = null
        isChecking.value = false
        return false
      }

      const row = data as PromoCode

      const now = new Date()
      if (row.starts_at && new Date(row.starts_at) > now) {
        promoError.value = 'This promo code is not active yet'
        isChecking.value = false
        return false
      }

      if (row.expires_at && new Date(row.expires_at) < now) {
        promoError.value = 'This promo code has expired'
        isChecking.value = false
        return false
      }

      // Check usage limit
      if (row.usage_limit != null && Number(row.used_count) >= Number(row.usage_limit)) {
        promoError.value = 'This promo code has reached its usage limit'
        isChecking.value = false
        return false
      }

      // Check minimum order amount
      if (row.min_order_amount && subtotal < Number(row.min_order_amount)) {
        promoError.value = `Minimum order amount is $${Number(row.min_order_amount).toFixed(2)}`
        isChecking.value = false
        return false
      }

      // Apply promo code
      appliedPromo.value = {
        ...row,
        discount_value: Number(row.discount_value),
        min_order_amount: row.min_order_amount != null ? Number(row.min_order_amount) : null,
        max_discount_amount: row.max_discount_amount != null ? Number(row.max_discount_amount) : null,
        usage_limit: row.usage_limit != null ? Number(row.usage_limit) : null,
        used_count: Number(row.used_count) || 0,
      }
      promoCode.value = row.code
      promoError.value = ''

      // Persist across pages/refresh
      if (import.meta.client) {
        try {
          localStorage.setItem('applied_promo', JSON.stringify(appliedPromo.value))
        } catch (e) {
          console.warn('Failed to save promo to localStorage:', e)
        }
      }

      isChecking.value = false
      return true

    } catch (error) {
      console.error('Error applying promo code:', error)
      promoError.value = 'Failed to apply promo code. Please try again.'
      appliedPromo.value = null
      isChecking.value = false
      return false
    }
  }

  const removePromo = () => {
    appliedPromo.value = null
    promoCode.value = ''
    promoError.value = ''
    if (import.meta.client) {
      try {
        localStorage.removeItem('applied_promo')
      } catch (e) {
        console.warn('Failed to remove promo from localStorage:', e)
      }
    }
  }

  const loadPromo = () => {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem('applied_promo')
      if (!raw) return
      const parsed = JSON.parse(raw) as PromoCode
      // Validate the stored promo is still valid
      if (parsed.expires_at && new Date(parsed.expires_at) < new Date()) {
        removePromo()
        return
      }
      appliedPromo.value = parsed
      promoCode.value = parsed.code
    } catch (error) {
      console.warn('Failed to load promo from localStorage:', error)
      localStorage.removeItem('applied_promo')
    }
  }

  return {
    promoCode,
    promoError,
    appliedPromo,
    isChecking,
    discountAmount,
    applyPromo,
    removePromo,
    loadPromo,
  }
}