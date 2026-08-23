
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

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

    const {
        first_name,
        last_name,
        email,
        billing_phone,
        billing_address,
        billing_postcode,
        shipping_address,
        shipping_postcode,
        preferred_install_dates,
        removal_dates,
        customer_note,
        items,
        subtotal,
        tax_total,
        total,
        transaction_id,
        approval_code,
        payment_token,
        deposit_amount = 0
    } = body;

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            billing_first_name: first_name,
            billing_last_name: last_name,
            billing_email: email,
            billing_phone: billing_phone || '',
            billing_address: billing_address || shipping_address || '',
            billing_postcode: billing_postcode || shipping_postcode || '',
            shipping_address: shipping_address || billing_address || '',
            shipping_postcode: shipping_postcode || billing_postcode || '',
            preferred_install_dates: preferred_install_dates || [],
            removal_dates: removal_dates || [],
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
            status: 'confirmed',
            install_status: 'scheduled',
        })
        .select()
        .single();

    if (orderError) {
        console.error('Order creation error:', orderError);
        throw createError({
            statusCode: 500,
            message: 'Failed to create order',
        });
    }

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