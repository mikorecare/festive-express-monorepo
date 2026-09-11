<template>
  <div>
    <section
      aria-label="Cookie policy page header"
      role="region"
      class="page-hero snow-bg"
    >
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1>
              <span class="text-brand-orange">{{
                data?.title || "Cookie"
              }}</span>
              Policy
            </h1>
            <p
              v-if="data?.subtitle"
              class="text-white/80 max-w-2xl mx-auto mt-2"
            >
              {{ data?.subtitle }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div
      v-if="loading"
      role="status"
      aria-live="polite"
      class="text-center text-gray-500 py-16"
    >
      Loading cookie policy...
    </div>

    <!-- Error State -->
    <div v-else-if="error" role="alert" class="text-center text-red-500 py-16">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else class="container">
      <div
        class="max-w-[860px] mx-auto pt-10 pb-20 text-slate-700 leading-relaxed"
      >
        <div
          v-if="data?.description"
          class="prose prose-slate max-w-none prose-headings:text-[#1C2D5B] prose-headings:font-bold prose-h2:border-b-2 prose-h2:border-[#F49321] prose-h2:pb-2 prose-h2:mt-6 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-[#F49321] prose-a:no-underline hover:prose-a:text-[#1C2D5B] prose-strong:text-[#1C2D5B] prose-li:text-slate-600 prose-blockquote:border-l-4 prose-blockquote:border-[#F49321] prose-blockquote:pl-4 prose-blockquote:my-4 prose-blockquote:text-slate-600 prose-blockquote:italic"
          v-html="data.description"
        />
        <p v-else class="text-center text-gray-500 py-16">
          Cookie policy content is currently unavailable.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Cookie Policy - Festive Express",
  meta: [
    {
      name: "description",
      content:
        "Cookie policy for Festive Express holiday lighting services. Learn how we use cookies to improve your experience.",
    },
  ],
});

type CookieContent = {
  id?: string;
  banner_image_url?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

const {
  data: response,
  pending: loading,
  error: fetchError,
} = useFetch<{
  success: boolean;
  data: CookieContent | null;
}>("/api/cookie-policy");

const data = computed(() => response.value?.data ?? null);
const error = computed(() => (fetchError.value ? "An error occurred" : null));
</script>
