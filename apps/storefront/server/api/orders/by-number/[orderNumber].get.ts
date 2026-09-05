import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const orderNumber = getRouterParam(event, 'orderNumber');
    const query = getQuery(event);
    const email = query.email as string;

    if (!orderNumber) {
        throw createError({
            statusCode: 400,
            message: 'Order number is required',
        });
    }

    if (!email) {
        throw createError({
            statusCode: 400,
            message: 'Email is required',
        });
    }

    const supabase = await serverSupabaseClient<any>(event);

    try {
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
            .eq('order_number', orderNumber)
            .maybeSingle();

        if (orderError) {
            console.error('Order fetch error:', orderError);
            throw createError({
                statusCode: 500,
                message: 'Failed to fetch order',
            });
        }

        if (!order) {
            throw createError({
                statusCode: 404,
                message: 'Order not found',
            });
        }

        if (order.billing_email !== email) {
            console.warn(`Unauthorized access attempt: Order ${orderNumber} accessed by ${email}`);
            throw createError({
                statusCode: 403,
                message: 'You do not have permission to view this order',
            });
        }

        const { data: timeline, error: timelineError } = await supabase
            .from('order_timeline')
            .select('*')
            .eq('order_id', order.id)
            .order('created_at', { ascending: false });

        if (timelineError) {
            console.error('Timeline fetch error:', timelineError);
        }

        const items = order.items || [];

        return {
            success: true,
            id: order.id,
            order_number: order.order_number,
            billing_first_name: order.billing_first_name,
            billing_last_name: order.billing_last_name,
            billing_email: order.billing_email,
            billing_phone: order.billing_phone,
            billing_address: order.billing_address,
            billing_postcode: order.billing_postcode,
            shipping_address: order.shipping_address,
            shipping_postcode: order.shipping_postcode,
            preferred_install_dates: order.preferred_install_dates || [],
            removal_dates: order.removal_dates || [],
            preferred_install_date: order.preferred_install_dates?.[0] || null,
            removal_date: order.removal_dates?.[0] || null,
            customer_note: order.customer_note,
            subtotal: order.subtotal,
            tax_total: order.tax_total,
            total: order.total,
            deposit_amount: order.deposit_amount,
            items: items,
            promo_codes: order.promo_codes || null,
            discount_amount: order.discount_amount || 0,
            payment_method: order.payment_method,
            payment_status: order.payment_status,
            transaction_id: order.transaction_id,
            approval_code: order.approval_code,
            payment_token: order.payment_token,
            status: order.status,
            install_status: order.install_status,
            metadata: order.metadata,
            created_at: order.created_at,
            updated_at: order.updated_at,
            timeline: timeline || [],
        };

    } catch (error: any) {
        console.error('Order fetch error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch order',
        });
    }
});