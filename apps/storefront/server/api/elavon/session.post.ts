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

    const mockResponse = {
        ssl_result: '0',
        ssl_result_message: 'APPROVED',
        ssl_txn_id: 'MOCK-TXN-' + Date.now(),
        ssl_token: 'MOCK-TOKEN-' + Math.random().toString(36).substring(2, 15),
        ssl_approval_code: 'MOCK-APPROVAL-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        ssl_avs_response: 'Y',
        ssl_cvv2_response: 'M',
    };

    const useMock = true;
    let response;

    if (useMock) {
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

    return {
        success: true,
        token: response.ssl_token,
        transactionId: response.ssl_txn_id,
        approvalCode: response.ssl_approval_code,
    };
});