<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-navy">FAQ Categories</h1>
        <p class="text-slate-500 text-sm">Sections shown on the storefront FAQ page</p>
      </div>
      <NuxtLink
        to="/admin/configuration/faq"
        class="px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition no-underline"
      >
        ← Back to FAQs
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: form -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 class="text-lg font-bold text-navy mb-5">
            {{ editingId ? 'Edit Category' : 'Add Category' }}
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-navy mb-2">
                Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                :class="{ 'border-red-500': errors.name }"
                placeholder="e.g. About Festive Express"
                @input="onNameInput"
              >
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-navy mb-2">
                Slug <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.slug"
                type="text"
                class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                :class="{ 'border-red-500': errors.slug }"
                placeholder="about-festive-express"
              >
              <p v-if="errors.slug" class="text-red-500 text-xs mt-1">{{ errors.slug }}</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-navy mb-2">Sort order</label>
              <input
                v-model.number="form.sort_order"
                type="number"
                min="0"
                class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              >
            </div>

            <label class="flex items-center gap-2 cursor-pointer text-sm text-navy">
              <input v-model="form.is_active" type="checkbox" class="w-auto rounded border-slate-300">
              Active
            </label>

            <div class="flex gap-3 pt-2">
              <button
                type="button"
                class="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60 transition"
                :disabled="isSaving"
                @click="saveCategory"
              >
                {{ isSaving ? 'Saving...' : (editingId ? 'Update' : 'Add Category') }}
              </button>
              <button
                v-if="editingId"
                type="button"
                class="px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                @click="cancelEdit"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: list -->
      <div class="lg:col-span-7">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100">
            <h3 class="font-bold text-navy text-sm">
              Existing Categories ({{ categories.length }})
            </h3>
          </div>

          <div v-if="!categories.length" class="p-10 text-center text-slate-400 text-sm">
            No categories yet.
          </div>

          <div
            v-for="(cat, index) in categories"
            :key="cat.id"
            class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100"
            :class="index % 2 === 0 ? 'bg-slate-50' : 'bg-white'"
          >
            <div class="min-w-0">
              <strong class="text-navy text-sm">{{ cat.name }}</strong>
              <small class="block text-slate-400 text-xs">
                /{{ cat.slug }} · order {{ cat.sort_order }}
              </small>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="
                  cat.is_active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                "
              >
                {{ cat.is_active ? 'Active' : 'Inactive' }}
              </span>
              <button
                type="button"
                class="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-navy hover:bg-slate-200 transition"
                @click="editCategory(cat)"
              >
                Edit
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                @click="confirmDelete(cat)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h3 class="text-lg font-bold text-navy mb-2">Delete category?</h3>
        <p class="text-slate-600 text-sm mb-1">{{ catToDelete?.name }}</p>
        <p class="text-sm text-red-500 mb-6">
          All FAQs in this category will be deleted (cascade).
        </p>
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
  slug: string
  sort_order: number
  is_active: boolean
}

const supabase = useSupabaseClient()
const categories = ref<FaqCategory[]>([])
const isSaving = ref(false)
const editingId = ref<string | null>(null)
const errors = ref<Record<string, string>>({})
const showModal = ref(false)
const catToDelete = ref<FaqCategory | null>(null)

const form = ref({
  name: '',
  slug: '',
  sort_order: 0,
  is_active: true,
})

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const onNameInput = () => {
  if (!editingId.value) {
    form.value.slug = generateSlug(form.value.name)
  }
}

const nextSortOrder = () => {
  if (!categories.value.length) return 1
  const max = Math.max(...categories.value.map((c) => Number(c.sort_order) || 0))
  return max + 1
}

const loadCategories = async () => {
  const { data, error } = await supabase
    .from('faq_categories')
    .select('id, name, slug, sort_order, is_active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error(error)
    categories.value = []
    return
  }
  categories.value = (data as FaqCategory[]) || []

  // Only auto-fill when creating (not editing)
  if (!editingId.value) {
    form.value.sort_order = nextSortOrder()
  }
}

const validate = () => {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Name is required'
  if (!form.value.slug.trim()) errors.value.slug = 'Slug is required'
  return Object.keys(errors.value).length === 0
}

const saveCategory = async () => {
  if (!validate()) return
  isSaving.value = true

  const payload = {
    name: form.value.name.trim(),
    slug: form.value.slug.trim(),
    sort_order: form.value.sort_order || 0,
    is_active: form.value.is_active,
    updated_at: new Date().toISOString(),
  }

  try {
    if (editingId.value) {
      const { error } = await supabase
        .from('faq_categories')
        .update(payload as never)
        .eq('id', editingId.value)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('faq_categories')
        .insert(payload as never)
      if (error) throw error
    }
    cancelEdit()
    await loadCategories()
  } catch (e) {
    console.error(e)
  } finally {
    isSaving.value = false
  }
}

const editCategory = (cat: FaqCategory) => {
  editingId.value = cat.id
  form.value = {
    name: cat.name,
    slug: cat.slug,
    sort_order: cat.sort_order,
    is_active: cat.is_active,
  }
  errors.value = {}
}

const cancelEdit = () => {
  editingId.value = null
  form.value = { name: '', slug: '', sort_order: nextSortOrder(), is_active: true }
  errors.value = {}
}

const confirmDelete = (cat: FaqCategory) => {
  catToDelete.value = cat
  showModal.value = true
}

const executeDelete = async () => {
  if (!catToDelete.value) return
  const id = catToDelete.value.id

  const { error } = await supabase
    .from('faq_categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    return
  }

  showModal.value = false
  catToDelete.value = null
  if (editingId.value === id) cancelEdit()
  await loadCategories()
}

onMounted(loadCategories)
</script>