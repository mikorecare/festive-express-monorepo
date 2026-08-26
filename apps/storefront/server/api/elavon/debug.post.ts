import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
    const config = useRuntimeConfig();

    const formData = new URLSearchParams();
    formData.append('ssl_account_id', String(config.elavonAccountId).trim());
    formData.append('ssl_user_id', String(config.elavonUserId).trim());
    formData.append('ssl_pin', String(config.elavonPin).trim());
    formData.append('ssl_vendor_id', 'INITIAL');
    formData.append('ssl_partner_app_id', 'INITIAL');
    formData.append('ssl_transaction_type', 'ccsale');
    formData.append('ssl_amount', '1.00');
    formData.append('ssl_first_name', 'John');
    formData.append('ssl_last_name', 'Doe');
    formData.append('ssl_email', 'john@example.com');
    formData.append('ssl_invoice_number', `TEST-${Date.now()}`);
    formData.append('ssl_get_token', 'Y');

    try {
        const response = await fetch('https://api.demo.convergepay.com/hosted-payments/transaction_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const text = await response.text();
        const params = new URLSearchParams(text);
        const result = Object.fromEntries(params.entries());

        return {
            status: response.status,
            statusText: response.statusText,
            response: text,
            parsed: result,
            credentials: {
                accountId: config.elavonAccountId ? 'present' : 'missing',
                userId: config.elavonUserId ? 'present' : 'missing',
                pin: config.elavonPin ? 'present' : 'missing',
            }
        };
    } catch (error: any) {
        return {
            error: error.message,
            stack: error.stack
        };
    }
});