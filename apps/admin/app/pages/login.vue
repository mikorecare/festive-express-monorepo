<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark p-4">
    <div class="max-w-md w-full">
      <div class="bg-white p-10 sm:p-12 rounded-2xl shadow-2xl text-center border border-slate-100">
        <h1 class="text-navy text-3xl font-bold mb-2">Admin Login</h1>
        <p class="text-slate-500 mb-8 font-medium">Welcome back to FLP Express</p>

        <form @submit.prevent="login" class="space-y-6 text-left">
          <div>
            <label class="block text-slate-700 font-semibold mb-2 text-sm">Email Address</label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="Enter your email" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
            >
          </div>

          <div>
            <label class="block text-slate-700 font-semibold mb-2 text-sm">Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="Enter password" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
            >
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>

          <!-- <a 
            href="/api/auth/azure" 
            class="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#2f2f2f] hover:bg-black text-white font-medium rounded-lg transition-colors no-underline"
          >
            <svg class="w-5 h-5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            Sign in with Microsoft
          </a> -->

          <!-- Divider -->
          <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase">Or continue with</span>
            <div class="flex-grow border-t border-slate-200"></div>
          </div>
          <NuxtLink 
            href="/api/auth/azure/azure" 
            external
            class="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#2f2f2f] hover:bg-black text-white font-medium rounded-lg transition-colors no-underline"
          >
            <svg class="w-5 h-5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H1z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H1z"/>
            </svg>
            Sign in with Microsoft
          </NuxtLink>

        </form>

        <div v-if="error" class="mt-4 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

const supabase = useSupabaseClient()

const form = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')


const login = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
      // email: email.value,
      // password: password.value
    })

    if (authError) {
      error.value = authError.message
      return
    }

    // Set the auth token cookie so your middleware recognizes the user
    if (data.session) {
      const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/'
      })
      token.value = data.session.access_token
    }

    navigateTo('/admin')
  } catch (err: any) {
    error.value = err.message || 'An unexpected error occurred during login'
  } finally {
    isLoading.value = false
  }
}
</script>