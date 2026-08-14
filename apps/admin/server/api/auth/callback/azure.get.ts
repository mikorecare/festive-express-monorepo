export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  const code = query.code as string
  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Authorization code missing' })
  }

  try {
    const tokenUrl = `https://login.microsoftonline.com/${config.azureTenantId as string}/oauth2/v2.0/token`
    
    // Explicitly cast runtimeConfig keys as strings
    const bodyParams = new URLSearchParams({
      client_id: (config.azureClientId as string) || '',
      client_secret: (config.azureClientSecret as string) || '',
      code: code,
      redirect_uri: (config.azureRedirectUri as string) || '',
      grant_type: 'authorization_code',
    })

    const tokenResponse = await $fetch<any>(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams.toString(),
    })

    const userProfile = await $fetch<any>('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    })

    const sessionData = {
      id: userProfile.id,
      name: userProfile.displayName,
      email: userProfile.mail || userProfile.userPrincipalName,
      accessToken: tokenResponse.access_token,
    }

    setCookie(event, 'admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return sendRedirect(event, '/admin')

  } catch (error: any) {
    // console.error('Azure Login Error:', error)
    // return sendRedirect(event, '/login?error=azure_login_failed')

    // Extract Microsoft's exact response error or falling back to the error message
    const errorDescription = error?.data?.error_description || error?.data?.error || error?.message || 'unknown_error'
    
    console.error('--- AZURE OAUTH ERROR ---', error?.data || error)

    // Pass the raw error to the URL query string
    return sendRedirect(event, `/login?error=${encodeURIComponent(errorDescription)}`)
  }
})