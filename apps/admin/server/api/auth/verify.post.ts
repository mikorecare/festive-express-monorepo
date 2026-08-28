export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { token } = body

    if (!token) {
        return {
            success: false,
            message: 'Missing Turnstile token'
        }
    }

    const config = useRuntimeConfig()

    try {
        const response = await $fetch<{ success: boolean }>('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: new URLSearchParams({
                secret: config.turnstileSecretKey,
                response: token,
            }),
        })

        return {
            success: response.success === true,
            message: response.success ? 'Verified' : 'Verification failed'
        }
    } catch (error) {
        return {
            success: false,
            message: 'Verification service error'
        }
    }
})