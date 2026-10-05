<template>
  <div
    class="faq-page min-h-screen bg-[#f8fafc] bg-[url('/Images/LV.webp')] bg-no-repeat bg-cover bg-[position:50%] bg-fixed"
  >
    <section
      aria-label="FAQ page header"
      role="region"
      class="page-hero snow-bg relative"
    >
      <div class="hero-overlay">
        <div class="container mx-auto max-w-[1280px] px-5 py-14 text-center">
          <h1 class="text-3xl md:text-4xl text-white">
            <span class="text-brand-orange">Frequently Asked</span> Questions
          </h1>
          <p class="mt-2 text-white/90 max-w-xl mx-auto">
            Everything you need to know about Festive Express<br />and our
            holiday lighting packages.
          </p>
        </div>
      </div>
    </section>

    <div class="container mx-auto max-w-[900px] px-5 py-12">
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

      <!-- FAQ List + Contact Form -->
      <div
        class="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:flex lg:gap-10 lg:items-start"
      >
        <!-- Left: FAQ list (60%) -->
        <div class="w-full lg:w-[60%] lg:flex-shrink-0">
          <FaqList v-if="categories" :categories="categories" />
          <div v-else class="text-center py-10 text-gray-500">
            Loading FAQs...
          </div>
        </div>

        <!-- Right: Contact form (40%) -->
        <div
          v-fade
          class="w-full lg:w-[40%] lg:flex-shrink-0 mt-10 lg:mt-0 lg:sticky lg:top-24"
        >
          <ContactUsContactForm />
        </div>
      </div>

      <!-- Contact -->
      <div
        class="mt-14 text-center bg-white rounded-2xl p-8 shadow-sm"
        role="complementary"
        aria-label="Contact support"
      >
        <p class="text-navy mb-2">Still have questions?</p>
        <a
          :href="`tel:${phoneHref}`"
          class="text-xl font-bold text-[#F49321] hover:text-[#1C2D5B] transition-colors"
          :aria-label="`Call us at ${supportPhone}`"
        >
          {{ supportPhone }}
        </a>
        <p class="text-sm text-navy mt-2">
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
