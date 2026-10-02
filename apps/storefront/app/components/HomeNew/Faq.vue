<template>
  <div class="min-h-screen bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
    <h1
      class="text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2D5B] mb-8 sm:mb-10 lg:mb-12"
    >
      Frequently Asked Questions
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
        v-else-if="error"
        role="alert"
        class="text-center text-red-500 py-16"
      >
        {{ error }}
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
const error = computed(() => (fetchError.value ? "Failed to load FAQs" : null));
</script>
