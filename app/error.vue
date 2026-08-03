<template>
  <div class="error-page">
    <Header v-if="showChrome" />

    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1>{{ is404 ? '404' : 'ERROR' }}</h1>
            <p class="breadcrumb">HOME / {{ is404 ? 'PAGE NOT FOUND' : 'SOMETHING WENT WRONG' }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="page-main-section container error-body">
      <h2>{{ is404 ? 'Page not found' : 'Something went wrong' }}</h2>
      <p>
        {{ is404
          ? "The page you’re looking for doesn’t exist or has been moved."
          : error?.message || 'An unexpected error occurred.' }}
      </p>
      <div class="actions">
        <NuxtLink to="/" class="btn-primary">Back to Home</NuxtLink>
        <button type="button" class="btn-primary btn-large" @click="handleClear">Try again</button>
      </div>
    </div>

    <Footer v-if="showChrome" />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const is404 = computed(() => props.error?.statusCode === 404)
const showChrome = computed(() => is404.value) // header/footer on 404 only

const handleClear = () => clearError({ redirect: '/' })

useHead({
  title: is404.value ? 'Page Not Found' : 'Error'
})
</script>

<style scoped>
.error-body {
  text-align: center;
  padding: 60px 20px 100px;
  max-width: 640px;
  margin: 0 auto;
}

.error-body h2 {
  color: #0c2340;
  font-size: 2rem;
  margin-bottom: 12px;
}

.error-body p {
  color: #64748b;
  margin-bottom: 28px;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: #F49322;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background: #0c2340;
}

.btn-secondary {
  background: #fff;
  color: #0c2340;
  border: 2px solid #0c2340;
  padding: 12px 26px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #0c2340;
  color: #fff;
}
</style>