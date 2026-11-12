<template>
  <div
    class="relative min-h-screen bg-transparent py-8 sm:py-12 lg:py-20 px-3 sm:px-6 overflow-hidden border-b-[18px] sm:border-b-[27px] border-[#F49321]"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-[url('/New/Faq/faq-bg.webp')] bg-cover bg-center bg-no-repeat"
      aria-hidden="true"
    ></div>

    <div class="absolute inset-0 bg-white/65" aria-hidden="true"></div>

    <!-- Content needs relative z-10 to sit above bg -->
    <div class="relative z-10">
      <h1
        class="font-poppins text-center font-extrabold text-[#F49321] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] sm:leading-[1] lg:leading-[0.85] tracking-tight [text-shadow:_-1.5px_-1.5px_0_#fff,_1.5px_-1.5px_0_#fff,_-1.5px_1.5px_0_#fff,_1.5px_1.5px_0_#fff,_0_3px_8px_rgba(28,45,91,0.35)] lg:[text-shadow:_-3px_-3px_0_#fff,_3px_-3px_0_#fff,_-3px_3px_0_#fff,_3px_3px_0_#fff,_0_5px_12px_rgba(28,45,91,0.45)] mb-6 sm:mb-10 lg:mb-12 px-2"
      >
        Holiday Lighting Questions
      </h1>

      <div class="max-w-[1280px] mx-auto">
        <!-- Loading -->
        <div
          v-if="loading"
          role="status"
          aria-live="polite"
          class="text-center text-gray-500 py-16"
        >
          Loading FAQs…
        </div>

        <!-- Error -->
        <div
          v-else-if="errorMessage"
          role="alert"
          class="text-center text-red-500 py-16"
        >
          {{ errorMessage }}
        </div>

        <!-- List -->
        <FaqList v-else :categories="categories" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryWithFaqs } from "~/components/Faq/FaqList.vue";

const {
  data,
  pending: loading,
  error: fetchError,
} = await useFetch<{
  success: boolean;
  categories: CategoryWithFaqs[];
}>("/api/faqs");

const categories = computed(() => data.value?.categories || []);
const errorMessage = computed(() =>
  fetchError.value ? "Failed to load FAQs" : null,
);
</script>
