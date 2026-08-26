export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    const {
        amount,
        first_name,
        last_name,
        email,
        invoice_number,
    } = body;

    const formData = new URLSearchParams();
    formData.append('ssl_account_id', config.elavonAccountId!);
    formData.append('ssl_user_id', config.elavonUserId!);
    formData.append('ssl_pin', config.elavonPin!);
    formData.append('ssl_vendor_id', "INITIAL");
    formData.append('ssl_partner_app_id', "INITIAL");
    formData.append('ssl_transaction_type', 'ccsale');
    formData.append('ssl_amount', amount.toString());
    formData.append('ssl_first_name', first_name);
    formData.append('ssl_last_name', last_name);
    formData.append('ssl_email', email);
    formData.append('ssl_invoice_number', invoice_number);
    formData.append('ssl_get_token', 'Y');

    try {
        const responseText = await $fetch<string>(
            '[https://api.demo.convergepay.com/hosted-payments/transaction_token](https://api.demo.convergepay.com/hosted-payments/transaction_token)',
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

        // Converge errors usually populate inside ssl_result_message or errorCode when authentication fails
        if (response.errorCode || (response.ssl_result && response.ssl_result !== '0')) {
            throw createError({
                statusCode: 400,
                message: response.errorMessage || response.ssl_result_message || 'Payment initialization failed',
            });
        }

        return {
            success: true,
            // Changed from ssl_token to ssl_txn_auth_token per Elavon specification
            token: response.ssl_txn_auth_token,
            transactionId: response.ssl_txn_id,
            approvalCode: response.ssl_approval_code,
        };

    } catch (error: any) {
        console.error('Converge error:', error);
        return {
            success: false,
            error: error.message || 'Payment initialization failed',
            details: error.data || error,
        };
    }

});