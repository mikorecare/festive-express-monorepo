<template>
  <div
    class="faq-page min-h-screen bg-[#f8fafc] bg-[url('/Images/LV.webp')] bg-no-repeat bg-cover bg-[position:50%] bg-fixed"
  >
    <section
      aria-label="FAQ page header"
      role="region"
      class="relative py-10 sm:py-16 text-white overflow-hidden min-h-[320px] sm:min-h-[400px]"
    >
      <!-- Same image and classes as Checkout -->
      <img
        src="/New/Banner/checkout.webp"
        alt="FAQ background"
        width="1920"
        height="800"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover z-10"
      />

      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-black/40 z-[11]" aria-hidden="true"></div>

      <!-- Content matching Checkout layout -->
      <div
        class="relative z-[12] container mx-auto px-3 sm:px-4 flex items-center justify-center min-h-[320px] sm:min-h-[400px]"
      >
        <div class="hero-content text-center max-w-2xl mx-auto">
          <h1
            v-fade
            class="text-[1.25rem] sm:text-3xl md:text-5xl leading-tight font-extrabold tracking-wider mb-3 sm:mb-4 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          >
            <span
              class="text-outline text-brand-orange [--o:#fff] [--w:2px] md:[--w:3px]"
              >Frequently Asked&nbsp;</span
            ><span
              class="text-outline text-[#1C2D5B] [--o:#fff] [--w:2px] md:[--w:3px]"
              >Questions</span
            >
          </h1>
          <p
            v-fade
            class="text-outline text-base sm:text-xl md:text-2xl tracking-wide font-bold text-[#1c2d5b] [--o:#fff] [--w:1.5px] md:[--w:2px] [text-wrap:balance] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          >
            Everything you need to know about Festive Express and our holiday
            lighting packages.
          </p>
        </div>
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
