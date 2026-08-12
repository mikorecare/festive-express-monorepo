<template>
  <div class="create-product-page">
    <div class="page-header">
      <h1>Edit Package Category</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="$router.back()">Cancel</button>
        <button class="btn-primary" @click="saveCategory" :disabled="isSaving">
          Update Category
        </button>
      </div>
    </div>

    <div class="form-grid">
      <div class="main-form">
        <div class="form-section">
          <label class="form-label">Package Title <span class="required">*</span></label>
          <input v-model="category.package_title" type="text" @input="generateSlug">
        </div>

        <div class="form-section">
          <label class="form-label">Description <span class="required">*</span></label>
          <textarea v-model="category.package_description" rows="5"></textarea>
        </div>

        <div class="form-section">
          <label class="form-label">Slug <span class="required">*</span></label>
          <input v-model="category.slug" type="text">
        </div>

        <div class="form-row">
          <div class="form-section">
            <label class="form-label">Event Date From</label>
            <input v-model="category.event_date_from" type="date" class="form-date">
          </div>
          <div class="form-section">
            <label class="form-label">Event Date To</label>
            <input v-model="category.event_date_to" type="date" class="form-date">
          </div>
        </div>

        <div class="form-section mt-4">
          <label class="checkbox-label is_active">
            <input type="checkbox" v-model="category.is_active">
            Active Category
          </label>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { showToast } = useToast()
const isSaving = ref(false)

const category = ref({
  package_title: '',
  package_description: '',
  slug: '',
  event_date_from: '',
  event_date_to: '',
  is_active: true
})

const generateSlug = () => {
  if (category.value.package_title) {
    category.value.slug = category.value.package_title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
}

const saveCategory = async () => {
  isSaving.value = true

  try {
    await $fetch(`/package-categories/${route.params.id}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'PUT',
      body: category.value
    })
    showToast('Package category updated successfully!', 'success')
    navigateTo('/admin/package-categories')
  } catch (error) {
    showToast('Failed to update category!', 'error')
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  try {
    const res: any = await $fetch(`/package-categories/${route.params.id}`, {
      baseURL: useRuntimeConfig().public.apiBase
    })
    category.value = {
      ...res,
      event_date_from: res.event_date_from ? res.event_date_from.split('T')[0] : '',
      event_date_to: res.event_date_to ? res.event_date_to.split('T')[0] : ''
    }
  } catch (error) {
    console.error('Failed to load category:', error)
  }
})
</script>

<style scoped>
.checkbox-label.is_active input{
    width: auto;
}
</style>