import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    const { orderId, transactionId, amount, reason, notes } = body;

    if (!orderId || !transactionId) {
        throw createError({
            statusCode: 400,
            message: 'Order ID and Transaction ID are required',
        });
    }

    if (!amount || amount <= 0) {
        throw createError({
            statusCode: 400,
            message: 'Valid refund amount is required',
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
        // Get order details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            throw createError({
                statusCode: 404,
                message: 'Order not found',
            });
        }

        // Validate order is eligible for refund
        if (order.payment_status !== 'paid') {
            throw createError({
                statusCode: 400,
                message: `Order is not eligible for refund (payment status: ${order.payment_status})`,
            });
        }

        if (order.transaction_id !== transactionId) {
            throw createError({
                statusCode: 400,
                message: 'Transaction ID mismatch',
            });
        }

        if (amount > Number(order.total)) {
            throw createError({
                statusCode: 400,
                message: `Refund amount cannot exceed $${Number(order.total).toFixed(2)}`,
            });
        }

        // Process refund with Elavon/Converge
        const refundResponse = await processElavonRefund({
            transactionId: transactionId,
            amount: amount,
            merchantId: config.elavonAccountId,
            userId: config.elavonUserId,
            pin: config.elavonPin,
            demo: config.elavonDemo,
        });

        if (!refundResponse.success) {
            throw createError({
                statusCode: 500,
                message: refundResponse.error || 'Refund processing failed',
            });
        }

        // Update order with refund details
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                payment_status: 'refunded',
                status: 'refunded',
                refund_amount: amount,
                refund_transaction_id: refundResponse.refundTransactionId,
                refund_reason: reason || null,
                refund_notes: notes || null,
                refunded_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

        if (updateError) {
            console.error('Failed to update order status:', updateError);
            throw createError({
                statusCode: 500,
                message: 'Failed to update order status after refund',
            });
        }

        // Add timeline entry
        await supabase
            .from('order_timeline')
            .insert({
                order_id: orderId,
                status: 'refunded',
                notes: `Refund of $${amount.toFixed(2)} processed${reason ? ` (${reason})` : ''}${notes ? ` - ${notes}` : ''}`,
            });

        return {
            success: true,
            refund: {
                amount: amount,
                transactionId: refundResponse.refundTransactionId,
                originalTransactionId: transactionId,
            },
        };

    } catch (error: any) {
        console.error('Refund API error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Refund failed',
        });
    }
});

async function processElavonRefund(params: {
    transactionId: string;
    amount: number;
    merchantId: string;
    userId: string;
    pin: string;
    demo: boolean;
}) {
    const { transactionId, amount, merchantId, userId, pin, demo } = params;

    if (!merchantId || !userId || !pin) {
        return {
            success: false,
            error: 'Missing Elavon credentials',
        };
    }

    // Build raw XML
    const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<txn>
    <ssl_merchant_id>${merchantId}</ssl_merchant_id>
    <ssl_user_id>${userId}</ssl_user_id>
    <ssl_pin>${pin}</ssl_pin>
    <ssl_transaction_type>linkedrefund</ssl_transaction_type>
    <ssl_txn_id>${transactionId}</ssl_txn_id>
    <ssl_amount>${amount.toFixed(2)}</ssl_amount>
</txn>`;

    // URL encode the XML
    const encodedXml = encodeURIComponent(xmlPayload);
    const requestData = `xmldata=${encodedXml}`;

    const baseUrl = demo
        ? 'https://api.demo.convergepay.com'
        : 'https://api.convergepay.com';

    const endpoint = demo
        ? `${baseUrl}/VirtualMerchantDemo/processxml.do`
        : `${baseUrl}/VirtualMerchant/processxml.do`;

    console.log(`Processing refund using ${demo ? 'DEMO' : 'PRODUCTION'} environment: ${endpoint}`);
    console.log('XML Payload:', xmlPayload);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestData,
        });

        const responseText = await response.text();
        console.log('Elavon refund response:', responseText);

        if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
            console.error('Elavon returned HTML instead of XML:', responseText);
            return {
                success: false,
                error: 'Payment gateway returned an unexpected server page. Please verify endpoints.',
            };
        }

        const result = parseConvergeResponse(responseText);

        // Check for error response
        if (result.errorCode) {
            return {
                success: false,
                error: `${result.errorName || 'Error'}: ${result.errorMessage || result.errorCode}`,
            };
        }

        if (result.ssl_result === '0') {
            return {
                success: true,
                refundTransactionId: result.ssl_txn_id || '',
                approvalCode: result.ssl_approval_code || '',
            };
        } else {
            return {
                success: false,
                error: result.ssl_result_message || 'Refund failed',
            };
        }
    } catch (error: any) {
        console.error('Elavon refund error:', error);
        return {
            success: false,
            error: error.message || 'Failed to connect to payment gateway',
        };
    }
}

function parseConvergeResponse(xml: string) {
    const result: Record<string, string> = {};
    const regex = /<([^>]+)>([^<]*)<\/\1>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
        const key = match[1];
        const value = match[2];
        if (key) {
            result[key] = value || '';
        }
    }
    return result;
}