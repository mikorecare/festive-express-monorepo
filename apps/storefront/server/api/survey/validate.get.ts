
import { serverSupabaseClient } from '#supabase/server'

type ReviewValidation = {
    id: string
    order_number: string
    customer_name: string
    customer_email: string
    status: 'pending' | 'completed' | 'expired'
    token_expires_at: string
}

type ValidationResponse = {
    success: boolean
    review: {
        id: string
        order_number: string
        customer_name: string
        email: string
    }
    expires_at: string
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const token = query.token as string;

    if (!token) {
        throw createError({
            statusCode: 400,
            message: 'Survey token is required',
        });
    }

    const supabase = await serverSupabaseClient<any>(event);

    try {
        const { data: review, error } = await supabase
            .from('reviews')
            .select(`
                id,
                order_number,
                customer_name,
                customer_email,
                status,
                token_expires_at
            `)
            .eq('survey_token', token)
            .single<ReviewValidation>();

        if (error || !review) {
            throw createError({
                statusCode: 404,
                message: 'Invalid survey link. Please check your email.',
            });
        }

        // Check if already completed
        if (review.status === 'completed') {
            throw createError({
                statusCode: 400,
                message: 'You have already completed this survey. Thank you!',
            });
        }

        // Check if expired
        if (review.status === 'expired') {
            throw createError({
                statusCode: 410,
                message: 'This survey has expired. The link was valid for 72 hours.',
            });
        }

        // Check token expiration
        const now = new Date();
        const expiresAt = new Date(review.token_expires_at);

        if (now > expiresAt) {
            // Update status to expired
            await supabase
                .from('reviews')
                .update({ status: 'expired' })
                .eq('id', review.id);

            throw createError({
                statusCode: 410,
                message: 'This survey has expired. The link was valid for 72 hours.',
            });
        }

        const response: ValidationResponse = {
            success: true,
            review: {
                id: review.id,
                order_number: review.order_number,
                customer_name: review.customer_name,
                email: review.customer_email,
            },
            expires_at: review.token_expires_at,
        };

        return response;

    } catch (error: any) {
        console.error('Survey validation error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to validate survey',
        });
    }
});