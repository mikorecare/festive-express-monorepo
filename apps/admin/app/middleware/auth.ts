// export default defineNuxtRouteMiddleware((to) => {
//   const token = useCookie('auth_token')

//   if (!token.value && to.path.startsWith('/admin')) {
//     return navigateTo('/login')
//   }
// })

// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  // Read both old token and new Azure session cookies
  const token = useCookie('auth_token')
  const adminSession = useCookie('admin_session')

  // Check if either valid session exists
  const isAuthenticated = Boolean(token.value || adminSession.value)

  // Redirect to login if user is unauthenticated and trying to access /admin
  if (!isAuthenticated && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})