<template>
  <div
    class="relative min-h-screen bg-transparent py-8 sm:py-12 lg:py-20 px-4 sm:px-6 overflow-hidden border-b-[27px] border-[#F49321]"
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
        class="font-poppins text-center font-extrabold text-[#F49321] text-2xl sm:text-4xl lg:text-[60px] leading-[1.1] sm:leading-[0.9] lg:leading-[0.77] tracking-tight [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)] mb-6 sm:mb-10 lg:mb-12"
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

useHead({
  title: "FAQ - Festive Express",
  meta: [
    {
      name: "description",
      content:
        "Frequently asked questions about Festive Express holiday lighting packages and services.",
    },
  ],
});

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
