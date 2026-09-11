<template>
  <div class="faq-page min-h-screen bg-[#f8fafc]">
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
      <!-- Loading State -->
      <div
        v-if="loading"
        role="status"
        aria-live="polite"
        class="text-center text-gray-500 py-16"
      >
        Loading FAQs…
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        role="alert"
        class="text-center text-red-500 py-16"
      >
        {{ error }}
      </div>

      <!-- FAQ Content -->
      <div v-else class="space-y-10">
        <section
          v-for="cat in categories"
          :key="cat.id"
          :aria-label="`${cat.name} frequently asked questions`"
          role="region"
        >
          <h2
            class="text-2xl font-bold text-[#1C2D5B] mb-4 border-b-2 border-[#F49321] pb-2"
          >
            {{ cat.name }}
          </h2>

          <div class="space-y-2" role="list">
            <div
              v-for="faq in cat.faqs"
              :key="faq.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              role="listitem"
            >
              <button
                type="button"
                class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[#1C2D5B] hover:bg-orange-50 transition"
                :aria-expanded="openId === faq.id"
                :aria-controls="`faq-answer-${faq.id}`"
                :id="`faq-question-${faq.id}`"
                @click="toggle(faq.id)"
              >
                <span>{{ faq.question }}</span>
                <i
                  class="fas fa-chevron-down text-[#F49321] transition-transform duration-300"
                  :class="{ 'rotate-180': openId === faq.id }"
                  aria-hidden="true"
                />
              </button>

              <!-- Smooth Collapse/Expand -->
              <div
                :id="`faq-answer-${faq.id}`"
                role="region"
                :aria-labelledby="`faq-question-${faq.id}`"
                class="faq-answer-wrapper"
                :class="{ 'is-open': openId === faq.id }"
              >
                <div
                  class="faq-answer-inner px-5 py-2 text-navy leading-relaxed whitespace-pre-line border-t border-gray-50"
                >
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Still have questions? Section -->
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

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

interface CategoryWithFaqs {
  id: number;
  name: string;
  sort_order: number;
  faqs: FaqItem[];
}

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
const error = computed(() => (fetchError.value ? "Failed to load FAQs" : null));

const openId = ref<number | null>(null);

const toggle = (id: number) => {
  openId.value = openId.value === id ? null : id;
};
</script>

<style scoped>
button:focus-visible {
  outline: 2px solid #f49321;
  outline-offset: 2px;
}

/* Smooth FAQ Answer Animation */
.faq-answer-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-in-out;
}

.faq-answer-wrapper.is-open {
  grid-template-rows: 1fr;
}

.faq-answer-inner {
  overflow: hidden;
}

.faq-answer-wrapper:not(.is-open) .faq-answer-inner {
  opacity: 0;
  transform: translateY(-8px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.faq-answer-wrapper.is-open .faq-answer-inner {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.3s ease 0.05s,
    transform 0.3s ease 0.05s;
}
</style>
