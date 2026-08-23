import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    const {
        token,
        rating_overall,
        rating_installation,
        rating_technicians,
        comments_installation,
        comments_technicians,
        comments_additional,
        would_recommend
    } = body;

    if (!token) {
        throw createError({
            statusCode: 400,
            message: 'Survey token is required',
        });
    }

    if (!rating_overall || rating_overall < 1 || rating_overall > 5) {
        throw createError({
            statusCode: 400,
            message: 'Please provide a valid overall rating (1-5)',
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
        const { data: review, error: reviewError } = await supabase
            .from('reviews')
            .select('id, status, token_expires_at, order_id')
            .eq('survey_token', token)
            .single();

        if (reviewError || !review) {
            throw createError({
                statusCode: 404,
                message: 'Invalid survey token',
            });
        }

        if (review.status === 'completed') {
            throw createError({
                statusCode: 400,
                message: 'You have already completed this survey. Thank you!',
            });
        }

        const now = new Date();
        if (now > new Date(review.token_expires_at)) {
            await supabase
                .from('reviews')
                .update({ status: 'expired' })
                .eq('id', review.id);

            throw createError({
                statusCode: 410,
                message: 'This survey has expired. The link was valid for 72 hours.',
            });
        }

        const { error: updateError } = await supabase
            .from('reviews')
            .update({
                rating_overall: rating_overall,
                rating_installation: rating_installation || null,
                rating_technicians: rating_technicians || null,
                comments_installation: comments_installation || null,
                comments_technicians: comments_technicians || null,
                comments_additional: comments_additional || null,
                would_recommend: would_recommend || null,
                status: 'completed',
                completed_at: new Date().toISOString(),
            })
            .eq('id', review.id);

        if (updateError) {
            throw updateError;
        }

        await supabase
            .from('order_timeline')
            .insert({
                order_id: review.order_id,
                status: 'survey_completed',
                notes: `Survey completed with rating ${rating_overall}/5`,
            });

        return {
            success: true,
            message: 'Thank you for your valuable feedback! 🎄',
        };

    } catch (error: any) {
        console.error('Survey submission error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to submit survey',
        });
    }
});