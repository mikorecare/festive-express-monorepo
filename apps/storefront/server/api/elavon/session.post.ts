// server/api/elavon/session.post.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
    console.log('=== SESSION API CALLED ===');
    console.log('Timestamp:', new Date().toISOString());

    let body;
    try {
        body = await readBody(event);
        console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (err) {
        console.error('Failed to read body:', err);
        return {
            success: false,
            error: 'Invalid request body'
        };
    }

    const config = useRuntimeConfig();
    console.log('Config check:', {
        hasAccountId: !!config.elavonAccountId,
        hasUserId: !!config.elavonUserId,
        hasPin: !!config.elavonPin,
        hasVendorId: !!config.elavonVendorId,
        demo: config.elavonDemo || 'true'
    });

    if (!config.elavonAccountId || !config.elavonUserId || !config.elavonPin) {
        console.error('Missing Elavon credentials');
        return {
            success: false,
            error: 'Payment gateway configuration error',
            details: 'Missing required credentials'
        };
    }

    const {
        amount,
        first_name,
        last_name,
        email,
        invoice_number,
        billing_address,
        billing_city,
        billing_state,
        billing_zip,
        billing_country,
        billing_phone,
    } = body;

    if (!amount) {
        return { success: false, error: 'Amount is required' };
    }
    if (!first_name) {
        return { success: false, error: 'First name is required' };
    }
    if (!last_name) {
        return { success: false, error: 'Last name is required' };
    }
    if (!email) {
        return { success: false, error: 'Email is required' };
    }

    try {
        const formattedAmount = Number(amount).toFixed(2);
        console.log('Formatted amount:', formattedAmount);

        const formData = new URLSearchParams();
        formData.append('ssl_account_id', String(config.elavonAccountId).trim());
        formData.append('ssl_user_id', String(config.elavonUserId).trim());
        formData.append('ssl_pin', String(config.elavonPin).trim());
        formData.append('ssl_vendor_id', String(config.elavonVendorId || 'INITIAL').trim());
        formData.append('ssl_partner_app_id', String(config.elavonPartnerAppId || 'INITIAL').trim());
        formData.append('ssl_transaction_type', 'ccsale');
        formData.append('ssl_amount', formattedAmount);
        formData.append('ssl_first_name', String(first_name).trim());
        formData.append('ssl_last_name', String(last_name).trim());
        formData.append('ssl_email', String(email).trim());
        formData.append('ssl_invoice_number', String(invoice_number || `F-EX-${Date.now()}`).trim());
        formData.append('ssl_get_token', 'Y');

        if (billing_address) formData.append('ssl_avs_address', String(billing_address).trim());
        if (billing_city) formData.append('ssl_city', String(billing_city).trim());
        if (billing_state) formData.append('ssl_state', String(billing_state).trim());
        if (billing_zip) formData.append('ssl_avs_zip', String(billing_zip).trim());
        if (billing_country) formData.append('ssl_country', String(billing_country).trim());
        if (billing_phone) formData.append('ssl_phone', String(billing_phone).trim());

        const apiUrl = 'https://api.demo.convergepay.com/hosted-payments/transaction_token';
        console.log('Calling Converge API:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', responseText);

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP error: ${response.status} ${response.statusText}`,
                details: responseText
            };
        }

        if (!responseText || responseText.trim() === '') {
            return {
                success: false,
                error: 'Empty response from payment gateway'
            };
        }

        // FIX: Handle both response formats
        let token = null;
        let transactionId = null;
        let approvalCode = null;

        // Check if response is URL-encoded (key=value&key2=value2)
        if (responseText.includes('=') && responseText.includes('&')) {
            // URL-encoded format
            const params = new URLSearchParams(responseText);
            const parsed = Object.fromEntries(params.entries());
            console.log('Parsed URL-encoded response:', parsed);

            if (parsed.ssl_result && parsed.ssl_result !== '0') {
                return {
                    success: false,
                    error: parsed.ssl_result_message || 'Payment initialization failed',
                    errorCode: parsed.errorCode || parsed.ssl_result,
                    details: parsed
                };
            }

            if (parsed.errorCode) {
                return {
                    success: false,
                    error: parsed.errorMessage || 'Payment initialization failed',
                    errorCode: parsed.errorCode,
                    details: parsed
                };
            }

            token = parsed.ssl_txn_auth_token || parsed.ssl_token;
            transactionId = parsed.ssl_txn_id;
            approvalCode = parsed.ssl_approval_code;
        } else {
            // Plain text format - the response itself is the token!
            console.log('Response is plain text token format');

            // Check if it looks like an error message
            if (responseText.toLowerCase().includes('error') ||
                responseText.toLowerCase().includes('invalid') ||
                responseText.toLowerCase().includes('failed')) {
                return {
                    success: false,
                    error: 'Payment initialization failed',
                    details: responseText
                };
            }

            // The entire response is the token
            token = responseText.trim();
            console.log('Token extracted from plain text response:', token);
        }

        // Check if we have a token
        if (!token) {
            console.error('No token found in response:', responseText);
            return {
                success: false,
                error: 'No session token returned',
                details: responseText
            };
        }

        console.log('Session token generated successfully');
        return {
            success: true,
            token: token,
            transactionId: transactionId || null,
            approvalCode: approvalCode || null
        };

    } catch (error: any) {
        console.error('Unexpected error:', error);
        return {
            success: false,
            error: error.message || 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
});