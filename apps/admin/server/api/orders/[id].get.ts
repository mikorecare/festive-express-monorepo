import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Order ID is required',
        });
    }

    const supabaseUrl = config.public.supabaseUrl;
    const supabaseServiceKey = config.supabaseServiceKey;

    if (!supabaseServiceKey) {
        console.error('Missing NUXT_SUPABASE_SECRET_KEY environment variable');
        throw createError({
            statusCode: 500,
            message: 'Server configuration error',
        });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    try {
        // Fetch order with promo code relation - using correct column names
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
                *,
                promo_codes (
                    id,
                    code,
                    description,
                    discount_type,
                    discount_value,
                    applies_to,
                    min_order_amount,
                    max_discount_amount,
                    usage_limit,
                    used_count,
                    starts_at,
                    expires_at,
                    is_active
                )
            `)
            .eq('id', id)
            .single();

        if (orderError) {
            console.error('Order fetch error:', orderError);
            throw createError({
                statusCode: 404,
                message: orderError.message || 'Order not found',
            });
        }

        if (!order) {
            throw createError({
                statusCode: 404,
                message: 'Order not found',
            });
        }

        // Fetch timeline entries
        const { data: timeline, error: timelineError } = await supabase
            .from('order_timeline')
            .select('*')
            .eq('order_id', id)
            .order('created_at', { ascending: false });

        if (timelineError) {
            console.error('Timeline fetch error:', timelineError);
        }

        const items = order.items || [];

        return {
            success: true,
            order: {
                ...order,
                items: items,
                timeline: timeline || [],
            },
        };

    } catch (error: any) {
        console.error('Order fetch error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch order',
        });
    }
});