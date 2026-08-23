import { createClient } from '@supabase/supabase-js';

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

    const supabaseUrl = config.public.supabaseUrl;
    const supabaseServiceKey = config.supabaseServiceKey;

    if (!supabaseServiceKey) {
        throw createError({
            statusCode: 500,
            message: 'Server configuration error',
        });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // Find review with this token
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
            .single();

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

        return {
            success: true,
            review: {
                id: review.id,
                order_number: review.order_number,
                customer_name: review.customer_name,
                email: review.customer_email,
            },
            expires_at: review.token_expires_at,
        };

    } catch (error: any) {
        console.error('Survey validation error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to validate survey',
        });
    }
});