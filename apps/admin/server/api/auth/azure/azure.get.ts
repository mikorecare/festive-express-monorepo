export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  const tenantId = (config.azureTenantId as string) || 'common'
  const clientId = config.azureClientId as string
  const redirectUri = encodeURIComponent((config.azureRedirectUri as string) || '')

  // Request basic profile and email scopes
  const scope = encodeURIComponent('openid profile email')

  const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${redirectUri}` +
    `&response_mode=query` +
    `&scope=${scope}`

  return sendRedirect(event, authUrl)
})