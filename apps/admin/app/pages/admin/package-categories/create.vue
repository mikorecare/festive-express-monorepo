<template>
  <div class="create-product-page">
    <div class="page-header">
      <h1>Add New Package Category</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="$router.back()">Cancel</button>
        <button class="btn-primary" @click="saveCategory" :disabled="isSaving">
          {{ isSaving ? 'Saving...' : ('Create') }} Category
        </button>
      </div>
    </div>

    <div class="form-grid">
        <div class="main-form">
            <div class="form-section">
                <label class="form-label">Package Title <span class="required">*</span></label>
                <input 
                    v-model="category.package_title" 
                    type="text" 
                    :class="{ 'error-input': errors.package_title }"
                    @input="generateSlug"
                    placeholder="e.g. Holiday Lighting Package Programs"
                >
                <small v-if="errors.package_title" class="error-text">{{ errors.package_title }}</small>
            </div>

            <div class="form-section">
                <label class="form-label">Description <span class="required">*</span></label>
                <textarea 
                    v-model="category.package_description" 
                    rows="5"
                    :class="{ 'error-input': errors.package_description }"
                ></textarea>
                <small v-if="errors.package_description" class="error-text">{{ errors.package_description }}</small>
            </div>

            <div class="form-section">
                <label class="form-label">Slug <span class="required">*</span></label>
                <input 
                    v-model="category.slug" 
                    type="text" 
                    :class="{ 'error-input': errors.slug }"
                    placeholder="holiday-lighting-package-programs"
                >
                <small v-if="errors.slug" class="error-text">{{ errors.slug }}</small>
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

const category = ref({
  package_title: '',
  package_description: '',
  slug: '',
  event_date_from: '',
  event_date_to: '',
  is_active: true
})

const errors = ref<Record<string, string>>({})
const isSaving = ref(false)

const saveCategory = async () => {
  isSaving.value = true
  errors.value = {}

  try {
    await $fetch('/package-categories', {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'POST',
    body: category.value
    })

    showToast('Package category saved successfully!', 'success')
    navigateTo('/admin/package-categories')
  } catch (error: any) {
    if (error.data?.errors) {
      errors.value = error.data.errors
    } else {
      showToast(error.data?.message, 'error')
    }
  } finally {
    isSaving.value = false
  }
}

const generateSlug = () => {
  if (category.value.package_title) {
    category.value.slug = category.value.package_title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
      .replace(/\s+/g, '-')          // Replace spaces with -
      .replace(/-+/g, '-')           // Remove multiple dashes
  }
}

</script>

<style scoped>
.create-product-page {
  padding: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.form-section {
  margin-bottom: 24px;
}

.checkbox-label.is_active input{
    width: auto;
}

.form-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-input, .form-select, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.btn-primary, .btn-secondary {
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary { background: #F49322; color: white; }
.btn-secondary { background: #6b7280; color: white; }

.error-input {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-text {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 4px;
}

.form-label .required {
  color: #ef4444;
}
</style>