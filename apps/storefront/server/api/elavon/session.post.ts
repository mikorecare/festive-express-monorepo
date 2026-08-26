import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const config = useRuntimeConfig();

        console.log('Session request body:', body);

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

        if (!amount || !first_name || !last_name || !email) {
            console.error('Missing required fields');
            return {
                success: false,
                error: 'Missing required fields: amount, first_name, last_name, email'
            };
        }

        const formattedAmount = Number(amount).toFixed(2);

        const formData = new URLSearchParams();

        formData.append('ssl_account_id', config.elavonAccountId?.toString() || '');
        formData.append('ssl_user_id', config.elavonUserId || '');
        formData.append('ssl_pin', config.elavonPin || '');
        formData.append('ssl_vendor_id', config.elavonVendorId || 'INITIAL');
        formData.append('ssl_partner_app_id', config.elavonPartnerAppId || 'INITIAL');
        formData.append('ssl_transaction_type', 'ccsale');
        formData.append('ssl_amount', formattedAmount);
        formData.append('ssl_first_name', first_name);
        formData.append('ssl_last_name', last_name);
        formData.append('ssl_email', email);
        formData.append('ssl_invoice_number', invoice_number || `F-EX-${Date.now()}`);
        formData.append('ssl_get_token', 'Y');

        if (billing_address) formData.append('ssl_avs_address', billing_address);
        if (billing_city) formData.append('ssl_city', billing_city);
        if (billing_state) formData.append('ssl_state', billing_state);
        if (billing_zip) formData.append('ssl_avs_zip', billing_zip);
        if (billing_country) formData.append('ssl_country', billing_country);
        if (billing_phone) formData.append('ssl_phone', billing_phone);

        const logData = { ...Object.fromEntries(formData) };
        logData.ssl_pin = '****';
        logData.ssl_account_id = '****';
        console.log('Sending to Converge:', logData);

        const isDemo = true;
        const apiUrl = isDemo
            ? 'https://api.demo.convergepay.com/hosted-payments/transaction_token'
            : 'https://api.convergepay.com/hosted-payments/transaction_token';

        console.log('Calling Converge API:', apiUrl);

        try {
            const responseText = await $fetch<string>(apiUrl, {
                method: 'POST',
                body: formData.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                ignoreResponseError: true,
            });

            console.log('Raw Converge response:', responseText);

            // Parse the response
            const params = new URLSearchParams(responseText);
            const response = Object.fromEntries(params.entries());

            console.log('Parsed Converge response:', {
                ...response,
                ssl_pin: '****', // Hide sensitive data
            });

            // Check for errors - Converge returns ssl_result=0 for success
            if (response.ssl_result && response.ssl_result !== '0') {
                console.error('Converge error response:', response);
                return {
                    success: false,
                    error: response.ssl_result_message || 'Payment initialization failed',
                    errorCode: response.errorCode,
                    details: response,
                };
            }

            // Also check for errorCode
            if (response.errorCode) {
                console.error('Converge error code:', response);
                return {
                    success: false,
                    error: response.errorMessage || 'Payment initialization failed',
                    errorCode: response.errorCode,
                    details: response,
                };
            }

            // Check if we have a token
            if (!response.ssl_txn_auth_token) {
                console.error('No token in response:', response);
                return {
                    success: false,
                    error: 'No session token returned from Converge',
                    details: response,
                };
            }

            // Success
            console.log('Session token generated successfully');
            return {
                success: true,
                token: response.ssl_txn_auth_token,
                transactionId: response.ssl_txn_id,
                approvalCode: response.ssl_approval_code,
            };

        } catch (fetchError: any) {
            // This catches network errors or other fetch issues
            console.error('Fetch error:', {
                message: fetchError.message,
                status: fetchError.status,
                statusText: fetchError.statusText,
                data: fetchError.data,
            });

            // Try to get response body if available
            let errorDetails = fetchError.message;
            if (fetchError.data) {
                try {
                    const text = await fetchError.data.text?.() || fetchError.data;
                    errorDetails = text;
                } catch (e) {
                    errorDetails = fetchError.data;
                }
            }

            return {
                success: false,
                error: 'Network error communicating with Converge',
                details: errorDetails,
                status: fetchError.status,
            };
        }

    } catch (error: any) {
        console.error('Unexpected error:', error);
        return {
            success: false,
            error: error.message || 'Internal server error',
            details: error.stack,
        };
    }
});