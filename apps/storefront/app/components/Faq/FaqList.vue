<template>
  <div class="space-y-10">
    <section
      v-for="cat in categories"
      :key="cat.id"
      v-fade
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
            :aria-expanded="isOpen(faq.id)"
            :aria-controls="`faq-answer-${faq.id}`"
            :id="`faq-question-${faq.id}`"
            @click="toggle(faq.id)"
          >
            <span>{{ faq.question }}</span>
            <i
              class="fas fa-chevron-down text-[#F49321] transition-transform duration-300"
              :class="{ 'rotate-180': isOpen(faq.id) }"
              aria-hidden="true"
            />
          </button>

          <div
            :id="`faq-answer-${faq.id}`"
            role="region"
            :aria-labelledby="`faq-question-${faq.id}`"
            class="faq-answer-wrapper"
            :class="{ 'is-open': isOpen(faq.id) }"
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
</template>

<script setup lang="ts">
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export interface CategoryWithFaqs {
  id: number;
  name: string;
  sort_order: number;
  faqs: FaqItem[];
}

const props = withDefaults(
  defineProps<{
    categories: CategoryWithFaqs[];
    allowMultipleOpen?: boolean;
  }>(),
  {
    allowMultipleOpen: false,
  },
);

const openId = ref<number | null>(null);
const openIds = ref<Set<number>>(new Set());

const isOpen = (id: number) =>
  props.allowMultipleOpen ? openIds.value.has(id) : openId.value === id;

const toggle = (id: number) => {
  if (props.allowMultipleOpen) {
    if (openIds.value.has(id)) {
      openIds.value.delete(id);
    } else {
      openIds.value.add(id);
    }
    openIds.value = new Set(openIds.value);
  } else {
    openId.value = openId.value === id ? null : id;
  }
};
</script>

<style scoped>
button:focus-visible {
  outline: 2px solid #f49321;
  outline-offset: 2px;
}

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
