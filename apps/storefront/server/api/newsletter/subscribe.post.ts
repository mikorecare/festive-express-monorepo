import { getSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { email, firstName, lastName, turnstileToken } = body
        const config = useRuntimeConfig()

        // 1. Validate Basic Fields
        if (!email || !email.includes('@')) {
            throw new Error('Please provide a valid email address.')
        }
        if (!firstName || !lastName) {
            throw new Error('First name and last name are required.')
        }

        // 2. Validate Turnstile Token Presence
        if (!turnstileToken) {
            throw new Error('Security verification required.')
        }

        // 3. Verify Turnstile with Cloudflare
        const turnstileSecret = config.turnstile?.secretKey || process.env.NUXT_TURNSTILE_SECRET_KEY
        if (!turnstileSecret) {
            console.error('Turnstile secret key not configured')
            throw new Error('Security configuration error')
        }

        const turnstileResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    secret: turnstileSecret,
                    response: turnstileToken,
                    remoteip: event.node.req.socket.remoteAddress || '',
                }),
            }
        )

        const turnstileResult = await turnstileResponse.json()

        if (!turnstileResult.success) {
            console.warn('Turnstile verification failed:', turnstileResult)
            throw new Error('Security verification failed. Please try again.')
        }

        // 4. Verify passed — Run the RPC
        const admin = getSupabase()

        const { data, error } = await admin.rpc('subscribe_newsletter', {
            p_email: email,
            p_first_name: firstName,
            p_last_name: lastName
        })

        if (error) {
            console.error("❌ Supabase RPC Error:", error)
            throw new Error(error.message || 'Database error')
        }

        return data

    } catch (error: any) {
        console.error("❌ Newsletter API Error:", error.message)
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to subscribe',
        }
    }
})