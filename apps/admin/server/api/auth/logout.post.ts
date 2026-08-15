import { setCookie } from 'h3'

export default defineEventHandler((event) => {
    const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax' as const,
        maxAge: 0,
        expires: new Date(0)
    }

    setCookie(event, 'sb-access-token', '', cookieOptions)
    setCookie(event, 'sb-refresh-token', '', cookieOptions)
    deleteCookie(event, 'sb-auth', { path: '/' })

    return { success: true }
})
