<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Products</h1>
      <div class="flex items-center gap-3">
        <button 
          @click="loadProducts" 
          class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          Refresh
        </button>
        <NuxtLink 
          to="/admin/products/create" 
          class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium no-underline flex items-center gap-2"
        >
          <span>+</span> Add New Product
        </NuxtLink>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <!-- Search Input -->
      <div class="relative flex-1 w-full">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">🔍</span>
        <input 
          type="text" 
          placeholder="Search products by name, SKU..." 
          v-model="searchTerm"
          @input="debounceSearch"
          class="w-full pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
        />
        <button 
          v-if="searchTerm" 
          @click="clearSearch" 
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-lg"
        >
          ×
        </button>
      </div>

      <!-- Category Filter -->
      <select 
        v-model="categoryFilter" 
        @change="applyFilters" 
        class="w-full sm:w-48 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
        </option>
      </select>
      
      <!-- Stock Filter -->
      <select 
        v-model="stockFilter" 
        @change="applyFilters" 
        class="w-full sm:w-48 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
      >
        <option value="">All Stock Status</option>
        <option value="instock">In Stock</option>
        <option value="outofstock">Out of Stock</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12 text-slate-500">
      Loading products...
    </div>

    <!-- Products Table -->
    <div v-else class="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider">
            <th class="p-4">Image</th>
            <th class="p-4">Product Name</th>
            <th class="p-4">SKU</th>
            <th class="p-4">Price</th>
            <th class="p-4">Stock</th>
            <th class="p-4">Category</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
          <tr v-if="paginatedProducts.length === 0">
            <td colspan="8" class="p-8 text-center text-slate-500 dark:text-slate-400">
              No products found
            </td>
          </tr>
          <tr 
            v-else 
            v-for="product in paginatedProducts" 
            :key="product.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <!-- Thumbnail -->
            <td class="p-4">
              <img 
                :src="getImageUrl(product.image_url)" 
                alt="Product image"
                class="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100"
                @error="handleImageError"
              />
            </td>
            <td class="p-4 font-medium text-slate-900 dark:text-white">{{ product.name }}</td>
            <td class="p-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{{ product.sku || 'N/A' }}</td>
            <td class="p-4 font-semibold text-slate-900 dark:text-white">${{ Number(product.price || 0).toFixed(2) }}</td>
            <td class="p-4">
              <span 
                :class="product.stock > 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'"
                class="px-2.5 py-1 rounded-full text-xs font-medium"
              >
                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
              </span>
            </td>
            <td class="p-4 text-slate-600 dark:text-slate-300">
              {{ product.categories?.name || product.category?.name || 'Uncategorized' }}
            </td>
            <td class="p-4">
              <span 
                :class="{
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300': product.status === 'draft',
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300': product.status === 'publish' || product.status === 'active',
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300': !['draft', 'publish', 'active'].includes(product.status)
                }"
                class="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
              >
                {{ product.status || 'draft' }}
              </span>
            </td>
            <!-- Actions -->
            <td class="p-4 text-right space-x-2">
              <button 
                @click="editProduct(product.id)" 
                class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-md text-xs font-medium transition-colors"
              >
                Edit
              </button>
              <button 
                v-if="isSuperAdmin" 
                @click="showDeleteConfirm(product)" 
                class="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md text-xs font-medium transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between pt-2">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
      >
        Previous
      </button>
      
      <span class="text-sm text-slate-600 dark:text-slate-400">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
      >
        Next
      </button>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🗑️</span> Confirm Delete
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete <strong class="text-slate-900 dark:text-white">{{ productToDelete?.name }}</strong>?
        </p>

        <div class="space-y-2">
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400">
            Type <strong>DELETE</strong> to confirm:
          </label>
          <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="DELETE"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-center font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button 
            @click="cancelDelete" 
            class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-600"
          >
            Cancel
          </button>
          <button 
            @click="executeDelete" 
            :disabled="deleteConfirmText !== 'DELETE'"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Yes, Delete Product
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const searchTerm = ref('')
const categoryFilter = ref('')
const stockFilter = ref('')
const categories = ref<any[]>([])
const products = ref<any[]>([])
const rawProducts = ref<any[]>([]) // Unfiltered products list
const isLoading = ref(true)

const currentUser = ref<{ role?: string } | null>(null)
const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin')

const showModal = ref(false)
const productToDelete = ref<any>(null)
const deleteConfirmText = ref('')

const currentPage = ref(1)
const itemsPerPage = 10

// Fetch products directly from Supabase
const loadProducts = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .order('id', { ascending: false })

    if (error) throw error

    rawProducts.value = data || []
    applyFilters()
  } catch (err) {
    console.error('Failed to fetch products from Supabase:', err)
    rawProducts.value = []
    products.value = []
  } finally {
    isLoading.value = false
  }
}

// Fetch categories for the filter dropdown
const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) throw error
    categories.value = data || []
  } catch (err) {
    console.error('Failed to load categories:', err)
  }
}

// Client-side filtering logic
const applyFilters = () => {
  let filtered = [...rawProducts.value]

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter((p) =>
      p.name?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter((p) => p.category_id == categoryFilter.value)
  }

  if (stockFilter.value) {
    filtered = filtered.filter((p) => {
      if (stockFilter.value === 'instock') return p.stock > 0
      if (stockFilter.value === 'outofstock') return p.stock <= 0
      return true
    })
  }

  products.value = filtered
}

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return products.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.max(1, Math.ceil(products.value.length / itemsPerPage)))

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const debounceSearch = () => {
  currentPage.value = 1
  applyFilters()
}

const clearSearch = () => {
  searchTerm.value = ''
  currentPage.value = 1
  applyFilters()
}

// Image Handling
// const getImageUrl = (url: string | null) => {
//   if (!url) return '/Images/placeholder.png'
//   if (url.startsWith('http')) return url
//   // Public URL builder for Supabase storage bucket named 'products'
//   const { data } = supabase.storage.from('Products').getPublicUrl(url)
//   return data.publicUrl
// }

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '/Images/placeholder.png'

  // already a full URL
  if (url.startsWith('http')) return url

  // strip accidental prefixes if old rows have them
  const path = url
    .replace(/^products\//i, '')
    .replace(/^Products\//i, '')

  const { data } = supabase.storage.from('Products').getPublicUrl(path)
  return data.publicUrl
  // → https://phwcfiukyiexdvtccopt.supabase.co/storage/v1/object/public/Products/1786622799859_JoyPhoto.webp
}


const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/Images/placeholder.png'
}

const editProduct = (id: number) => {
  navigateTo(`/admin/products/edit/${id}`)
}

// Delete Logic using Supabase
const showDeleteConfirm = (product: any) => {
  productToDelete.value = product
  deleteConfirmText.value = ''
  showModal.value = true
}

const cancelDelete = () => {
  showModal.value = false
  productToDelete.value = null
  deleteConfirmText.value = ''
}

const executeDelete = async () => {
  if (!productToDelete.value) return
  if (deleteConfirmText.value !== 'DELETE') return

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productToDelete.value.id)

    if (error) throw error

    showModal.value = false
    await loadProducts()
  } catch (err) {
    console.error('Failed to delete product:', err)
    alert('Failed to delete product from Supabase.')
  }
}

onMounted(async () => {
  const saved = localStorage.getItem('user')
  if (saved) {
    try {
      currentUser.value = JSON.parse(saved)
    } catch {
      currentUser.value = null
    }
  }

  await Promise.all([loadProducts(), loadCategories()])
})
</script>