<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1><span class="text-brand-orange">Privacy</span> Policy</h1>
            {{ data?.subtitle || "" }}
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div
        class="max-w-[860px] mx-auto pt-10 pb-20 text-slate-700 leading-relaxed"
      >
        <div
          v-if="data?.description"
          class="privacy-body prose max-w-none text-navy"
          v-html="data.description"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Privacy Policy" });

type PrivacyContent = {
  id?: string;
  banner_image_url?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

const data = ref<PrivacyContent | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const loadPrivacyPolicy = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch<{
      success: boolean;
      data: PrivacyContent | null;
    }>("/api/privacy-policy");

    if (response.success) {
      data.value = response.data;
    } else {
      throw new Error("Failed to load privacy policy");
    }
  } catch (e) {
    console.error("Failed to load privacy policy:", e);
    error.value = e instanceof Error ? e.message : "An error occurred";
    data.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(loadPrivacyPolicy);
</script>
