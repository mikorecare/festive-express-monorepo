<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Tags</h1>
        <p class="text-slate-500 text-sm">Organize posts with reusable tags</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
        @click="openCreate"
      >
        <PlusIcon class="h-4 w-4" />
        Add Tag
      </button>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      <input
        v-model="search"
        type="text"
        class="field"
        placeholder="Search tags…"
      />
    </div>

    <!-- Table -->
    <div
      class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
        Loading tags…
      </div>

      <div v-else-if="filtered.length === 0" class="p-12 text-center">
        <TagIcon class="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-navy mb-1">No tags yet</h3>
        <p class="text-sm text-slate-500 mb-4">
          {{
            search
              ? "No tags match your search."
              : "Create your first tag to get started."
          }}
        </p>
        <button
          v-if="!search"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          @click="openCreate"
        >
          <PlusIcon class="h-4 w-4" />
          Add Tag
        </button>
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr class="text-left text-xs uppercase tracking-wide text-slate-500">
            <th class="px-6 py-3 font-semibold">Name</th>
            <th class="px-6 py-3 font-semibold">Slug</th>
            <th class="px-6 py-3 font-semibold w-40 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="tag in filtered"
            :key="tag.id"
            class="hover:bg-slate-50/60 transition-colors"
          >
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
              >
                #{{ tag.name }}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-600 font-mono text-xs">
              {{ tag.slug }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="inline-flex gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                  @click="openEdit(tag)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-medium hover:bg-rose-600"
                  @click="confirmDelete(tag)"
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
            <TagIcon class="h-5 w-5 text-brand-orange" />
          </div>
          <h3 class="text-lg font-bold text-navy">
            {{ editingTag ? "Edit Tag" : "Add Tag" }}
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
              placeholder="e.g. Travel Tips"
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
              placeholder="travel-tips"
            />
            <p class="text-xs text-slate-400 mt-1">URL-friendly identifier</p>
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
              {{ saving ? "Saving..." : editingTag ? "Update" : "Create" }}
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
          <h3 class="text-lg font-bold text-navy">Delete Tag</h3>
        </div>
        <p class="text-slate-600 text-sm mb-6">
          Delete <span class="font-semibold">"#{{ deleteTarget.name }}"</span>?
          It will be removed from all posts. This cannot be undone.
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
import { PlusIcon, TagIcon, TrashIcon } from "@heroicons/vue/24/outline";

type Tag = { id: number; name: string; slug: string };

const { showToast } = useToast();

const tags = ref<Tag[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const search = ref("");

const showFormModal = ref(false);
const editingTag = ref<Tag | null>(null);
const modalForm = ref({ name: "", slug: "" });
const slugTouched = ref(false);

const deleteTarget = ref<Tag | null>(null);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return tags.value;
  return tags.value.filter(
    (t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q),
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

const fetchTags = async () => {
  loading.value = true;
  try {
    const res = await $fetch<{ success: boolean; data: Tag[]; error?: string }>(
      "/api/blog/tags",
    );
    if (!res.success) throw new Error(res.error || "Failed to load tags");
    tags.value = res.data || [];
  } catch (e: any) {
    showToast(e?.message || "Failed to load tags", "error");
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  editingTag.value = null;
  modalForm.value = { name: "", slug: "" };
  slugTouched.value = false;
  showFormModal.value = true;
};

const openEdit = (tag: Tag) => {
  editingTag.value = tag;
  modalForm.value = { name: tag.name, slug: tag.slug };
  slugTouched.value = true;
  showFormModal.value = true;
};

const closeForm = () => {
  showFormModal.value = false;
  editingTag.value = null;
  modalForm.value = { name: "", slug: "" };
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
  };

  saving.value = true;
  try {
    const res = await $fetch<{
      success: boolean;
      data?: Tag;
      error?: string;
    }>(
      editingTag.value
        ? `/api/blog/tags/${editingTag.value.id}`
        : "/api/blog/tags",
      {
        method: editingTag.value ? "PUT" : "POST",
        body: payload,
      },
    );

    if (!res.success) throw new Error(res.error || "Save failed");

    if (editingTag.value && res.data) {
      const idx = tags.value.findIndex((t) => t.id === editingTag.value!.id);
      if (idx !== -1) tags.value[idx] = res.data;
      showToast("Tag updated", "success");
    } else if (res.data) {
      tags.value.push(res.data);
      showToast("Tag created", "success");
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

const confirmDelete = (tag: Tag) => {
  deleteTarget.value = tag;
};

const doDelete = async () => {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value.id;
  deleting.value = true;
  try {
    const res = await $fetch<{ success: boolean; error?: string }>(
      `/api/blog/tags/${id}`,
      { method: "DELETE" },
    );
    if (!res.success) throw new Error(res.error || "Delete failed");

    tags.value = tags.value.filter((t) => t.id !== id);
    deleteTarget.value = null;
    showToast("Tag deleted", "success");
  } catch (e: any) {
    showToast(e?.message || "Delete failed", "error");
  } finally {
    deleting.value = false;
  }
};

onMounted(fetchTags);
</script>
