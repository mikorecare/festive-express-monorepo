// /server/api/auth/login.post.ts
import { getSupabase } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { email, password, turnstileToken } = body;
        const config = useRuntimeConfig()

        if (!email || !password) {
            throw createError({
                statusCode: 400,
                message: 'Email and password are required'
            });
        }

        if (!turnstileToken) {
            throw createError({
                statusCode: 400,
                message: 'Security verification required'
            });
        }

        const turnstileSecret = config.turnstileSecretKey;
        if (!turnstileSecret) {
            console.error('Turnstile secret key not configured');
            throw createError({
                statusCode: 500,
                message: 'Security configuration error'
            });
        }

        const turnstileVerifyResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    secret: turnstileSecret,
                    response: turnstileToken,
                }),
            }
        );

        const turnstileData = await turnstileVerifyResponse.json();

        if (!turnstileData.success) {
            console.error('Turnstile verification failed:', turnstileData);
            throw createError({
                statusCode: 400,
                message: 'Security verification failed. Please try again.'
            });
        }

        const supabase = getSupabase();

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.error('Auth error:', authError);
            throw createError({
                statusCode: 401,
                message: authError.message || 'Invalid email or password'
            });
        }

        if (!data.session) {
            throw createError({
                statusCode: 401,
                message: 'Failed to create session'
            });
        }

        console.log('User logged in:', data.user.email);

        // Set cookies with proper settings for development
        const isProduction = process.env.NODE_ENV === 'production';

        setCookie(event, 'sb-access-token', data.session.access_token, {
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/',
            httpOnly: true,
            secure: isProduction, // Only secure in production
            sameSite: 'lax',
            domain: undefined, // Use current domain
        });

        setCookie(event, 'sb-refresh-token', data.session.refresh_token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            domain: undefined,
        });

        // This cookie is readable by the client to check if logged in
        setCookie(event, 'sb-auth', 'true', {
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/',
            httpOnly: false, // Allow client to read this
            secure: isProduction,
            sameSite: 'lax',
            domain: undefined,
        });

        // Also set a cookie for the user ID (optional, for client-side use)
        setCookie(event, 'sb-user-id', data.user.id, {
            maxAge: 60 * 60 * 8,
            path: '/',
            httpOnly: false,
            secure: isProduction,
            sameSite: 'lax',
            domain: undefined,
        });

        return {
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                role: data.user.role,
            },
            message: 'Login successful'
        };

    } catch (error: any) {
        console.error('Login error:', error);

        if (error.statusCode) {
            throw error;
        }

        return {
            success: false,
            message: error.message || 'An unexpected error occurred during login'
        };
    }
});