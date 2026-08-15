import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  const code = query.code as string
  const error = query.error as string

  if (error) {
    return sendRedirect(event, `/login?error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return sendRedirect(event, '/login?error=no_code')
  }

  try {
    const tokenResponse = await $fetch<any>(
      `https://login.microsoftonline.com/${config.azureTenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: config.azureClientId as string,
          client_secret: config.azureClientSecret as string,
          code: code,
          redirect_uri: config.azureRedirectUri as string,
          grant_type: 'authorization_code',
        }),
      }
    )

    const supabase = createClient(
      config.public.supabaseUrl as string,
      config.public.supabaseKey as string
    )

    const { data: authData, error: signInError } = await supabase.auth.signInWithIdToken({
      provider: 'azure',
      token: tokenResponse.id_token,
      access_token: tokenResponse.access_token,
    })

    if (signInError) {
      console.error('Sign in error:', signInError)
      return sendRedirect(event, `/login?error=${encodeURIComponent(signInError.message)}`)
    }

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return sendRedirect(event, '/login?error=no_session')
    }

    setCookie(event, 'sb-access-token', session.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/'
    })

    setCookie(event, 'sb-refresh-token', session.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    })

    setCookie(event, 'sb-auth', 'true', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/'
    })

    try {
      const supabaseAdmin = createClient(
        config.public.supabaseUrl as string,
        config.supabaseServiceKey as string
      )

      const userProfile = await $fetch<any>('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      })

      const email = userProfile.mail || userProfile.userPrincipalName || authData.user.email
      const displayName = userProfile.displayName || ''

      const { data: existing } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (!existing) {
        await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: email,
            display_name: displayName,
            role: 'manager',
            is_active: true,
            created_at: new Date().toISOString()
          })
      }
    } catch (profileError) {
      console.error('Profile error:', profileError)
    }

    return sendRedirect(event, '/admin')

  } catch (error: any) {
    console.error('Callback error:', error)
    return sendRedirect(event, `/login?error=${encodeURIComponent(error.message || 'Authentication failed')}`)
  }
})