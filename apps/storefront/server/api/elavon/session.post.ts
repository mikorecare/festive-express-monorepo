// server/api/elavon/session.post.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
    console.log('=== SESSION API CALLED ===');
    console.log('Timestamp:', new Date().toISOString());

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
        demo: config.elavonDemo || 'true',
        // Show first 4 chars only for debugging
        accountIdPrefix: config.elavonAccountId ? String(config.elavonAccountId).substring(0, 4) + '****' : null,
        userIdPrefix: config.elavonUserId ? String(config.elavonUserId).substring(0, 4) + '****' : null,
    });

    // Validate config
    if (!config.elavonAccountId || !config.elavonUserId || !config.elavonPin) {
        console.error('Missing Elavon credentials');
        console.error('elavonAccountId:', !!config.elavonAccountId);
        console.error('elavonUserId:', !!config.elavonUserId);
        console.error('elavonPin:', !!config.elavonPin);
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

    console.log('Extracted fields:', {
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
    });

    // Validate required fields
    if (!amount) {
        console.error('Validation failed: Amount is required');
        return { success: false, error: 'Amount is required' };
    }
    if (!first_name) {
        console.error('Validation failed: First name is required');
        return { success: false, error: 'First name is required' };
    }
    if (!last_name) {
        console.error('Validation failed: Last name is required');
        return { success: false, error: 'Last name is required' };
    }
    if (!email) {
        console.error('Validation failed: Email is required');
        return { success: false, error: 'Email is required' };
    }
    console.log('Validation passed: All required fields present');

    try {
        // Format amount
        const formattedAmount = Number(amount).toFixed(2);
        console.log('Formatted amount:', formattedAmount);

        // Build form data
        console.log('Building form data...');
        const formData = new URLSearchParams();

        const formFields = {
            ssl_account_id: String(config.elavonAccountId).trim(),
            ssl_user_id: String(config.elavonUserId).trim(),
            ssl_pin: String(config.elavonPin).trim(),
            ssl_vendor_id: String(config.elavonVendorId || 'INITIAL').trim(),
            ssl_partner_app_id: String(config.elavonPartnerAppId || 'INITIAL').trim(),
            ssl_transaction_type: 'ccsale',
            ssl_amount: formattedAmount,
            ssl_first_name: String(first_name).trim(),
            ssl_last_name: String(last_name).trim(),
            ssl_email: String(email).trim(),
            ssl_invoice_number: String(invoice_number || `F-EX-${Date.now()}`).trim(),
            ssl_get_token: 'Y',
        };

        // Append all fields
        Object.entries(formFields).forEach(([key, value]) => {
            formData.append(key, value);
            console.log(`Form field: ${key} = ${key.includes('pin') || key.includes('account') ? '****' : value}`);
        });

        // Optional fields
        const optionalFields = {
            ssl_avs_address: billing_address,
            ssl_city: billing_city,
            ssl_state: billing_state,
            ssl_avs_zip: billing_zip,
            ssl_country: billing_country,
            ssl_phone: billing_phone,
        };

        Object.entries(optionalFields).forEach(([key, value]) => {
            if (value) {
                formData.append(key, String(value).trim());
                console.log(`Form field (optional): ${key} = ${String(value).trim()}`);
            }
        });

        // Log the complete form data (with sensitive info masked)
        const logFormData = Object.fromEntries(formData);
        console.log('Complete form data (masked):', {
            ...logFormData,
            ssl_pin: '****',
            ssl_account_id: logFormData.ssl_account_id ? logFormData.ssl_account_id.substring(0, 4) + '****' : null,
            ssl_user_id: logFormData.ssl_user_id ? logFormData.ssl_user_id.substring(0, 4) + '****' : null,
        });

        // Log the raw form data string (with sensitive info masked)
        const rawFormString = formData.toString();
        const maskedRawForm = rawFormString
            .replace(/ssl_pin=[^&]*/g, 'ssl_pin=****')
            .replace(/ssl_account_id=[^&]*/g, 'ssl_account_id=****')
            .replace(/ssl_user_id=[^&]*/g, 'ssl_user_id=****');
        console.log('Raw form data string (masked):', maskedRawForm);
        console.log('Raw form data length:', rawFormString.length);

        // Determine API URL
        const isDemo = true;
        const apiUrl = isDemo
            ? 'https://api.demo.convergepay.com/hosted-payments/transaction_token'
            : 'https://api.convergepay.com/hosted-payments/transaction_token';

        console.log('=== REQUEST DETAILS ===');
        console.log('API URL:', apiUrl);
        console.log('Method: POST');
        console.log('Content-Type: application/x-www-form-urlencoded');
        console.log('Headers:', {
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        console.log('Body (masked):', maskedRawForm);
        console.log('=======================');

        console.log('Calling Converge API...');

        // Make the request - using simple fetch to avoid $fetch issues
        let responseText;
        let responseStatus;
        let responseHeaders;
        try {
            const startTime = Date.now();
            console.log('Fetch start time:', new Date(startTime).toISOString());

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            const endTime = Date.now();
            console.log('Fetch end time:', new Date(endTime).toISOString());
            console.log('Request duration:', endTime - startTime, 'ms');

            responseStatus = response.status;
            responseHeaders = Object.fromEntries(response.headers.entries());

            console.log('=== RESPONSE DETAILS ===');
            console.log('Response status:', response.status);
            console.log('Response status text:', response.statusText);
            console.log('Response headers:', JSON.stringify(responseHeaders, null, 2));
            console.log('Response headers - content-type:', responseHeaders['content-type']);
            console.log('========================');

            responseText = await response.text();
            console.log('Response text length:', responseText.length);
            console.log('Response text (first 500 chars):', responseText.substring(0, 500));
            console.log('Full response text:', responseText);

            if (!response.ok) {
                console.error('HTTP error:', response.status, response.statusText);
                console.error('Error response body:', responseText);
                return {
                    success: false,
                    error: `HTTP error: ${response.status} ${response.statusText}`,
                    details: responseText,
                    status: response.status
                };
            }
        } catch (fetchError: any) {
            console.error('=== FETCH ERROR ===');
            console.error('Error message:', fetchError.message);
            console.error('Error name:', fetchError.name);
            console.error('Error stack:', fetchError.stack);
            console.error('Error cause:', fetchError.cause);
            console.error('==================');
            return {
                success: false,
                error: 'Network error connecting to payment gateway',
                details: fetchError.message,
                stack: process.env.NODE_ENV === 'development' ? fetchError.stack : undefined
            };
        }

        if (!responseText || responseText.trim() === '') {
            console.error('Empty response from Converge');
            console.error('Response status was:', responseStatus);
            console.error('Response headers were:', responseHeaders);
            return {
                success: false,
                error: 'Empty response from payment gateway',
                details: {
                    status: responseStatus,
                    headers: responseHeaders
                }
            };
        }

        // Parse response
        let response;
        try {
            console.log('Parsing response with URLSearchParams...');
            const params = new URLSearchParams(responseText);
            response = Object.fromEntries(params.entries());
            console.log('Parsed response keys:', Object.keys(response));
            console.log('Parsed response (masked):', {
                ...response,
                ssl_pin: response.ssl_pin ? '****' : undefined,
                ssl_account_id: response.ssl_account_id ? response.ssl_account_id.substring(0, 4) + '****' : undefined,
            });
            console.log('Full parsed response:', JSON.stringify(response, null, 2));
        } catch (parseError: any) {
            console.error('Failed to parse response:', parseError);
            console.error('Response text that failed to parse:', responseText);
            return {
                success: false,
                error: 'Failed to parse payment gateway response',
                details: responseText,
                parseError: parseError.message
            };
        }

        // Check for errors
        console.log('Checking response for errors...');
        console.log('ssl_result:', response.ssl_result);
        console.log('ssl_result_message:', response.ssl_result_message);
        console.log('errorCode:', response.errorCode);
        console.log('errorMessage:', response.errorMessage);

        if (response.ssl_result && response.ssl_result !== '0') {
            console.error('Converge returned error:', response);
            console.error('Error details:', {
                ssl_result: response.ssl_result,
                ssl_result_message: response.ssl_result_message,
                errorCode: response.errorCode,
                errorMessage: response.errorMessage,
            });
            return {
                success: false,
                error: response.ssl_result_message || 'Payment initialization failed',
                errorCode: response.errorCode || response.ssl_result,
                details: response
            };
        }

        if (response.errorCode) {
            console.error('Converge returned error code:', response);
            console.error('Error details:', {
                errorCode: response.errorCode,
                errorMessage: response.errorMessage,
            });
            return {
                success: false,
                error: response.errorMessage || 'Payment initialization failed',
                errorCode: response.errorCode,
                details: response
            };
        }

        // Check for token
        console.log('Checking for token...');
        console.log('ssl_txn_auth_token present:', !!response.ssl_txn_auth_token);
        console.log('ssl_txn_auth_token value:', response.ssl_txn_auth_token ? response.ssl_txn_auth_token.substring(0, 20) + '...' : 'null');

        if (!response.ssl_txn_auth_token) {
            console.error('No token in response:', response);
            return {
                success: false,
                error: 'No session token returned',
                details: response
            };
        }

        // Success
        console.log('=== SUCCESS ===');
        console.log('Session token generated successfully');
        console.log('Token:', response.ssl_txn_auth_token.substring(0, 20) + '...');
        console.log('Transaction ID:', response.ssl_txn_id);
        console.log('Approval Code:', response.ssl_approval_code);
        console.log('================');

        return {
            success: true,
            token: response.ssl_txn_auth_token,
            transactionId: response.ssl_txn_id || null,
            approvalCode: response.ssl_approval_code || null
        };

    } catch (error: any) {
        console.error('=== UNEXPECTED ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error name:', error.name);
        console.error('Error cause:', error.cause);
        console.error('=======================');
        return {
            success: false,
            error: error.message || 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
});