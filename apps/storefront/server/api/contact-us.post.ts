import { defineEventHandler, readBody, createError } from "h3";

import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    // ---- Field validation ----
    if (!body.firstName || body.firstName.trim() === '') {
        return { success: false, error: 'First name is required' };
    }

    if (!body.lastName || body.lastName.trim() === '') {
        return { success: false, error: 'Last name is required' };
    }

    if (!body.email || body.email.trim() === '' || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(body.email)) {
        return { success: false, error: 'Valid email is required' };
    }

    if (!body.phone || body.phone.trim() === '') {
        return { success: false, error: 'Phone number is required' };
    }

    if (!body.message || body.message.trim() === '') {
        return { success: false, error: 'Message is required' };
    }

    if (!body.turnstileToken) {
        return { success: false, error: 'Security verification required' };
    }

    // ---- US phone validation ----
    // formatPhone caps at 10 digits, so we only need to check for exactly 10.
    const phoneDigits = body.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
        return { success: false, error: 'Please enter a valid US phone number' };
    }

    // ---- Turnstile ----
    try {
        const turnstileResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
            return { success: false, error: 'Security verification failed' };
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return { success: false, error: 'Security verification failed' };
    }

    // ---- Persist the contact form ----
    try {
        const supabase = getSupabase();

        const { data, error } = await supabase.rpc('handle_contact_form', {
            p_first_name: body.firstName.trim(),
            p_last_name: body.lastName.trim(),
            p_email: body.email.trim(),
            p_phone: body.phone.trim(),
            p_message: body.message.trim(),
        });

        if (error) {
            console.error('Supabase RPC error:', error);
            return { success: false, error: 'Failed to send message. Please try again.' };
        }

        // ---- Send SMS (best-effort; do not fail the form if it errors) ----
        const firstName = body.firstName.trim().replace(/[\r\n\t]/g, ' ').slice(0, 30);

        // Keep under 160 chars. Fall back to shorter copy for long names.
        const longVersion =
            `Hi ${firstName}, thanks for reaching out to Festive Express! ` +
            `A team member will review your message and get back to you within 24 hours. ` +
            `Talk soon!`;

        const smsMessage =
            longVersion.length <= 160
                ? longVersion
                : `Hi ${firstName}, thanks for contacting Festive Express! ` +
                `We'll reply within 24 hours. - The Festive Express Team`;

        const { data: smsResult, error: sendSmsError } = await supabase.rpc('send_ctm_sms', {
            to_number: phoneDigits,
            message_body: smsMessage,
        });

        if (sendSmsError) {
            console.error('[CTM send SMS] RPC error:', sendSmsError);
        } else if (!smsResult || smsResult.c >= 400) {
            console.error('[CTM send SMS] rejected:', smsResult);
        } else {
            console.log('[CTM send SMS] queued:', smsResult.request_id);
        }

        return data;
    } catch (error) {
        console.error('Error calling Supabase function:', error);
        return { success: false, error: 'Failed to send message. Please try again.' };
    }
});