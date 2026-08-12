<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h1>Admin Login</h1>
        <p>Welcome back to FLP Express</p>

        <form @submit.prevent="login">
          <div class="form-group">
            <label>Username</label>
            <input v-model="form.username" type="text" placeholder="Enter username" required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input v-model="form.password" type="password" placeholder="Enter password" required>
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

definePageMeta({
  layout: 'guest'
})

const form = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

const login = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response: any = await $fetch('/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: form.value
    })

    console.log('LOGIN RESPONSE:', response)

    if (!response?.token) {
      error.value = 'Login succeeded but no token returned'
      return
    }

    // Cookie (for useCookie)
    const tokenCookie = useCookie('auth_token', {
      path: '/',
      sameSite: 'lax'
    })
    tokenCookie.value = response.token

    // Backup in localStorage (for create.vue / authHeaders)
    localStorage.setItem('token', response.token)

    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user))
    }

    navigateTo('/admin')
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid username or password'
  } finally {
    isLoading.value = false
  }
}

</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0c2340, #1a3558);
}

.login-container {
  max-width: 420px;
  width: 100%;
}

.login-box {
  background: white;
  padding: 48px 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.25);
  text-align: center;
}

h1 {
  color: #0c2340;
  margin-bottom: 8px;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 24px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.15);
}

.login-btn {
  width: 100%;
  background: #F49322;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn:hover {
  background: #e07f1c;
}

.error-message {
  color: #ef4444;
  margin-top: 16px;
  font-size: 0.95rem;
}
</style>