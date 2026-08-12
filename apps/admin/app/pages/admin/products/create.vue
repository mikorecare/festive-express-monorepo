<template>
  <div class="create-product-page">
    <div class="page-header">
      <h1>Add New Product</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="$router.back()">Cancel</button>
        <!-- <button class="btn-primary" @click="saveProduct">Publish Product</button> -->
        <button class="btn-primary" :disabled="isSaving" @click="saveProduct">
          {{ isSaving ? 'Publishing...' : 'Publish Product' }}
        </button>
      </div>
    </div>

    <div class="form-grid">
      <!-- Main Form -->
      <div class="main-form">
        <div class="form-section">
          <label class="form-label">Product Name <span class="required">*</span></label>
          <input v-model="product.name" type="text" placeholder="Enter Product Name" required>
        </div>

        <div class="form-section">
          <label class="form-label">Description</label>
          <textarea v-model="product.description" rows="6" placeholder="Write detailed product description..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-section">
            <label class="form-label">Price ($)</label>
            <input v-model="product.price" type="number" step="0.01" placeholder="0.00">
          </div>
          <div class="form-section">
            <label class="form-label">Stock Quantity</label>
            <input v-model="product.stock" type="number" placeholder="0">
          </div>
        </div>

        <div class="form-row">
          <div class="form-section">
            <label class="form-label">SKU</label>
            <input v-model="product.sku" type="text" placeholder="FLP-XPRS-001">
            <button type="button" @click="generateSKU" class="btn-generate">Auto Generate SKU</button>
          </div>
          <!-- <div class="form-section">
            <label class="form-label">Category</label>
            <select v-model="product.category">
              <option value="">Select Category</option>
              <option value="Patriotic">Patriotic</option>
              <option value="Roofline">Roofline Lighting</option>
              <option value="Ground">Ground & Shrub</option>
              <option value="Wreath">Wreaths & Garlands</option>
              <option value="Tree">Tree Lighting</option>
            </select>
          </div> -->

          <div class="form-section">
            <label class="form-label">Category</label>
            <select v-model="product.category_id" required>
              <option value="">Select Category</option>
              <option 
                v-for="cat in categories" 
                :key="cat.id" 
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>

        </div>


        <div class="form-section">
          <label class="form-label">Status</label>
          <select v-model="product.status">
            <option value="publish">Published</option>
            <option value="draft">Draft</option>
          </select>
          
        </div>

        <!-- Has Variations -->
        <div class="form-section mt-4 variations">
          <label class="checkbox-label">
            <input class="hasVariations w-auto" type="checkbox" v-model="product.has_variations">
            This product has variations (Color, Size, etc.)
          </label>

          <!-- Variations Section -->
          <div v-if="product.has_variations" class="variations-section">
            <label class="form-label">Variations</label>
            
            <div v-for="(variation, vIndex) in product.variations" :key="vIndex" class="variation-group mb-5">
              <div class="variation-header">
                <input 
                  v-model="variation.name" 
                  placeholder="Variation Name (e.g. Color)" 
                  class="variation-name"
                >
                <button type="button" @click="removeVariation(vIndex)" class="remove-variation-btn">Remove</button>
              </div>
              
              <div class="options-list">
                <div v-for="(option, oIndex) in variation.options" :key="oIndex" class="option-row">
                  <input 
                    v-model="option.name" 
                    placeholder="Option (e.g. Warm White)"
                    class="option-input variation-input"
                  >
                  
                  <input 
                    type="file" 
                    @change="uploadOptionImage(vIndex, oIndex, $event)" 
                    accept="image/*"
                    class="option-image-input"
                  >
                  
                  <img 
                    v-if="option.image_url" 
                    :src="getImageUrl(option.image_url)" 
                    class="option-preview"
                  >
                  
                  <button type="button" @click="removeOption(vIndex, oIndex)" class="remove-btn">×</button>
                </div>
              </div>

              <button type="button" @click="addOption(vIndex)" class="add-option-btn">
                + Add Option
              </button>
            </div>

            <button type="button" @click="addVariation" class="add-variation-btn">
              + Add New Variation
            </button>
          </div>

          <!- Package ->
          <div class="form-section mt-3">
            <label class="checkbox-label">
              <input type="checkbox" class="w-auto" v-model="product.is_package">
              This is a Package
            </label>
          </div>

          <!-- Package Type (only show if is_package is true) -->
          <div v-if="product.is_package" class="form-section">
            <label class="form-label">Package Type</label>
            <select v-model="product.package_data" class="form-select">
              <option value="">Select Package</option>
              <option 
                v-for="pkg in availablePackages" 
                :key="pkg.id" 
                :value="pkg.slug"
              >
                {{ pkg.package_title }}
              </option>
            </select>
          </div>
        </div>
        
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-box">
          <label class="form-label">Featured Image</label>
          <div class="image-upload-area" @click="triggerFileInput" @drop="handleDrop" @dragover.prevent>
            <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" hidden>
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview">
            </div>
            <div v-else class="upload-placeholder">
              <span>📸</span>
              <p>Click or drag image here</p>
            </div>
          </div>
        </div>

        <div class="sidebar-box">
          <label class="form-label">Gallery Images (Optional)</label>
          <input type="file" multiple accept="image/*" @change="handleGalleryUpload">
          <small>Hold Ctrl/Cmd to select multiple</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { showToast } = useToast()

