<template>
  <div>
    <div class="page-header">
      <h1>Products</h1>
      <div class="actions">
        <button class="export-btn">Export</button>
        <NuxtLink to="/admin/products/create" class="add-btn">
          + Add New Product
        </NuxtLink>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Search products by name, SKU..." 
          v-model="searchTerm"
          @input="debounceSearch"
        >
        <button v-if="searchTerm" @click="clearSearch" class="clear-btn">×</button>
      </div>

      <select v-model="categoryFilter" @change="loadProducts" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <select v-model="stockFilter" @change="loadProducts" class="filter-select">
        <option value="">All Stock Status</option>
        <option value="instock">In Stock</option>
        <option value="outofstock">Out of Stock</option>
      </select>
    </div>

    <table class="products-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Categories</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedProducts.length === 0">
          <td colspan="8" class="no-data">
            No Products Found
          </td>
        </tr>
        <tr v-else v-for="product in paginatedProducts" :key="product.id">
          <td>
            <img 
              :src="getImageUrl(product.image_url)"
              class="product-thumb"
              :class="{ 'has-image': product.image_url, 'placeholder-img': !product.image_url }"
              alt=""
              @error="handleImageError($event)"
            >
            <!-- <img 
              :src="`http://localhost:8000/${product.image_url}`"
              class="product-thumb"
              alt=""
              @error="e => e.target.style.display = 'none'"
            > -->
            
          </td>
          <td>{{ product.name }}</td>
          <td>{{ product.sku }}</td>
          <td>${{ product.price }}</td>
          <td :class="product.stockStatus">{{ product.stock }}</td>
          <td>{{ product.category ? product.category.name : 'Uncategorized' }}</td>
          <td>
            <span :class="['status', product.status]" class="text-capitalize">{{ product.status }}</span>
          </td>
          <td class="actions">
            <button class="btn-edit" @click="editProduct(product.id)">Edit</button>
            <button v-if="isSuperAdmin" class="delete-btn" @click="showDeleteConfirm(product)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

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

    <!-- Simple Confirmation Modal -->
    <div v-if="showModal" class="delete-modal-overlay">
      <div class="delete-modal">
        <h3>🗑️ Confirm Delete</h3>
        <p>Are you sure you want to delete this product?</p>
        <p class="product-name">{{ productToDelete?.name }}</p>

        <p class="confirm-hint">
          Type <strong>DELETE</strong> to confirm:
        </p>
        <input
          v-model="deleteConfirmText"
          type="text"
          class="confirm-input"
          placeholder="DELETE"
          autocomplete="off"
        >
        
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">Cancel</button>
          <button @click="executeDelete" class="btn-confirm-delete" :disabled="deleteConfirmText !== 'DELETE'">
            Yes, Delete Product
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const searchTerm = ref('')
const categoryFilter = ref('')
const stockFilter = ref('')
const categories = ref<Array<{
  id: number;
  name: string;
}>>([])

const config = useRuntimeConfig()

// Current user (from login response / cookie / API)
const currentUser = ref<{ role?: string } | null>(null)

const isSuperAdmin = computed(() => {
  return currentUser.value?.role === 'super_admin'
})

const { showToast } = useToast()

const { getProducts, deleteProduct } = useProducts()
const products = ref<any[]>([])
const showModal = ref(false)
const productToDelete = ref<any>(null)
const deleteConfirmText = ref('')

const currentPage = ref(1)
const itemsPerPage = 10

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return products.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage))

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const debounceSearch = debounce(() => {
  currentPage.value = 1
  loadProducts()
}, 500)

const clearSearch = () => {
  searchTerm.value = ''
  currentPage.value = 1
  loadProducts()
}

function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return '/Images/placeholder.png'  // fallback image
  return `${config.public.imageBase}/${imageUrl}`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) {
    img.style.display = 'none'
    // Optional: show placeholder
    img.src = '/Images/placeholder.png'
  }
}


