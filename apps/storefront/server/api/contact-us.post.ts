import { defineEventHandler, readBody, createError } from "h3";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    if (!body.firstName || body.firstName.trim() === '') {
        return {
            success: false,
            error: 'First name is required'
        };
    }

    if (!body.lastName || body.lastName.trim() === '') {
        return {
            success: false,
            error: 'Last name is required'
        };
    }

    if (!body.email || body.email.trim() === '' || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(body.email)) {
        return {
            success: false,
            error: 'Valid email is required'
        };
    }

    if (!body.phone || body.phone.trim() === '') {
        return {
            success: false,
            error: 'Phone number is required'
        };
    }

    if (!body.message || body.message.trim() === '') {
        return {
            success: false,
            error: 'Message is required'
        };
    }

    if (!body.turnstileToken) {
        return {
            success: false,
            error: 'Security verification required'
        };
    }

    try {
        const turnstileResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    secret: config.turnstile?.secretKey || process.env.NUXT_TURNSTILE_SECRET_KEY || "",
                    response: body.turnstileToken,
                    remoteip: event.node.req.socket.remoteAddress || '',
                }),
            }
        );

        const turnstileResult = await turnstileResponse.json();

        if (!turnstileResult.success) {
            console.warn('Turnstile verification failed:', turnstileResult);
            return {
                success: false,
                error: 'Security verification failed'
            };
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return {
            success: false,
            error: 'Security verification failed'
        };
    }

    try {
        const supabaseUrl = config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = config.supabaseServiceKey || process.env.NUXT_SUPABASE_SECRET_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase configuration missing');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase.rpc('handle_contact_form', {
            p_first_name: body.firstName.trim(),
            p_last_name: body.lastName.trim(),
            p_email: body.email.trim(),
            p_phone: body.phone.trim(),
            p_message: body.message.trim()
        });

        if (error) {
            console.error('Supabase RPC error:', error);
            return {
                success: false,
                error: 'Failed to send message. Please try again.'
            };
        }

        return data;
    } catch (error) {
        console.error('Error calling Supabase function:', error);
        return {
            success: false,
            error: 'Failed to send message. Please try again.'
        };
    }
});