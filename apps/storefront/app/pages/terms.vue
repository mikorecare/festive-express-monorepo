<template>
  <div>
    <section
      aria-label="Terms and conditions page header"
      role="region"
      class="page-hero snow-bg"
    >
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1><span class="text-brand-orange">Terms</span> and Conditions</h1>
            <p class="text-white/80 max-w-2xl mx-auto mt-2">
              {{ pending ? "Loading..." : data?.data?.subtitle || "" }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div
      v-if="pending"
      role="status"
      aria-live="polite"
      class="text-center text-gray-500 py-16"
    >
      Loading terms and conditions...
    </div>

    <!-- Error State -->
    <div v-else-if="error" role="alert" class="text-center text-red-500 py-16">
      Failed to load terms and conditions.
    </div>

    <!-- Content -->
    <div v-else class="container">
      <div class="max-w-[860px] mx-auto pt-10 pb-20 text-navy leading-relaxed">
        <div
          v-if="data?.data?.description"
          class="prose prose-slate max-w-none prose-headings:text-[#1C2D5B] prose-headings:font-bold prose-h2:border-b-2 prose-h2:border-[#F49321] prose-h2:pb-2 prose-h2:mt-6 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-[#F49321] prose-a:no-underline hover:prose-a:text-[#1C2D5B] prose-strong:text-[#1C2D5B] prose-li:text-slate-600 prose-blockquote:border-l-4 prose-blockquote:border-[#F49321] prose-blockquote:pl-4 prose-blockquote:my-4 prose-blockquote:text-slate-600 prose-blockquote:italic"
          v-html="data.data.description"
        />
        <p v-else class="text-center text-gray-500 py-16">
          Terms and conditions content is currently unavailable.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type TermsContent = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ApiResponse = {
  success: boolean;
  data: TermsContent | null;
};

const { data, pending, error } =
  await useFetch<ApiResponse>("/api/terms-of-use");

useHead({
  title: computed(() => {
    const t = data.value?.data?.title?.trim();
    return t ? `${t}` : "Terms and Conditions - Festive Express";
  }),
  meta: [
    {
      name: "description",
      content:
        "Terms and conditions for Festive Express holiday lighting services.",
    },
  ],
});
</script>
