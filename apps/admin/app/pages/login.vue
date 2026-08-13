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
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
      // email: email.value,
      // password: password.value
    })

    if (authError) {
      error.value = authError.message
      return
    }

    navigateTo('/admin')
  } catch (err: any) {
    error.value = err.message || 'An unexpected error occurred during login'
  } finally {
    isLoading.value = false
  }
}
</script>