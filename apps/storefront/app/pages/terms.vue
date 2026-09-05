<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1><span class="text-brand-orange">Terms</span> and Conditions</h1>
            <!-- Show placeholder if loading, otherwise show data -->
            <p class="breadcrumb">
              {{ pending ? "Loading..." : data?.data?.subtitle || "" }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="max-w-[860px] mx-auto pt-10 pb-20 text-navy leading-relaxed">
        <!-- Handle Error State -->
        <div v-if="error" class="text-red-500">
          Failed to load terms and conditions.
        </div>

        <!-- Handle Data State -->
        <div
          v-else-if="data?.data?.description"
          class="prose max-w-none text-navy"
          v-html="data.data.description"
        />
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
    return t ? `${t}` : "Terms and Conditions";
  }),
});
</script>