const config = useRuntimeConfig()

const product = ref({
  name: '',
  description: '',
  price: null,
  stock: null,
  sku: '',
  category_id: '',
  status: 'publish',
  image_url: '',
  gallery: [] as string[],
  has_variations: false,
  variations: [
    { 
      name: '', 
      options: [
        { name: '', image_url: '' }
      ] 
    }
  ],
  is_package: false,           // ← Add this
  package_data: '',
})

const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)
const categories = ref<Array<{ id: number; name: string }>>([])

const triggerFileInput = () => fileInput.value?.click()

const generateSKU = () => {
  const timestamp = Date.now().toString().slice(-6)
  product.value.sku = `FLP-XPRS-${timestamp}`
}

const availablePackages = ref<Array<{
  id: number;
  package_title: string;
  slug: string;
}>>([])

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleGalleryUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) {
    console.log(`${files.length} gallery images selected`)
    // TODO: Handle multiple files for gallery
    showToast(`${files.length} gallery images selected`, 'success')
  }
  console.log('Gallery uploaded')
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const file = e.dataTransfer?.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '/Images/placeholder.png'
  return `${useRuntimeConfig().public.imageBase}/${url}`
}

const uploadOptionImage = async (vIndex: number, oIndex: number, e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const res: any = await $fetch('/upload/option-image', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: formData
    })

    // Safe assignment
    if (product.value?.variations?.[vIndex]?.options?.[oIndex]) {
      product.value.variations[vIndex].options[oIndex].image_url = res.path
    }
  } catch (error) {
    console.error('Failed to upload option image:', error)
  }
}

