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

const appliedPromo = ref<PromoCode | null>(null)
const promoCode = ref('')
const promoError = ref('')

export const usePromo = () => {
  const supabase = useSupabaseClient()

  const discountAmount = (subtotal: number) => {
    if (!appliedPromo.value) return 0
    const promo = appliedPromo.value

    if (promo.min_order_amount && subtotal < Number(promo.min_order_amount)) {
      return 0
    }

    let discount =
      promo.discount_type === 'percent'
        ? (subtotal * Number(promo.discount_value)) / 100
        : Number(promo.discount_value)

    if (promo.max_discount_amount != null) {
      discount = Math.min(discount, Number(promo.max_discount_amount))
    }

    return Math.min(Math.max(discount, 0), subtotal)
  }

  const applyPromo = async (subtotal: number) => {
    promoError.value = ''
    const code = promoCode.value.trim().toUpperCase()

    if (!code) {
      promoError.value = 'Enter a promo code'
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

      const row = data as PromoCode | null
      if (!row) {
        promoError.value = 'Invalid promo code'
        appliedPromo.value = null
        return false
      }

      const now = new Date()
      if (row.starts_at && new Date(row.starts_at) > now) {
        promoError.value = 'This code is not active yet'
        return false
      }
      if (row.expires_at && new Date(row.expires_at) < now) {
        promoError.value = 'This code has expired'
        return false
      }
      if (row.usage_limit != null && Number(row.used_count) >= Number(row.usage_limit)) {
        promoError.value = 'This code has reached its usage limit'
        return false
      }
      if (row.min_order_amount && subtotal < Number(row.min_order_amount)) {
        promoError.value = `Minimum order is $${Number(row.min_order_amount).toFixed(2)}`
        return false
      }

      appliedPromo.value = {
        ...row,
        discount_value: Number(row.discount_value),
        min_order_amount: row.min_order_amount != null ? Number(row.min_order_amount) : null,
        max_discount_amount: row.max_discount_amount != null ? Number(row.max_discount_amount) : null,
        usage_limit: row.usage_limit != null ? Number(row.usage_limit) : null,
        used_count: Number(row.used_count) || 0,
      }
      promoCode.value = row.code

      // persist across pages / refresh
      if (import.meta.client) {
        localStorage.setItem('applied_promo', JSON.stringify(appliedPromo.value))
      }

      return true
    } catch (e) {
      console.error(e)
      promoError.value = 'Could not apply promo code'
      appliedPromo.value = null
      return false
    }
  }

  const removePromo = () => {
    appliedPromo.value = null
    promoCode.value = ''
    promoError.value = ''
    if (import.meta.client) {
      localStorage.removeItem('applied_promo')
    }
  }

  const loadPromo = () => {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem('applied_promo')
      if (!raw) return
      appliedPromo.value = JSON.parse(raw) as PromoCode
      promoCode.value = appliedPromo.value.code
    } catch {
      localStorage.removeItem('applied_promo')
    }
  }

  return {
    promoCode,
    promoError,
    appliedPromo,
    discountAmount,
    applyPromo,
    removePromo,
    loadPromo,
  }
}