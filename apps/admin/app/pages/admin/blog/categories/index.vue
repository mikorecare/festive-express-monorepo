<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Categories</h1>
        <p class="text-slate-500 text-sm">Group posts into broader topics</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
        @click="openCreate"
      >
        <PlusIcon class="h-4 w-4" />
        Add Category
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <input
        v-model="search"
        type="text"
        class="field"
        placeholder="Search categories…"
      />
    </div>

    <!-- Table -->
    <div
      class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
        Loading categories…
      </div>

      <div v-else-if="filtered.length === 0" class="p-12 text-center">
        <FolderIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-navy mb-1">No categories yet</h3>
        <p class="text-sm text-slate-500 mb-4">
          {{
            search
              ? "No categories match your search."
              : "Create your first category to get started."
          }}
        </p>
        <button
          v-if="!search"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          @click="openCreate"
        >
          <PlusIcon class="h-4 w-4" />
          Add Category
        </button>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr class="text-left text-xs uppercase tracking-wide text-slate-500">
            <th class="px-6 py-3 font-semibold">Name</th>
            <th class="px-6 py-3 font-semibold">Slug</th>
            <th class="px-6 py-3 font-semibold">Description</th>
            <th class="px-6 py-3 font-semibold w-40 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="cat in filtered"
            :key="cat.id"
            class="hover:bg-slate-50/60 transition-colors"
          >
            <td class="px-6 py-4">
              <span class="font-semibold text-navy">{{ cat.name }}</span>
            </td>
            <td class="px-6 py-4 text-slate-600 font-mono text-xs">
              {{ cat.slug }}
            </td>
            <td class="px-6 py-4 text-slate-500 max-w-md">
              <span class="line-clamp-1">
                {{ cat.description || "—" }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="inline-flex gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                  @click="openEdit(cat)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-medium hover:bg-rose-600"
                  @click="confirmDelete(cat)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeForm"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center gap-3 mb-5">
          <div
            class="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center"
          >
            <FolderIcon class="h-5 w-5 text-brand-orange" />
          </div>
          <h3 class="text-lg font-bold text-navy">
            {{ editingCategory ? "Edit Category" : "Add Category" }}
          </h3>
        </div>

        <form class="space-y-4" @submit.prevent="submitForm">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Name <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="modalForm.name"
              type="text"
              required
              class="field"
              placeholder="e.g. Travel Guides"
              @input="onNameInput"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Slug <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="modalForm.slug"
              type="text"
              required
              class="field font-mono text-sm"
              placeholder="travel-guides"
            />
            <p class="text-xs text-slate-400 mt-1">URL-friendly identifier</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              v-model="modalForm.description"
              rows="3"
              class="field"
              placeholder="Optional short description…"
            />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="closeForm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-60"
              :disabled="saving"
            >
              {{ saving ? "Saving..." : editingCategory ? "Update" : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="deleteTarget = null"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center"
          >
            <TrashIcon class="h-5 w-5 text-rose-600" />
          </div>
          <h3 class="text-lg font-bold text-navy">Delete Category</h3>
        </div>
        <p class="text-slate-600 text-sm mb-6">
          Delete
          <span class="font-semibold">"{{ deleteTarget.name }}"</span>? Posts
          using this category will become uncategorized. This cannot be undone.
        </p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            @click="deleteTarget = null"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-60"
            :disabled="deleting"
            @click="doDelete"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, FolderIcon, TrashIcon } from "@heroicons/vue/24/outline";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

const { showToast } = useToast();

const categories = ref<Category[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const search = ref("");

const showFormModal = ref(false);
const editingCategory = ref<Category | null>(null);
const modalForm = ref({ name: "", slug: "", description: "" });
const slugTouched = ref(false);

const deleteTarget = ref<Category | null>(null);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return categories.value;
  return categories.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q),
  );
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const onNameInput = () => {
  if (!slugTouched.value) {
    modalForm.value.slug = slugify(modalForm.value.name);
  }
};

const fetchCategories = async () => {
  loading.value = true;
  try {
    const res = await $fetch<{
      success: boolean;
      data: Category[];
      error?: string;
    }>("/api/blog/categories");
    if (!res.success) throw new Error(res.error || "Failed to load categories");
    categories.value = res.data || [];
  } catch (e: any) {
    showToast(e?.message || "Failed to load categories", "error");
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  editingCategory.value = null;
  modalForm.value = { name: "", slug: "", description: "" };
  slugTouched.value = false;
  showFormModal.value = true;
};

const openEdit = (cat: Category) => {
  editingCategory.value = cat;
  modalForm.value = {
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
  };
  slugTouched.value = true;
  showFormModal.value = true;
};

const closeForm = () => {
  showFormModal.value = false;
  editingCategory.value = null;
  modalForm.value = { name: "", slug: "", description: "" };
  slugTouched.value = false;
};

const submitForm = async () => {
  if (!modalForm.value.name.trim()) {
    showToast("Name is required", "error");
    return;
  }
  if (!modalForm.value.slug.trim()) {
    showToast("Slug is required", "error");
    return;
  }

  const payload = {
    name: modalForm.value.name.trim(),
    slug: modalForm.value.slug.trim(),
    description: modalForm.value.description.trim() || null,
  };

  saving.value = true;
  try {
    const res = await $fetch<{
      success: boolean;
      data?: Category;
      error?: string;
    }>(
      editingCategory.value
        ? `/api/blog/categories/${editingCategory.value.id}`
        : "/api/blog/categories",
      {
        method: editingCategory.value ? "PUT" : "POST",
        body: payload,
      },
    );

    if (!res.success) throw new Error(res.error || "Save failed");

    if (editingCategory.value && res.data) {
      const idx = categories.value.findIndex(
        (c) => c.id === editingCategory.value!.id,
      );
      if (idx !== -1) categories.value[idx] = res.data;
      showToast("Category updated", "success");
    } else if (res.data) {
      categories.value.push(res.data);
      showToast("Category created", "success");
    }

    closeForm();
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (msg.includes("duplicate key") || msg.includes("unique")) {
      showToast("Name or slug already exists", "error");
    } else {
      showToast(msg || "Save failed", "error");
    }
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (cat: Category) => {
  deleteTarget.value = cat;
};

const doDelete = async () => {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value.id;
  deleting.value = true;
  try {
    const res = await $fetch<{ success: boolean; error?: string }>(
      `/api/blog/categories/${id}`,
      { method: "DELETE" },
    );
    if (!res.success) throw new Error(res.error || "Delete failed");

    categories.value = categories.value.filter((c) => c.id !== id);
    deleteTarget.value = null;
    showToast("Category deleted", "success");
  } catch (e: any) {
    showToast(e?.message || "Delete failed", "error");
  } finally {
    deleting.value = false;
  }
};

onMounted(fetchCategories);
</script>