const loadProducts = async () => {
  try {
    const res: any = await getProducts()   // Call without params first

    let filtered = res.data || res || []

    // Sort by latest first (newest ID or created_at)
    filtered.sort((a: any, b: any) => b.id - a.id)  // Latest ID first

    // Client-side search
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase()
      filtered = filtered.filter((p: any) => 
        p.name?.toLowerCase().includes(term) || 
        p.sku?.toLowerCase().includes(term)
      )
    }

    // Client-side category filter
    if (categoryFilter.value) {
      filtered = filtered.filter((p: any) => p.category_id == categoryFilter.value)
    }

    // Client-side stock filter
    if (stockFilter.value) {
      filtered = filtered.filter((p: any) => {
        if (stockFilter.value === 'instock') return p.stock > 0
        if (stockFilter.value === 'outofstock') return p.stock === 0
        return true
      })
    }

    products.value = filtered
  } catch (error) {
    console.error('Failed to load products:', error)
    products.value = []
  }
}

const editProduct = (id: number) => {
  navigateTo(`/admin/products/edit/${id}`)
}


// DELETE
const showDeleteConfirm = (product: any) => {
  if (!isSuperAdmin.value) return
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
  if (!productToDelete.value || !isSuperAdmin.value) return
  if (deleteConfirmText.value !== 'DELETE') return

  try {
    await deleteProduct(productToDelete.value.id)

    await loadProducts() // Refresh list
    
    // Success Toast
    // alert('✅ Product deleted successfully!')   // You can replace this with sonner toast later
    showToast(`✅ ${productToDelete.value.name} deleted successfully!`)

    showModal.value = false
  } catch (error) {
    // alert('❌ Failed to delete product')
    showToast('❌ Failed to delete product', 'error')
  }
}
// DELETE

const loadCategories = async () => {
  try {
    const res: any = await $fetch('/categories', {
      baseURL: apiBase
    })
    categories.value = res.data || res || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

onMounted(async () => {
  try {
    // Option A: from cookie/local storage set at login
    const saved = localStorage.getItem('user')
    if (saved) {
      currentUser.value = JSON.parse(saved)
    }

    // Option B: from API
    // const res: any = await $fetch('/me', { baseURL: config.public.apiBase, headers: { Authorization: `Bearer ${token}` } })
    // currentUser.value = res
  } catch (e) {
    currentUser.value = null
  }

  await loadProducts()
  await loadCategories()
})

</script>

<style scoped>
.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.filters input, .filters select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.products-table th {
  background: #0c2340;
  color: #fff;  
  padding: 16px;
  text-align: left;
}
.products-table tbody th{
  color: #1d3156; 
}
.products-table th,
.products-table td {
  padding: 14px 12px;
  vertical-align: middle;
}

.products-table tr {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);   /* Nice card-like look */
  margin-bottom: 12px;
}

/* Optional: Hover effect */
.products-table tr:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  /* transform: translateY(-1px); */
}

/* Alternating Row Colors */
.products-table tbody tr:nth-child(odd) {
  background-color: white;
}

.products-table tbody tr:nth-child(even) {
  background-color: #efefef;
}

/* Hover Effect */
/* .products-table tbody tr:hover {
  background-color: #3a4350 !important;
  color: white;
  transform: scale(1.01);
  transition: all 0.2s;
} */

.product-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.product-thumb.has-image {
  object-fit: cover;
}

.product-thumb.placeholder-img {
  object-fit: contain;
}

.status {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.status.draft { background: #f39c12; color: white; }
.status.publish { background: #10b981; color: white; }

.actions button {
  margin-right: 8px;
}

.confirm-hint {
  margin: 16px 0 8px;
  font-size: 0.9rem;
  color: #64748b;
}

.confirm-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 1rem;
  text-align: center;
}

.confirm-input:focus {
  outline: none;
  border-color: #ef4444;
}

.delete-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

</style>