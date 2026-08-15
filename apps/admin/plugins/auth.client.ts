export default defineNuxtPlugin(() => {
    const router = useRouter()

    router.beforeEach(async (to) => {
        const publicRoutes = ['/login', '/confirm', '/forgot-password']
        if (publicRoutes.includes(to.path)) {
            return
        }

        const supabase = useSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return navigateTo('/login')
        }
    })
})