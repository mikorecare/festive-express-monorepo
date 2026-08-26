<template>
  <div class="admin-page">
    <main class="admin-main2">
      <div class="page-header">
        <h1>Categories Management</h1>
        <NuxtLink to="/admin/products" class="back-btn"
          >← Back to Products</NuxtLink
        >
      </div>

      <div class="content-grid">
        <!-- Left: Add New Category -->
        <div class="add-form">
          <h3>{{ editingCategory ? "Edit Category" : "Add New Category" }}</h3>
          <form @submit.prevent="createCategory">
            <div class="form-section mt-4">
              <label class="form-label"
                >Category Name <span class="required">*</span></label
              >
              <input
                v-model="newCategory.name"
                type="text"
                placeholder="e.g. Patriotic"
                required
                @input="generateSlug"
              />
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Slug</label>
              <input
                v-model="newCategory.slug"
                type="text"
                placeholder="patriotic"
              />
            </div>

            <div class="form-section mt-4">
              <label class="form-label">Description</label>
              <textarea
                v-model="newCategory.description"
                rows="4"
                placeholder="Category description..."
              ></textarea>
            </div>

            <div class="form-actions mt-4">
              <button type="button" class="btn-secondary" @click="cancelEdit">
                Cancel
              </button>
              <button type="submit" class="btn-primary" :disabled="isSaving">
                {{
                  isSaving
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"
                }}
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Categories List -->
        <div class="categories-list">
          <h3>Existing Categories ({{ totalCategories }})</h3>

          <div
            v-for="(category, index) in paginatedCategories"
            :key="category.id"
            class="category-item"
            :class="{ 'even-row': index % 2 === 0 }"
          >
            <div class="category-info">
              <strong>{{ category.name }}</strong>
              <small class="slug">/{{ category.slug }}</small>
              <p v-if="category.description" class="description">
                {{ category.description }}
              </p>
            </div>
            <div class="category-actions">
              <button @click="editCategory(category)" class="btn-edit mr-2">
                Edit
              </button>
              <button @click="deleteCategory(category.id)" class="btn-delete">
                Delete
              </button>
            </div>
          </div>
          <!-- Pagination -->
          <div class="pagination">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="page-btn"
            >
              Previous
            </button>
            <span class="page-info">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="page-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { showToast } = useToast();

const categories = ref<
  Array<{
    id: number;
    name: string;
    slug?: string;
    description?: string;
  }>
>([]);
const newCategory = ref({
  id: null as number | null,
  name: "",
  slug: "",
  description: "",
});
const editingCategory = ref(null);
const isSaving = ref(false);

const currentPage = ref(1);
const itemsPerPage = 5;

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return categories.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(categories.value.length / itemsPerPage),
);
const totalCategories = computed(() => categories.value.length);

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const loadCategories = async () => {
  try {
    const res: any = await $fetch("/categories", {
      baseURL: config.public.apiBase,
    });
    categories.value = res.data || res || [];
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
};

const generateSlug = () => {
  newCategory.value.slug = newCategory.value.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

const createCategory = async () => {
  if (!newCategory.value.name.trim()) return;

  isSaving.value = true;

  try {
    if (editingCategory.value) {
      await $fetch(`/categories/${newCategory.value.id}`, {
        baseURL: config.public.apiBase,
        method: "PUT",
        body: newCategory.value,
      });
      showToast("✅ Category updated successfully!", "success");
    } else {
      await $fetch("/categories", {
        baseURL: config.public.apiBase,
        method: "POST",
        body: newCategory.value,
      });
      showToast("✅ Category created successfully!", "success");
    }
    // newCategory.value = { name: '', slug: '', description: '' }
    loadCategories();
    cancelEdit();
  } catch (error) {
    alert("Failed to create category");
    showToast("Failed to create category!", "error");
  } finally {
    isSaving.value = false;
  }
};

const editCategory = (category: any) => {
  editingCategory.value = category;
  newCategory.value = { ...category };
};

const cancelEdit = () => {
  editingCategory.value = null;
  newCategory.value = { id: null, name: "", slug: "", description: "" };
};

const deleteCategory = async (id: number) => {
  if (confirm("Delete this category?")) {
    try {
      await $fetch(`/categories/${id}`, {
        baseURL: config.public.apiBase,
        method: "DELETE",
      });
      loadCategories();
      showToast("Category deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete category!", "error");
    }
  }
};

onMounted(loadCategories);
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
}

.admin-main {
  flex: 1;
  padding: 30px;
  background: #f8fafc;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}

.add-form,
.categories-list {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.add-form h3,
.categories-list h3 {
  margin-bottom: 24px;
  color: #1c2d5b;
  font-size: 1.4rem;
}

/* Form Styles */
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #f49321;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.1);
}

/* Category Item */
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 5px;
  transition: all 0.3s;
}

.category-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.category-item.even-row {
  background: #efefef;
}

.category-item:not(.even-row) {
  background: white;
}

.category-info strong {
  font-size: 1.1rem;
  color: #1f2937;
}

.slug {
  color: #6b7280;
  font-size: 0.9rem;
}

.description {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  background: #f49321;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 8px;
}

.btn-primary:hover,
.btn-secondary:hover {
  background: #e07f1c;
  transform: translateY(-2px);
}

/* .btn-edit {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 8px;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
} */
.btn-edit,
.btn-delete {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 8px;
}

.btn-primary {
  background: #f49321;
  color: white;
}
.btn-secondary {
  background: #6b7280;
  color: white;
}
.btn-edit {
  background: #3b82f6;
  color: white;
}
.btn-delete {
  background: #ef4444;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #666;
}
</style>
