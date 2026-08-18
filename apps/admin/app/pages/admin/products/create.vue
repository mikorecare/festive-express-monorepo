<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p class="text-sm text-gray-500 mt-1">Create product details and variations</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          @click="$router.back()"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-5 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSaving"
          @click="saveProduct"
        >
          {{ isSaving ? 'Publishing...' : 'Publish Product' }}
        </button>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2">
              Product Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="product.name"
              type="text"
              placeholder="e.g. American Flag Waving LED Patriotic Metal Frame"
              class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
              required
            >
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2">Description</label>
            <textarea
              v-model="product.description"
              rows="5"
              placeholder="Write detailed product description..."
              class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
            />
          </div>

          <!-- Price & Stock -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2">Price ($)</label>
              <input
                v-model="product.price"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2">Stock Quantity</label>
              <input
                v-model="product.stock"
                type="number"
                placeholder="0"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
              >
            </div>
          </div>

          <!-- SKU & Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2">SKU</label>
              <div class="flex gap-2">
                <input
                  v-model="product.sku"
                  type="text"
                  placeholder="FLP-XPRS-001"
                  class="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm"
                >
                <button
                  type="button"
                  class="px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                  @click="generateSKU"
                >
                  Auto SKU
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-2">Category</label>
              <select
                v-model="product.category_id"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm bg-white"
              >
                <option :value="null">Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2">Status</label>
            <select
              v-model="product.status"
              class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm bg-white"
            >
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <!-- Variations -->
          <div class="pt-4 border-t border-gray-200">
            <label class="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                v-model="product.has_variations"
                type="checkbox"
                class="w-4 h-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange"
              >
              <span class="text-sm font-semibold text-gray-800">
                This product has variations (Color, Size, etc.)
              </span>
            </label>

            <div v-if="product.has_variations" class="mt-4 space-y-4">
              <div
                v-for="(variation, vIndex) in product.variations"
                :key="vIndex"
                class="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3"
              >
                <div class="flex items-center gap-3">
                  <input
                    v-model="variation.name"
                    placeholder="Variation Name (e.g. Color)"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange text-sm bg-white"
                  >
                  <button
                    type="button"
                    class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                    @click="removeVariation(vIndex)"
                  >
                    Remove Group
                  </button>
                </div>

                <div class="space-y-2">
                  <div
                    v-for="(option, oIndex) in variation.options"
                    :key="oIndex"
                    class="flex items-center gap-2"
                  >
                    <input
                      v-model="option.name"
                      type="text"
                      placeholder="Option (e.g. Warm White)"
                      class="flex-1 min-w-[180px] px-3.5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange text-sm bg-white"
                    >
                    <input
                      type="file"
                      accept="image/*"
                      class="w-auto max-w-[220px] text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer shrink-0"
                      @change="uploadOptionImage(vIndex, oIndex, $event)"
                    >
                    <img
                      v-if="option.image_url"
                      :src="getImageUrl(option.image_url, 'variations')"
                      class="w-8 h-8 object-cover rounded-md border border-gray-300 shrink-0"
                      alt=""
                    >
                    <button
                      type="button"
                      class="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 text-sm font-bold shrink-0 transition-colors"
                      @click="removeOption(vIndex, oIndex)"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  class="text-xs font-medium text-brand-orange hover:underline pt-1 inline-block"
                  @click="addOption(vIndex)"
                >
                  + Add Option
                </button>
              </div>

              <button
                type="button"
                class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-brand-orange hover:text-brand-orange transition-colors"
                @click="addVariation"
              >
                + Add New Variation Group
              </button>
            </div>
          </div>

          <!-- Package -->
          <div class="pt-4 border-t border-gray-200 space-y-4">
            <label class="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                v-model="product.is_package"
                type="checkbox"
                class="w-4 h-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange"
              >
              <span class="text-sm font-semibold text-gray-800">This is a Package</span>
            </label>

            <div v-if="product.is_package">
              <label class="block text-sm font-semibold text-gray-800 mb-2">Package Type</label>
              <select
                v-model="product.package_data"
                class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-sm bg-white"
              >
                <option value="">Select Package Program</option>
                <option
                  v-for="pkg in availablePackages"
                  :key="pkg.id"
                  :value="pkg.slug || pkg.package_slug"
                >
                  {{ pkg.package_title || pkg.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <label class="block text-sm font-semibold text-gray-800">Featured Image</label>

          <div
            class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-brand-orange transition-colors min-h-[220px] flex flex-col items-center justify-center bg-gray-50"
            @click="triggerFileInput"
            @drop="handleDrop"
            @dragover.prevent
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            >

            <div v-if="imagePreview" class="relative group w-full">
              <img
                :src="imagePreview"
                alt="Preview"
                class="w-full h-48 object-cover rounded-lg border border-gray-200"
              >
              <div class="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                Click to Replace Image
              </div>
            </div>

            <div v-else class="space-y-2 py-4">
              <div class="text-3xl">📷</div>
              <p class="text-xs text-gray-500 font-medium">Click or drag featured image here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface VariationOption {
  name: string
  image_url?: string
}

interface ProductVariation {
  name: string
  options: VariationOption[]
}

interface Category {
  id: number | string
  name: string
  slug?: string
}

const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const supabaseUrl = config.public.supabaseUrl
const bucket = config.public.storageBucket || 'Products'
const { showToast } = useToast()

const isSaving = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const categories = ref<Category[]>([])
const availablePackages = ref<any[]>([])

const product = ref({
  name: '',
  description: '',
  price: null as number | null,
  stock: null as number | null,
  sku: '',
  category_id: null as number | string | null,
  status: 'publish',
  image_url: '',
  has_variations: false,
  variations: [
    { name: '', options: [{ name: '', image_url: '' }] },
  ] as ProductVariation[],
  is_package: false,
  package_data: '',
})

const generateSKU = () => {
  product.value.sku = `FLP-XPRS-${Date.now().toString().slice(-6)}`
}

const triggerFileInput = () => fileInput.value?.click()

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const getImageUrl = (url?: string | null, folder: '' | 'variations' = '') => {
  if (!url) return '/Images/placeholder.jpg'
  if (url.startsWith('http')) return url

  let path = url
    .replace(/^\//, '')
    .replace(/^products\//i, '')
    .replace(/^Products\//i, '')
    .replace(/^variations\//i, '')

  if (url.toLowerCase().includes('variations/')) {
    path = url
      .replace(/^\//, '')
      .replace(/^products\//i, '')
      .replace(/^Products\//i, '')
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
  }

  const prefix = folder ? `${folder}/` : ''
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${prefix}${path}`
}

const uploadOptionImage = async (vIndex: number, oIndex: number, e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `variations/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`

    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true, contentType: file.type })

    if (uploadErr) throw uploadErr

    if (product.value.variations?.[vIndex]?.options?.[oIndex]) {
      product.value.variations[vIndex].options[oIndex].image_url = fileName
    }
    showToast('Option image uploaded', 'success')
  } catch (error: any) {
    console.error(error)
    showToast(error?.message || 'Failed to upload option image', 'error')
  }
}

const addVariation = () => {
  product.value.variations.push({ name: '', options: [{ name: '', image_url: '' }] })
}

const removeVariation = (vIndex: number) => {
  if (product.value.variations.length > 1) {
    product.value.variations.splice(vIndex, 1)
  }
}

const addOption = (vIndex: number) => {
  product.value.variations[vIndex]?.options.push({ name: '', image_url: '' })
}

const removeOption = (vIndex: number, oIndex: number) => {
  const opts = product.value.variations[vIndex]?.options
  if (opts && opts.length > 1) opts.splice(oIndex, 1)
}

const saveProduct = async () => {
  if (!product.value.name?.trim()) {
    showToast('Product name is required', 'error')
    return
  }

  isSaving.value = true
  try {
    let finalImageUrl = product.value.image_url

    if (imageFile.value) {
      const fileExt = imageFile.value.name.split('.').pop()
      const baseName = imageFile.value.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
      const fileName = `${Date.now()}_${baseName}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(fileName, imageFile.value, {
          upsert: true,
          contentType: imageFile.value.type,
        })

      if (uploadErr) throw uploadErr
      finalImageUrl = fileName
    }

    const { data: created, error: insertErr } = await (supabase.from('products') as any)
      .insert({
        name: product.value.name,
        description: product.value.description,
        price: product.value.price || 0,
        stock: product.value.stock || 0,
        sku: product.value.sku,
        category_id: product.value.category_id,
        status: product.value.status,
        image_url: finalImageUrl || null,
        has_variations: product.value.has_variations,
        is_package: product.value.is_package,
        package_data: product.value.package_data || null,
        is_active: true,
      })
      .select('id')
      .single()

    if (insertErr) throw insertErr

    const newId = created?.id

    if (product.value.has_variations && newId) {
      for (const v of product.value.variations) {
        if (!v.name?.trim()) continue
        const { error: vErr } = await (supabase.from('variations') as any).insert({
          product_id: newId,
          name: v.name,
          options: v.options,
        })
        if (vErr) throw vErr
      }
    }

    showToast('✅ Product published successfully!', 'success')
    navigateTo('/admin/products')
  } catch (error: any) {
    console.error('Create product failed:', error)
    showToast(error?.message || 'Failed to save product', 'error')
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  try {
    const { data: catData } = await (supabase.from('categories') as any).select('*')
    categories.value = catData || []
  } catch (e) {
    console.error('Failed to load categories:', e)
  }

  try {
    const { data: pkgData } = await (supabase.from('package_categories') as any).select('*')
    availablePackages.value = pkgData || []
  } catch (e) {
    console.error('Failed to load package categories:', e)
  }
})
</script>