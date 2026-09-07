import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()
        const body = await readBody(event)

        const payload = {
            code: body.code,
            description: body.description || null,
            discount_type: body.discount_type,
            discount_value: body.discount_value,
            applies_to: body.applies_to || 'all',
            min_order_amount: body.min_order_amount || null,
            max_discount_amount: body.max_discount_amount || null,
            usage_limit: body.usage_limit || null,
            starts_at: body.starts_at || null,
            expires_at: body.expires_at || null,
            is_active: body.is_active !== undefined ? body.is_active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('promo_codes')
            .insert(payload)
            .select('id')
            .single()

        if (error) {
            // Check for duplicate code error
            if (error.code === '23505') {
                throw new Error('A promo code with this code already exists')
            }
            throw error
        }

        return {
            success: true,
            id: (data as { id: string }).id
        }
    } catch (error) {
        console.error('Error creating promo code:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create promo code'
        }
    }
})