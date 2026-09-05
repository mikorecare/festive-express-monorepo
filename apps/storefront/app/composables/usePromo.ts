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

    if (promo.max_discount_amount != null) {
      discount = Math.min(discount, Number(promo.max_discount_amount))
    }

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
      const response = await $fetch<{ success: boolean; data: PromoCode | null; error?: string }>('/api/promo/validate', {
        method: 'POST',
        body: {
          code,
          subtotal
        }
      })

      if (!response.success) {
        promoError.value = response.error || 'Invalid promo code'
        appliedPromo.value = null
        isChecking.value = false
        return false
      }

      if (!response.data) {
        promoError.value = 'Invalid promo code'
        appliedPromo.value = null
        isChecking.value = false
        return false
      }

      appliedPromo.value = {
        ...response.data,
        discount_value: Number(response.data.discount_value),
        min_order_amount: response.data.min_order_amount != null ? Number(response.data.min_order_amount) : null,
        max_discount_amount: response.data.max_discount_amount != null ? Number(response.data.max_discount_amount) : null,
        usage_limit: response.data.usage_limit != null ? Number(response.data.usage_limit) : null,
        used_count: Number(response.data.used_count) || 0,
      }
      promoCode.value = response.data.code
      promoError.value = ''

      if (import.meta.client) {
        try {
          localStorage.setItem('applied_promo', JSON.stringify(appliedPromo.value))
        } catch (e) {
          console.warn('Failed to save promo to localStorage:', e)
        }
      }

      isChecking.value = false
      return true

    } catch (error: any) {
      console.error('Error applying promo code:', error)
      promoError.value = error.message || 'Failed to apply promo code. Please try again.'
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