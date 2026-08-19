<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-navy">FAQs</h1>
        <p class="text-slate-500 text-sm">Manage FAQ categories and questions</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <NuxtLink
          to="/admin/configuration/faq/categories"
          class="px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition no-underline"
        >
          Categories
        </NuxtLink>
        <NuxtLink
          to="/admin/configuration/faq/create"
          class="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition no-underline"
        >
          + Add FAQ
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search questions..."
        class="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
      >
      <select
        v-model="categoryFilter"
        class="sm:w-56 border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
      >
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-navy text-white">
            <th class="p-4 text-sm font-semibold">Question</th>
            <th class="p-4 text-sm font-semibold">Category</th>
            <th class="p-4 text-sm font-semibold">Order</th>
            <th class="p-4 text-sm font-semibold">Status</th>
            <th class="p-4 text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(faq, i) in filteredFaqs"
            :key="faq.id"
            class="border-b border-slate-100"
            :class="i % 2 === 0 ? 'bg-slate-50' : 'bg-white'"
          >
            <td class="p-4 font-medium text-navy max-w-md">
              {{ faq.question }}
            </td>
            <td class="p-4 text-slate-600 text-sm">
              {{ faq.category?.name || '—' }}
            </td>
            <td class="p-4 text-slate-600 text-sm">{{ faq.sort_order }}</td>
            <td class="p-4">
              <span
                class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="
                  faq.is_active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                "
              >
                {{ faq.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-navy hover:bg-slate-200 transition"
                  @click="editFaq(faq.id)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  @click="confirmDelete(faq)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!filteredFaqs.length" class="p-12 text-center text-slate-400 text-sm">
        {{ faqs.length ? 'No FAQs match your search.' : 'No FAQs yet. Add your first question.' }}
      </div>
    </div>

    <!-- Delete modal (same as before) -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h3 class="text-lg font-bold text-navy mb-2">Delete FAQ?</h3>
        <p class="text-slate-600 text-sm mb-6">{{ faqToDelete?.question }}</p>
        <div class="flex gap-3 justify-end">
          <button
            type="button"
            class="px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition"
            @click="showModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            @click="executeDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FaqCategory {
  id: string
  name: string
}

interface Faq {
  id: string
  question: string
  answer: string
  sort_order: number
  is_active: boolean
  category_id?: string
  category?: FaqCategory
}

const supabase = useSupabaseClient()
const faqs = ref<Faq[]>([])
const categories = ref<FaqCategory[]>([])
const searchTerm = ref('')
const categoryFilter = ref('')
const showModal = ref(false)
const faqToDelete = ref<Faq | null>(null)

const filteredFaqs = computed(() => {
  const q = searchTerm.value.trim().toLowerCase()
  const catId = categoryFilter.value

  return faqs.value.filter((faq) => {
    const matchSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      (faq.answer || '').toLowerCase().includes(q)

    const matchCategory =
      !catId ||
      faq.category?.id === catId ||
      faq.category_id === catId

    return matchSearch && matchCategory
  })
})

const loadFaqs = async () => {
  const { data, error } = await supabase
    .from('faqs')
    .select(`
      id, question, answer, sort_order, is_active, category_id,
      category:faq_categories ( id, name )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error(error)
    faqs.value = []
    return
  }
  faqs.value = (data as unknown as Faq[]) || []
}

const loadCategories = async () => {
  const { data } = await supabase
    .from('faq_categories')
    .select('id, name')
    .order('sort_order', { ascending: true })
  categories.value = (data as FaqCategory[]) || []
}

const editFaq = (id: string) =>
  navigateTo(`/admin/configuration/faq/edit/${id}`)

const confirmDelete = (faq: Faq) => {
  faqToDelete.value = faq
  showModal.value = true
}

const executeDelete = async () => {
  if (!faqToDelete.value) return
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', faqToDelete.value.id)

  if (error) {
    console.error(error)
    return
  }
  showModal.value = false
  faqToDelete.value = null
  await loadFaqs()
}

onMounted(async () => {
  await Promise.all([loadFaqs(), loadCategories()])
})
</script>