<template>
  <div class="admin-page">
    <main class="admin-main">
      <div class="page-header">
        <h1>Package Categories</h1>
        <button class="btn-primary" @click="addNewCategory">+ Add New Category</button>
      </div>

      <div class="table-wrapper">
        <table class="products-table">
          <thead>
            <tr>
              <th>Package Title</th>
              <th>Description</th>
              <th>Slug</th>
              <th>Event From</th>
              <th>Event To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id">
              <td>{{ cat.package_title }}</td>
              <td>{{ cat.package_description }}</td>
              <td>{{ cat.slug }}</td>
              <td>{{ formatDate(cat.event_date_from) }}</td>
              <td>{{ formatDate(cat.event_date_to) }}</td>
              <td>
                <span :class="['status-badge', cat.is_active ? 'active' : 'inactive']">
                  {{ cat.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="actions">
                <button class="btn-edit" @click="editCategory(cat)">Edit</button>
                <button class="delete-btn" @click="deleteCategory(cat.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">

const config = useRuntimeConfig()
const categories = ref<Array<{
  id: number;
  package_title: string;
  package_description: string;
  slug: string;
  event_date_from: string;
  event_date_to: string;
  is_active: boolean;
}>>([])
const { showToast } = useToast()

const loadCategories = async () => {
  try {
    const res: any = await $fetch('/package-categories', {
      baseURL: config.public.apiBase
    })
    categories.value = res.data || res || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const editCategory = (cat: any) => {
  navigateTo(`/admin/package-categories/edit/${cat.id}`)
}

const deleteCategory = async (id: number) => {
  if (confirm('Delete this category?')) {
    try {
      await $fetch(`/package-categories/${id}`, {
        baseURL: config.public.apiBase,
        method: 'DELETE'
      })
      showToast('Category deleted successfully!', 'success')
      loadCategories()
    } catch (error) {
      showToast('Failed to delete category', 'error')
    }
  }
}

const addNewCategory = () => {
  navigateTo('/admin/package-categories/create')
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(loadCategories)
</script>

<style scoped>
.btn-edit {margin-right: 10px;}
</style>
