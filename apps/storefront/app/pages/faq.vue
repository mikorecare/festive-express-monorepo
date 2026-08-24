<template>
  <div class="faq-page min-h-screen bg-[#f8fafc]">
    <section class="page-hero snow-bg relative">
      <div class="hero-overlay">
        <div class="container mx-auto max-w-[1280px] px-5 py-14 text-center">
          <h1 class="text-3xl md:text-4xl font-bold uppercase text-white">
            <span class="text-brand-orange">Frequently Asked</span> questions
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

      <div v-else class="space-y-10">
        <section v-for="cat in categories" :key="cat.id">
          <h2
            class="text-2xl font-bold text-[#0c2340] mb-4 border-b-2 border-[#F49322] pb-2"
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
                class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[#0c2340] hover:bg-orange-50 transition"
                @click="toggle(faq.id)"
              >
                <span>{{ faq.question }}</span>
                <i
                  class="fas fa-chevron-down text-[#F49322] transition-transform"
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
          class="text-xl font-bold text-[#F49322] hover:text-[#0c2340]"
        >
          {{ supportPhone }}
        </a>
        <p class="text-sm text-navy mt-2">
          or email
          <a :href="`mailto:${supportEmail}`" class="hover:text-[#F49322]">
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
}

interface CategoryWithFaqs {
  id: number;
  name: string;
  sort_order: number;
  faqs: FaqItem[];
}

const supabase = useSupabaseClient();
const categories = ref<CategoryWithFaqs[]>([]);
const loading = ref(true);
const openId = ref<number | null>(null);

const toggle = (id: number) => {
  openId.value = openId.value === id ? null : id;
};

const supportPhone = ref("");
const supportEmail = ref("");
const phoneHref = ref("");

const loadSettings = async () => {
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["contact_phone_display", "contact_phone", "contact_email"]);

  if (!data?.length) return;

  const map = Object.fromEntries(
    data.map((r: { key: string; value: string }) => [r.key, r.value]),
  );

  if (map.contact_phone_display) {
    supportPhone.value = map.contact_phone_display;
  }
  if (map.contact_phone) {
    phoneHref.value = map.contact_phone;
  }
  if (map.contact_email) {
    supportEmail.value = map.contact_email;
  }
};

onMounted(async () => {
  const { data, error } = await supabase
    .from("faq_categories")
    .select(
      `
      id, name, sort_order,
      faqs ( id, question, answer, sort_order, is_active )
    `,
    )
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error(error);
    loading.value = false;
    return;
  }

  categories.value = ((data as any[]) || []).map((cat) => ({
    ...cat,
    faqs: (cat.faqs || [])
      .filter((f: any) => f.is_active)
      .sort((a: any, b: any) => a.sort_order - b.sort_order),
  }));

  loading.value = false;

  await Promise.all([, /* loadFaqs... */ loadSettings()]);
});
</script>
