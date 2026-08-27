import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    if (!body.turnstile_token) {
        console.warn('Missing Turnstile token');
        return {
            success: false,
            error: 'Security verification required'
        };
    }

    try {
        const turnstileResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    secret: config.turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY || '',
                    response: body.turnstile_token,
                    remoteip: event.node.req.socket.remoteAddress || '',
                }),
            }
        );

        const turnstileResult = await turnstileResponse.json();

        if (!turnstileResult.success) {
            console.warn('Turnstile verification failed:', turnstileResult);
            return {
                success: false,
                error: 'Security verification failed'
            };
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return {
            success: false,
            error: 'Security verification failed'
        };
    }

    if (!body.transaction_id) {
        console.warn('Missing transaction ID');
        return {
            success: false,
            error: 'Transaction ID required'
        };
    }

    try {
        const elavonConfig = {
            accountId: config.elavonAccountId,
            userId: config.elavonUserId,
            pin: config.elavonPin,
            demo: config.elavonDemo,
        };

        const apiUrl = elavonConfig.demo
            ? 'https://api.demo.convergepay.com/transaction/verify'
            : 'https://api.convergepay.com/transaction/verify';

        const verifyResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                ssl_account_id: elavonConfig.accountId,
                ssl_user_id: elavonConfig.userId,
                ssl_pin: elavonConfig.pin,
                ssl_txn_id: body.transaction_id,
            }),
        });

        const verifyText = await verifyResponse.text();
        const params = new URLSearchParams(verifyText);
        const parsed = Object.fromEntries(params.entries());

        if (parsed.ssl_result !== '0') {
            console.warn('Transaction not approved:', parsed);
            return {
                success: false,
                error: 'Transaction not approved',
                details: parsed.ssl_result_message || 'Transaction declined'
            };
        }

        if (Number(parsed.ssl_amount) !== Number(body.total)) {
            console.warn('Amount mismatch:', {
                converge: parsed.ssl_amount,
                order: body.total
            });
            return {
                success: false,
                error: 'Amount mismatch'
            };
        }

        const cvvResponse = parsed.ssl_cvv2_response;
        if (cvvResponse && cvvResponse !== 'M') {
            console.warn('CVV verification failed:', cvvResponse);
            return {
                success: false,
                error: 'CVV verification failed',
                cvv_response: cvvResponse
            };
        }
    } catch (error) {
        console.error('Converge verification error:', error);
        return {
            success: false,
            error: 'Payment verification failed'
        };
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
        deposit_amount = 0,
        promo_code_id
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
            status: 'pending',
            install_status: 'scheduled',
            promo_code_id: promo_code_id || null,
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