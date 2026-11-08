import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    // 1. Verify Turnstile
    if (!body.turnstile_token) {
        console.warn('Missing Turnstile token');
        return { success: false, error: 'Security verification required' };
    }

    try {
        const turnstileResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    secret: config.turnstile?.secretKey || process.env.NUXT_TURNSTILE_SECRET_KEY || "",
                    response: body.turnstile_token,
                    remoteip: event.node.req.socket.remoteAddress || '',
                }),
            }
        );

        const turnstileResult = await turnstileResponse.json();

        if (!turnstileResult.success) {
            console.warn('Turnstile verification failed:', turnstileResult);
            return { success: false, error: 'Security verification failed' };
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return { success: false, error: 'Security verification failed' };
    }

    // 2. Prevent duplicate orders
    if (!body.transaction_id) {
        console.warn('Missing transaction ID');
        return { success: false, error: 'Transaction ID required' };
    }

    const supabase = getSupabase();

    const { data: existingOrder } = await supabase
        .from('orders')
        .select('id, order_number')
        .eq('transaction_id', body.transaction_id)
        .maybeSingle();

    if (existingOrder) {
        console.warn('Duplicate transaction:', body.transaction_id);
        return {
            success: false,
            error: 'Duplicate transaction',
            existing_order: existingOrder.order_number
        };
    }

    // 3. Extract Data
    const {
        first_name,
        last_name,
        email,
        billing_phone,
        billing_address,
        billing_postcode,
        customer_note,
        items,
        subtotal,
        tax_total,
        total,
        transaction_id,
        approval_code,
        payment_token,
        deposit_amount = 0,
        promo_code_id
    } = body;

    // 4. Create the Order
    const result = await supabase
        .from('orders')
        .insert({
            billing_first_name: first_name,
            billing_last_name: last_name,
            billing_email: email,
            billing_phone: billing_phone || '',
            billing_address: billing_address || '',
            billing_postcode: billing_postcode || '',
            shipping_address: billing_address || '',
            shipping_postcode: billing_postcode || '',
            preferred_install_dates: items[0]?.preferred_install_dates || [],
            removal_dates: items[0]?.removal_dates || [],
            customer_note: customer_note || null,
            items: items || [],
            subtotal: subtotal || 0,
            tax_total: tax_total || 0,
            total: total || 0,
            deposit_amount: deposit_amount || 0,
            payment_method: 'converge',
            payment_status: 'paid',
            transaction_id: transaction_id,
            approval_code: approval_code || null,
            payment_token: payment_token || null,
            status: 'pending',
            install_status: 'scheduled',
            promo_code_id: promo_code_id || null,
        })
        .select()
        .single();

    if (result.error) {
        console.error('Order creation error:', result.error);
        throw createError({
            statusCode: 500,
            message: 'Failed to create order',
        });
    }

    const order = result.data as any;

    // 5. Log Timeline
    await supabase
        .from('order_timeline')
        .insert({
            order_id: order.id,
            status: 'pending',
            notes: 'Order created and payment confirmed',
        });

    return {
        success: true,
        order: {
            id: order.id,
            order_number: order.order_number,
            total: order.total,
            status: order.status,
        },
    };
});