const saveProduct = async () => {
  if (!product.value.name?.trim()) {
    showToast('Product name is required!', 'error')
    return
  }

  isSaving.value = true

  try {
    const formData = new FormData()
    formData.append('name', product.value.name)
    formData.append('description', product.value.description || '')
    formData.append('price', String(product.value.price || '0'))
    formData.append('stock', String(product.value.stock || '0'))
    formData.append('sku', product.value.sku || '')
    formData.append('category_id', String(product.value.category_id || ''))
    formData.append('status', product.value.status)
    formData.append('has_variations', product.value.has_variations ? '1' : '0')
    formData.append('is_package', product.value.is_package ? '1' : '0')
    formData.append('package_data', product.value.package_data || '')

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    if (product.value.has_variations && product.value.variations) {
      formData.append('variations', JSON.stringify(product.value.variations))
    }

    // Token for auth:sanctum
    const token =
      useCookie('auth_token').value ||
      (import.meta.client ? localStorage.getItem('token') : null)

    console.log('TOKEN:', token)

    if (!token) {
      showToast('Please login again', 'error')
      navigateTo('/login')
      return
    }

    const response = await $fetch('/products', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
        // Do NOT set Content-Type — browser sets multipart boundary for FormData
      }
    })

    showToast('✅ Product published successfully!', 'success')
    resetForm()
    navigateTo('/admin/products')
  } catch (error: any) {
    console.error(error)
    showToast(error.data?.message || 'Failed to save product', 'error')
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  product.value = {
    name: '',
    description: '',
    price: null,
    stock: null,
    sku: '',
    category_id: '',
    status: 'publish',
    image_url: '',
    gallery: [],
    has_variations: false,
    variations: [
      { 
        name: '', 
        options: [
          { name: '', image_url: '' }
        ] 
      }
    ],
    is_package: false,
    package_data: ''
  }
  imageFile.value = null
  imagePreview.value = null
}

// Variations
const addVariation = () => {
  product.value.variations.push({ 
    name: '', 
    options: [{ name: '', image_url: '' }] 
  })
}

const removeVariation = (vIndex: number) => {
  if (product.value.variations.length > 1) {
    product.value.variations.splice(vIndex, 1)
  }
}

const addOption = (vIndex: number) => {
  if (product.value.variations[vIndex]) {
    product.value.variations[vIndex].options.push({ name: '', image_url: '' })
  }
}

const removeOption = (vIndex: number, oIndex: number) => {
  if (product.value.variations[vIndex] && product.value.variations[vIndex].options.length > 1) {
    product.value.variations[vIndex].options.splice(oIndex, 1)
  }
}

// Initialize variations if empty
onMounted(async () => {
  if (product.value.variations.length === 0) {
    product.value.variations = [{ 
      name: '', 
      options: [{ name: '', image_url: '' }] 
    }]
  }

  // Load categories
  try {
    const res: any = await $fetch('/categories', {
      baseURL: config.public.apiBase
    })
    categories.value = res.data || res || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }

  // Load Packages
  try {
    const res2: any = await $fetch('/package-categories', {
      baseURL: useRuntimeConfig().public.apiBase
    })
    availablePackages.value = res2.data || res2
  } catch (error) {
    console.error('Failed to load packages:', error)
  }

})

</script>

<style scoped>
/* Labels - Smaller & Consistent */
.form-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  margin-top: 10px;
}

.required { color: #e74c3c; }

/* Form Elements */
.form-section input,
.form-section textarea,
.form-section select {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.form-section input:focus,
.form-section textarea:focus,
.form-section select:focus {
  outline: none;
  border-color: #F49322;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.15);
}

/* Rest of styles remain clean */
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.status-options {
  display: flex;
  gap: 20px;
}

.status-options label {
  cursor: pointer;
  font-size: 0.98rem;
}

/* Sidebar & Buttons */
.btn-primary {
  background: #F49322;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover { background: #e07f1c; }

.btn-secondary {
  background: #6b7280;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
}

.sidebar-box {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.image-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
}

.image-upload-area:hover {
  border-color: #F49322;
}
.image-preview{width: 304px;
    min-width: 304px;}
.image-preview img{width: 100%;}    

/* Variations */
.variations label{    align-items: center;
    vertical-align: middle;
    display: flex;
    gap: 10px;}
.variation-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.variation-name {
  flex: 1;
}

.remove-variation-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.option-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.option-input {
  flex: 1;
}

.variation-input, .option-image-input{
  width: auto !important;
}

img.option-preview {
    width: 50px;
}

.remove-btn {
  background: #ef4444;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-option-btn, .add-variation-btn {
  background: #F49322;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;
}

.submit-btn {
  background: #0c2340;
  color: white;
  padding: 16px 50px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  margin-top: 40px;
}

</style>