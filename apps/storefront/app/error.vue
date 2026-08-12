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

    <!-- Error Body -->
    <div class="container max-w-[640px] text-center px-5 py-5 pt-15 pb-25 mx-auto">
      <h2 class="text-navy text-3xl font-bold mb-3">
        {{ is404 ? 'Page not found' : 'Something went wrong' }}
      </h2>
      <p class="text-slate-500 mb-7 leading-relaxed">
        {{ is404
          ? "The page you’re looking for doesn’t exist or has been moved."
          : error?.message || 'An unexpected error occurred.' }}
      </p>
      
      <!-- Actions -->
      <div class="flex justify-center flex-wrap gap-3">
        <NuxtLink 
          to="/" 
          class="bg-brand-orange hover:bg-navy text-white px-7 py-3.5 rounded-lg font-semibold inline-block transition-colors duration-200"
        >
          Back to Home
        </NuxtLink>
        <button 
          type="button" 
          class="bg-brand-orange hover:bg-navy text-white px-7 py-3.5 rounded-lg font-semibold cursor-pointer transition-colors duration-200"
          @click="handleClear"
        >
          Try again
        </button>
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