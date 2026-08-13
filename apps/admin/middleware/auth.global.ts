// apps/admin/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/confirm', '/forgot-password']

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(to.path)

  // 1. Redirect unauthenticated users to /login if trying to access a protected page
  if (!user.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  // 2. Redirect already logged-in users away from /login to dashboard
  if (user.value && isPublicRoute) {
    return navigateTo('/')
  }
})