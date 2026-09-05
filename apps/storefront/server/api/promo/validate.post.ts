import { serverSupabaseClient } from '#supabase/server'

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

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { code, subtotal } = body

    if (!code) {
        return {
            success: false,
            error: 'Please enter a promo code'
        }
    }

    const supabase = await serverSupabaseClient(event)

    try {
        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .maybeSingle()

        if (error) {
            console.error('Promo validation error:', error)
            return {
                success: false,
                error: 'Failed to validate promo code'
            }
        }

        if (!data) {
            return {
                success: false,
                error: 'Invalid promo code'
            }
        }

        const promo = data as PromoCode

        // Check if active
        const now = new Date()
        if (promo.starts_at && new Date(promo.starts_at) > now) {
            return {
                success: false,
                error: 'This promo code is not active yet'
            }
        }

        if (promo.expires_at && new Date(promo.expires_at) < now) {
            return {
                success: false,
                error: 'This promo code has expired'
            }
        }

        // Check usage limit
        if (promo.usage_limit != null && Number(promo.used_count) >= Number(promo.usage_limit)) {
            return {
                success: false,
                error: 'This promo code has reached its usage limit'
            }
        }

        // Check minimum order amount
        if (promo.min_order_amount && subtotal < Number(promo.min_order_amount)) {
            return {
                success: false,
                error: `Minimum order amount is $${Number(promo.min_order_amount).toFixed(2)}`
            }
        }

        return {
            success: true,
            data: promo
        }

    } catch (error: any) {
        console.error('Promo validation error:', error)
        return {
            success: false,
            error: error.message || 'Failed to validate promo code'
        }
    }
})