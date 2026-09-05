<template>
  <div class="faq-page min-h-screen bg-[#f8fafc]">
    <section class="page-hero snow-bg relative">
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
      <div v-if="loading" class="text-center text-gray-500 py-16">
        Loading FAQs…
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-16">
        {{ error }}
      </div>

      <div v-else class="space-y-10">
        <section v-for="cat in categories" :key="cat.id">
          <h2
            class="text-2xl font-bold text-[#1C2D5B] mb-4 border-b-2 border-[#F49321] pb-2"
          >
            {{ cat.name }}
          </h2>

          <div class="space-y-2">
            <div
              v-for="faq in cat.faqs"
              :key="faq.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                type="button"
                class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[#1C2D5B] hover:bg-orange-50 transition"
                @click="toggle(faq.id)"
              >
                <span>{{ faq.question }}</span>
                <i
                  class="fas fa-chevron-down text-[#F49321] transition-transform"
                  :class="{ 'rotate-180': openId === faq.id }"
                />
              </button>
              <div
                v-show="openId === faq.id"
                class="px-5 pb-5 text-navy leading-relaxed whitespace-pre-line border-t border-gray-50"
              >
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="mt-14 text-center bg-white rounded-2xl p-8 shadow-sm">
        <p class="text-navy mb-2">Still have questions?</p>
        <a
          :href="`tel:${phoneHref}`"
          class="text-xl font-bold text-[#F49321] hover:text-[#1C2D5B]"
        >
          {{ supportPhone }}
        </a>
        <p class="text-sm text-navy mt-2">
          or email
          <a :href="`mailto:${supportEmail}`" class="hover:text-[#F49321]">
            {{ supportEmail }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "FAQ - Festive Express" });

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

const categories = ref<CategoryWithFaqs[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const openId = ref<number | null>(null);

const supportPhone = ref("");
const supportEmail = ref("");
const phoneHref = ref("");

const toggle = (id: number) => {
  openId.value = openId.value === id ? null : id;
};

const loadFaqs = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch<{
      success: boolean;
      categories: CategoryWithFaqs[];
      settings: Settings;
    }>("/api/faqs");

    if (response.success) {
      categories.value = response.categories || [];
      supportPhone.value = response.settings.contact_phone_display || "";
      phoneHref.value = response.settings.contact_phone || "";
      supportEmail.value = response.settings.contact_email || "";
    } else {
      throw new Error("Failed to load FAQs");
    }
  } catch (e) {
    console.error("Failed to load FAQs:", e);
    error.value = e instanceof Error ? e.message : "An error occurred";
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadFaqs);
</script>
