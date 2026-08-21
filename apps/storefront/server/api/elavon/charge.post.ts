export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    const {
        amount,
        card_number,
        card_expiry,
        card_cvv,
        card_name,
        billing_first_name,
        billing_last_name,
        billing_email,
        billing_phone,
        billing_address,
        billing_postcode,
        turnstileToken,
    } = body;

    if (!turnstileToken) {
        throw createError({ statusCode: 400, message: 'Security verification required' });
    }

    try {
        const secretKey = config.turnstile.secretKey;

        interface TurnstileResponse {
            success: boolean;
            'error-codes'?: string[];
            challenge_ts?: string;
            hostname?: string;
        }

        const verification = await $fetch<TurnstileResponse>('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: secretKey,
                response: turnstileToken,
                remoteip: getRequestIP(event) || '',
            }),
        });

        if (!verification.success) {
            throw createError({ statusCode: 400, message: 'Security verification failed' });
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        throw createError({ statusCode: 400, message: 'Security verification failed' });
    }

    const [expMonth, expYear] = card_expiry.split('/');
    const formattedYear = expYear.length === 2 ? `20${expYear}` : expYear;

    const accountId = config.elavonAccountId;
    const userId = config.elavonUserId;
    const pin = config.elavonPin;

    console.log('🔑 Elavon credentials:', {
        merchant_id: accountId ? '✅ SET' : '❌ MISSING',
        user_id: userId ? '✅ SET' : '❌ MISSING',
        pin: pin ? '✅ SET' : '❌ MISSING',
    });

    const formData = new URLSearchParams();
    formData.append('ssl_account_id', accountId!);
    formData.append('ssl_user_id', userId!);
    formData.append('ssl_pin', pin!);
    formData.append('ssl_transaction_type', 'ccsale');
    formData.append('ssl_amount', amount.toString());
    formData.append('ssl_card_number', card_number.replace(/\s/g, ''));
    formData.append('ssl_exp_date', `${expMonth}${formattedYear.slice(-2)}`);
    formData.append('ssl_cvv2cvc2', card_cvv);
    formData.append('ssl_first_name', billing_first_name);
    formData.append('ssl_last_name', billing_last_name);
    formData.append('ssl_email', billing_email);
    formData.append('ssl_phone', billing_phone);
    formData.append('ssl_avs_address', billing_address);
    formData.append('ssl_avs_zip', billing_postcode);
    formData.append('ssl_invoice_number', `FLP-${Date.now()}`);
    formData.append('ssl_get_token', 'Y');

    try {
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
        const response = Object.fromEntries(params.entries());

        if (response.ssl_result === '0') {
            return {
                success: true,
                transactionId: response.ssl_txn_id,
                approvalCode: response.ssl_approval_code,
                token: response.ssl_token || null,
                message: 'Payment processed successfully',
            };
        } else {
            throw createError({
                statusCode: 400,
                message: response.ssl_result_message || 'Payment declined',
            });
        }
    } catch (error: any) {
        console.error('Elavon payment error:', error);
        throw createError({
            statusCode: 500,
            message: error.message || 'Payment processing failed',
        });
    }
});