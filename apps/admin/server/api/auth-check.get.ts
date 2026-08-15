import { getCookie } from 'h3'

export default defineEventHandler((event) => {
    const accessToken = getCookie(event, 'sb-access-token')
    const refreshToken = getCookie(event, 'sb-refresh-token')

    return {
        isAuthenticated: !!accessToken && !!refreshToken
    }
})
