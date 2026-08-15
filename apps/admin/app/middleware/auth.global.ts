export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/login', '/confirm', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(to.path)

  let isAuthenticated = false

  if (import.meta.server) {
    const accessToken = useCookie('sb-access-token').value
    const refreshToken = useCookie('sb-refresh-token').value
    isAuthenticated = !!accessToken && !!refreshToken
  } else {
    try {
      const data = await $fetch('/api/auth-check')
      isAuthenticated = data.isAuthenticated
    } catch {
      isAuthenticated = false
    }
  }

  if (!isAuthenticated && !isPublicRoute) {
    return navigateTo('/login')
  }

  if (isAuthenticated && isPublicRoute) {
    return navigateTo('/admin')
  }
})
