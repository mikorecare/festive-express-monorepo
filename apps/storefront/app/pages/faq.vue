<template>
  <div
    class="faq-page min-h-screen bg-[#f8fafc] bg-[url('/Images/LV.webp')] bg-no-repeat bg-cover bg-[position:50%] bg-fixed"
  >
    <section
      aria-label="FAQ page header"
      role="region"
      class="page-hero snow-bg relative bg-slate-900 py-8 sm:py-14 text-white overflow-hidden min-h-[240px] sm:min-h-[320px]"
    >
      <!-- Background image -->
      <NuxtImg
        src="/Images/Banner/Page-Hero-Cover.webp"
        alt=""
        role="none"
        sizes="100vw"
        format="webp"
        quality="80"
        :img-attrs="{
          loading: 'eager',
          fetchpriority: 'high',
          decoding: 'async',
        }"
        preload
        class="absolute inset-0 w-full h-full object-cover z-0"
      />

      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-black/40 z-[1]" aria-hidden="true"></div>

      <!-- Content -->
      <div
        class="relative z-10 container mx-auto max-w-[1280px] px-4 sm:px-5 py-8 sm:py-14 text-center"
      >
        <h1
          class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
        >
          <span
            class="text-brand-orange [-webkit-text-stroke:0.04em_#fff] [paint-order:stroke_fill] drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          >
            Frequently Asked
          </span>
          <span
            class="text-white [-webkit-text-stroke:0.04em_#1C2D5B] [paint-order:stroke_fill] drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          >
            Questions
          </span>
        </h1>

        <p
          class="mt-2 text-sm sm:text-base text-white/95 max-w-xl mx-auto [text-shadow:_0_2px_8px_rgba(0,0,0,0.75)]"
        >
          Everything you need to know about Festive Express<br />and our holiday
          lighting packages.
        </p>
      </div>
    </section>

    <div class="container mx-auto max-w-[900px] px-4 sm:px-5 py-6 sm:py-12">
      <!-- Loading -->
      <div
        v-if="loading"
        role="status"
        aria-live="polite"
        class="text-center text-gray-500 py-12 sm:py-16"
      >
        Loading FAQs…
      </div>

      <!-- Error -->
      <div
        v-else-if="errorMessage"
        role="alert"
        class="text-center text-red-500 py-12 sm:py-16"
      >
        {{ errorMessage }}
      </div>

      <!-- FAQ List + Contact Form -->
      <div
        class="w-full max-w-[1280px] mx-auto lg:flex lg:gap-10 lg:items-start"
      >
        <!-- Left: FAQ list (60%) -->
        <div class="w-full lg:w-[60%] lg:flex-shrink-0">
          <FaqList v-if="categories" :categories="categories" />
          <div v-else class="text-center py-8 text-gray-500">
            Loading FAQs...
          </div>
        </div>

        <!-- Right: Contact form (40%) -->
        <div
          v-fade
          class="w-full lg:w-[40%] lg:flex-shrink-0 mt-6 sm:mt-8 lg:mt-0 lg:sticky lg:top-24"
        >
          <ContactUsContactForm />
        </div>
      </div>

      <!-- Contact -->
      <div
        class="mt-8 sm:mt-14 text-center bg-white rounded-2xl p-5 sm:p-8 shadow-sm"
        role="complementary"
        aria-label="Contact support"
      >
        <p class="text-navy mb-2 text-sm sm:text-base">Still have questions?</p>
        <a
          :href="`tel:${phoneHref}`"
          class="text-lg sm:text-xl font-bold text-[#F49321] hover:text-[#1C2D5B] transition-colors"
          :aria-label="`Call us at ${supportPhone}`"
        >
          {{ supportPhone }}
        </a>
        <p class="text-xs sm:text-sm text-navy mt-2">
          or email
          <a
            :href="`mailto:${supportEmail}`"
            class="hover:text-[#F49321] transition-colors"
            :aria-label="`Email us at ${supportEmail}`"
          >
            {{ supportEmail }}
          </a>
        </p>
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

interface Settings {
  contact_phone_display: string;
  contact_phone: string;
  contact_email: string;
}

const {
  data: faqResponse,
  pending: loading,
  error: fetchError,
} = useFetch<{
  success: boolean;
  categories: CategoryWithFaqs[];
  settings: Settings;
}>("/api/faqs");

const categories = computed(() => faqResponse.value?.categories || []);
const supportPhone = computed(
  () => faqResponse.value?.settings?.contact_phone_display || "",
);
const phoneHref = computed(
  () => faqResponse.value?.settings?.contact_phone || "",
);
const supportEmail = computed(
  () => faqResponse.value?.settings?.contact_email || "",
);
const errorMessage = computed(() =>
  fetchError.value ? "Failed to load FAQs" : null,
);
</script>
