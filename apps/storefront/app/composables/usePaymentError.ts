export const usePaymentError = () => {
    const handlePaymentError = (error: any, context: string) => {
        const errorMessages: Record<string, string> = {
            'Invalid card number': 'Please check your card number and try again.',
            'Invalid expiry date': 'Please check your expiry date and try again.',
            'Invalid CVV': 'Please check your CVV and try again.',
            'Card declined': 'Your card was declined. Please try a different card.',
            'Insufficient funds': 'Insufficient funds. Please try a different card.',
            'Invalid amount': 'Invalid payment amount. Please try again.',
            'Missing credentials': 'Payment system configuration error. Please contact support.',
            'Empty response': 'Payment gateway did not respond. Please try again.',
            'No session token': 'Failed to initialize payment. Please try again.',
            'Failed to load Checkout.js': 'Payment system failed to load. Please refresh and try again.',
        };

        const errorCode = error?.errorCode || error?.ssl_result || error?.code;
        const errorMessage = error?.error || error?.message || error?.ssl_result_message || '';

        let userMessage = 'Payment failed. Please try again.';

        for (const [key, msg] of Object.entries(errorMessages)) {
            if (errorMessage.includes(key) || errorCode === key) {
                userMessage = msg;
                break;
            }
        }

        if (errorCode === '1') {
            userMessage = 'CVV verification failed. Please check your CVV and try again.';
        } else if (errorCode === '2') {
            userMessage = 'Address verification failed. Please check your billing address.';
        } else if (errorCode === '3') {
            userMessage = 'Your card was declined. Please try a different card.';
        }

        return {
            userMessage,
            errorCode,
            originalError: error
        };
    };

    return {
        handlePaymentError
    };
};