
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
        amount,
        first_name,
        last_name,
        email,
        invoice_number,
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
        deposit_amount = 0
    } = body;

    const mockResponse = {
        ssl_result: '0',
        ssl_result_message: 'APPROVED',
        ssl_txn_id: 'MOCK-TXN-' + Date.now(),
        ssl_token: 'MOCK-TOKEN-' + Math.random().toString(36).substring(2, 15),
        ssl_approval_code: 'MOCK-APPROVAL-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        ssl_avs_response: 'Y',
        ssl_cvv2_response: 'M',
    };

    // For testing: use mock data instead of real API call just change to false to trigger real converge pay API call
    const useMock = true;

    let response;
    if (useMock) {
        // Use mock data
        response = mockResponse;
        console.log('MOCK MODE: Using mock Converge response');
    } else {
        const formData = new URLSearchParams();
        formData.append('ssl_account_id', config.elavonAccountId!);
        formData.append('ssl_user_id', config.elavonUserId!);
        formData.append('ssl_pin', config.elavonPin!);
        formData.append('ssl_transaction_type', 'ccsale');
        formData.append('ssl_amount', amount.toString());
        formData.append('ssl_first_name', first_name);
        formData.append('ssl_last_name', last_name);
        formData.append('ssl_email', email);
        formData.append('ssl_invoice_number', invoice_number);
        formData.append('ssl_get_token', 'Y');

        const responseText = await $fetch<string>(
            'https://api.demo.convergepay.com/hosted-payments/transaction_token',
            {
                method: 'POST',
                body: formData.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const params = new URLSearchParams(responseText);
        response = Object.fromEntries(params.entries());

        if (response.ssl_result !== '0') {
            throw createError({
                statusCode: 400,
                message: response.ssl_result_message || 'Payment initialization failed',
            });
        }
    }

    // Create order in Supabase using service role
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
            transaction_id: response.ssl_txn_id,
            approval_code: response.ssl_approval_code || null,
            payment_token: response.ssl_token || null,
            status: 'pending',
            install_status: 'scheduled',
            metadata: {
                ssl_txn_id: response.ssl_txn_id,
                ssl_token: response.ssl_token,
                ssl_approval_code: response.ssl_approval_code,
                ssl_avs_response: response.ssl_avs_response,
                ssl_cvv2_response: response.ssl_cvv2_response,
                test_mode: useMock,
            }
        })
        .select()
        .single();

    if (orderError) {
        console.error('Order creation error:', orderError);
        throw createError({
            statusCode: 500,
            message: 'Payment successful but order creation failed',
        });
    }

    // Add timeline entry
    await supabase
        .from('order_timeline')
        .insert({
            order_id: order.id,
            status: 'pending',
            notes: `Order created and payment confirmed ${useMock ? '(MOCK MODE)' : ''}`,
        });

    return {
        success: true,
        token: response.ssl_token,
        transactionId: response.ssl_txn_id,
        approvalCode: response.ssl_approval_code,
        order: {
            id: order.id,
            order_number: order.order_number,
            total: order.total,
            status: order.status,
        },
    };
});