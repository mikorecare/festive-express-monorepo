<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Edit FAQ</h1>
        <p class="text-slate-500 text-sm">
          Update question, answer, and settings
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition"
          @click="$router.back()"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60 transition"
          :disabled="isSaving"
          @click="saveFaq"
        >
          {{ isSaving ? "Updating..." : "Update FAQ" }}
        </button>
      </div>
    </div>

    <!-- Form -->
    <div
      class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 max-w-3xl space-y-5"
    >
      <div>
        <label class="block text-sm font-semibold text-navy mb-2">
          Category <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.category_id"
          class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
          :class="{ 'border-red-500': errors.category_id }"
        >
          <option :value="null">Select category</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
        <p v-if="errors.category_id" class="text-red-500 text-xs mt-1">
          {{ errors.category_id }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-navy mb-2">
          Question <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.question"
          type="text"
          class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
          :class="{ 'border-red-500': errors.question }"
          placeholder="e.g. What is Festive Express?"
        />
        <p v-if="errors.question" class="text-red-500 text-xs mt-1">
          {{ errors.question }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-navy mb-2">
          Answer <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.answer"
          rows="6"
          class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
          :class="{ 'border-red-500': errors.answer }"
          placeholder="Full answer text..."
        />
        <p v-if="errors.answer" class="text-red-500 text-xs mt-1">
          {{ errors.answer }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-navy mb-2"
            >Sort order</label
          >
          <input
            v-model.number="form.sort_order"
            type="number"
            min="0"
            class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
          />
        </div>
        <div class="flex items-end pb-2">
          <label
            class="flex items-center gap-2 cursor-pointer text-sm text-navy"
          >
            <input
              v-model="form.is_active"
              type="checkbox"
              class="w-auto rounded border-slate-300"
            />
            Active
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string;
  name: string;
}

interface FaqResponse {
  success: boolean;
  data: {
    id: string;
    category_id: string;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
  } | null;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

const route = useRoute();
const isSaving = ref(false);
const categories = ref<Category[]>([]);
const errors = ref<Record<string, string>>({});

const form = ref({
  category_id: null as string | null,
  question: "",
  answer: "",
  sort_order: 0,
  is_active: true,
});

const loadCategories = async () => {
  try {
    const response = await $fetch<CategoriesResponse>("/api/faq-categories");
    if (response.success) {
      categories.value = response.data || [];
    }
  } catch (error) {
    console.error("Failed to load categories:", error);
    categories.value = [];
  }
};

const loadFaq = async () => {
  try {
    const id = route.params.id as string;
    const response = await $fetch<FaqResponse>(`/api/faqs/${id}`);

    if (response.success && response.data) {
      const row = response.data;
      form.value = {
        category_id: row.category_id,
        question: row.question,
        answer: row.answer,
        sort_order: row.sort_order,
        is_active: row.is_active,
      };
    }
  } catch (error) {
    console.error("Failed to load FAQ:", error);
  }
};

const validate = () => {
  errors.value = {};
  if (!form.value.category_id)
    errors.value.category_id = "Category is required";
  if (!form.value.question.trim())
    errors.value.question = "Question is required";
  if (!form.value.answer.trim()) errors.value.answer = "Answer is required";
  return Object.keys(errors.value).length === 0;
};

const saveFaq = async () => {
  if (!validate()) return;
  isSaving.value = true;
  try {
    const id = route.params.id as string;
    const response = await $fetch<{ success: boolean }>(`/api/faqs/${id}`, {
      method: "PUT",
      body: {
        category_id: form.value.category_id,
        question: form.value.question.trim(),
        answer: form.value.answer.trim(),
        sort_order: form.value.sort_order || 0,
        is_active: form.value.is_active,
      },
    });

    if (!response.success) {
      throw new Error("Failed to update FAQ");
    }

    navigateTo("/admin/configuration/faq");
  } catch (e) {
    console.error(e);
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  await loadCategories();
  await loadFaq();
});
</script>
