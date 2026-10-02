<template>
  <div class="min-h-screen bg-white py-8 sm:py-12 lg:py-20 px-4 sm:px-6">
    <h1
      class="font-poppins text-center font-extrabold text-[#1C2F5B] text-2xl sm:text-4xl lg:text-[60px] leading-[1.1] sm:leading-[0.9] lg:leading-[0.77] tracking-tight [text-shadow:_0_4px_4px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 lg:mb-12"
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
