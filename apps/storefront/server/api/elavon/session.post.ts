// server/api/elavon/session.post.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
    console.log('=== SESSION API CALLED ===');

    // Read body with error handling
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

    // Get config
    const config = useRuntimeConfig();
    console.log('Config check:', {
        hasAccountId: !!config.elavonAccountId,
        hasUserId: !!config.elavonUserId,
        hasPin: !!config.elavonPin,
        hasVendorId: !!config.elavonVendorId,
        demo: config.elavonDemo || 'true'
    });

    // Validate config
    if (!config.elavonAccountId || !config.elavonUserId || !config.elavonPin) {
        console.error('Missing Elavon credentials');
        return {
            success: false,
            error: 'Payment gateway configuration error',
            details: 'Missing required credentials'
        };
    }

    // Extract fields
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

    // Validate required fields
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
        // Format amount
        const formattedAmount = Number(amount).toFixed(2);
        console.log('Formatted amount:', formattedAmount);

        // Build form data
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

        // Optional fields
        if (billing_address) formData.append('ssl_avs_address', String(billing_address).trim());
        if (billing_city) formData.append('ssl_city', String(billing_city).trim());
        if (billing_state) formData.append('ssl_state', String(billing_state).trim());
        if (billing_zip) formData.append('ssl_avs_zip', String(billing_zip).trim());
        if (billing_country) formData.append('ssl_country', String(billing_country).trim());
        if (billing_phone) formData.append('ssl_phone', String(billing_phone).trim());

        // Determine API URL
        const isDemo = true;
        const apiUrl = isDemo
            ? 'https://api.demo.convergepay.com/hosted-payments/transaction_token'
            : 'https://api.convergepay.com/hosted-payments/transaction_token';

        console.log('Calling Converge API:', apiUrl);

        // Make the request - using simple fetch to avoid $fetch issues
        let responseText;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            responseText = await response.text();
            console.log('Response status:', response.status);
            console.log('Response text:', responseText);

            if (!response.ok) {
                console.error('HTTP error:', response.status, response.statusText);
                return {
                    success: false,
                    error: `HTTP error: ${response.status} ${response.statusText}`,
                    details: responseText
                };
            }
        } catch (fetchError: any) {
            console.error('Fetch error:', fetchError.message);
            return {
                success: false,
                error: 'Network error connecting to payment gateway',
                details: fetchError.message
            };
        }

        if (!responseText || responseText.trim() === '') {
            console.error('Empty response from Converge');
            return {
                success: false,
                error: 'Empty response from payment gateway'
            };
        }

        // Parse response
        let response;
        try {
            const params = new URLSearchParams(responseText);
            response = Object.fromEntries(params.entries());
            console.log('Parsed response:', JSON.stringify(response, null, 2));
        } catch (parseError: any) {
            console.error('Failed to parse response:', parseError);
            return {
                success: false,
                error: 'Failed to parse payment gateway response',
                details: responseText
            };
        }

        // Check for errors
        if (response.ssl_result && response.ssl_result !== '0') {
            console.error('Converge error:', response);
            return {
                success: false,
                error: response.ssl_result_message || 'Payment initialization failed',
                errorCode: response.errorCode || response.ssl_result,
                details: response
            };
        }

        if (response.errorCode) {
            console.error('Converge error code:', response);
            return {
                success: false,
                error: response.errorMessage || 'Payment initialization failed',
                errorCode: response.errorCode,
                details: response
            };
        }

        // Check for token
        if (!response.ssl_txn_auth_token) {
            console.error('No token in response:', response);
            return {
                success: false,
                error: 'No session token returned',
                details: response
            };
        }

        // Success
        console.log('Session token generated successfully');
        return {
            success: true,
            token: response.ssl_txn_auth_token,
            transactionId: response.ssl_txn_id || null,
            approvalCode: response.ssl_approval_code || null
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