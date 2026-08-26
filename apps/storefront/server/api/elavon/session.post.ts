export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    const {
        amount,
        first_name,
        last_name,
        email,
        invoice_number,
        // Add these if needed
        company,
        avs_address,
        city,
        state,
        avs_zip,
        country,
        phone,
    } = body;

    // Format amount to have exactly 2 decimal places
    const formattedAmount = Number(amount).toFixed(2);

    const formData = new URLSearchParams();
    formData.append('ssl_account_id', config.elavonAccountId!);
    formData.append('ssl_user_id', config.elavonUserId!);
    formData.append('ssl_pin', config.elavonPin!);
    formData.append('ssl_vendor_id', config.elavonVendorId || "INITIAL"); // Use config or INITIAL for demo
    formData.append('ssl_partner_app_id', config.elavonPartnerAppId || "INITIAL");
    formData.append('ssl_transaction_type', 'ccsale');
    formData.append('ssl_amount', formattedAmount);
    formData.append('ssl_first_name', first_name);
    formData.append('ssl_last_name', last_name);
    formData.append('ssl_email', email);
    formData.append('ssl_invoice_number', invoice_number);
    formData.append('ssl_get_token', 'Y');

    // Optional fields - add if provided
    if (company) formData.append('ssl_company', company);
    if (avs_address) formData.append('ssl_avs_address', avs_address);
    if (city) formData.append('ssl_city', city);
    if (state) formData.append('ssl_state', state);
    if (avs_zip) formData.append('ssl_avs_zip', avs_zip);
    if (country) formData.append('ssl_country', country);
    if (phone) formData.append('ssl_phone', phone);

    try {
        const responseText = await $fetch<string>(
            // process.env.NODE_ENV === 'production'
            //     ? 'https://api.convergepay.com/hosted-payments/transaction_token'
            //     : 'https://api.demo.convergepay.com/hosted-payments/transaction_token',
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
        const response = Object.fromEntries(params.entries());

        // Check for errors - Converge returns ssl_result=0 for success
        // Note: In the documentation, ssl_result = '0' typically means success
        if (response.ssl_result && response.ssl_result !== '0') {
            return {
                success: false,
                error: response.ssl_result_message || 'Payment initialization failed',
                errorCode: response.errorCode,
            };
        }

        // Also check for errorCode
        if (response.errorCode) {
            return {
                success: false,
                error: response.errorMessage || 'Payment initialization failed',
                errorCode: response.errorCode,
            };
        }

        // Success - return the token
        return {
            success: true,
            token: response.ssl_txn_auth_token, // Changed from ssl_token to ssl_txn_auth_token per docs
            transactionId: response.ssl_txn_id,
            approvalCode: response.ssl_approval_code,
        };

    } catch (error: any) {
        console.error('Converge error:', error);

        // Return structured error response
        return {
            success: false,
            error: error.message || 'Payment initialization failed',
            // If it's a fetch error, include status
            ...(error.statusCode && { statusCode: error.statusCode }),
            details: error.data || error,
        };
    }
});