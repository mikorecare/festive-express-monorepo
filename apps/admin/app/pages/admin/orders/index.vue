<template>
  <div>
    <div class="page-header">
      <h1>Orders Management</h1>
      <button class="export-btn">Export Orders</button>
    </div>

    <!-- Search & Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Search orders by number, customer name, or email..." 
          v-model="searchTerm"
          @input="debounceSearch"
        >
        <button v-if="searchTerm" @click="clearSearch" class="clear-btn">×</button>
      </div>

      <select v-model="statusFilter" @change="loadOrders" class="filter-select">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="on-hold">On Hold</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="refunded">Refunded</option>
      </select>
    </div>

    <table class="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Install Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedOrders.length === 0">
          <td colspan="8" class="no-data">
            No Orders Found
          </td>
        </tr>
        <tr v-else v-for="order in paginatedOrders" :key="order.id">
          <td>#{{ order.order_number }}</td>
          <td>
            <div>{{ order.billing_first_name }} {{ order.billing_last_name }}</div>
            <small>{{ order.billing_email }}</small>
          </td>
          <td>{{ formatDate(order.created_at) }}</td>
          <td><strong>${{ Number(order.total).toFixed(2) }}</strong></td>
          <td>
            <span :class="['status-badge', order.status]">{{ order.status }}</span>
          </td>
          <td>
              {{ order.confirmed_install_date 
                  ? formatDate(order.confirmed_install_date) 
                  : order.preferred_install_date 
                    ? formatDate(order.preferred_install_date) + ' (preferred)'
                    : '—' }}
            </td>
          <td class="actions">
            <button class="btn-view" @click="viewOrder(order.id)">View</button>
            <button v-if="isSuperAdmin" class="delete-btn" @click="showDeleteConfirm(order)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">Previous</button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">Next</button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showModal" class="delete-modal-overlay" @click.self="cancelDelete">
      <div class="delete-modal">
        <h3>🗑️ Confirm Delete</h3>
        <p>Are you sure you want to delete Order?</p>
        <p v-if="orderToDelete" class="product-name">{{ orderToDelete.order_number }}</p>
        <p class="warning-text">This action cannot be undone.</p>

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
          <button class="btn-cancel" @click="cancelDelete">Cancel</button>
          <button class="btn-confirm-delete" :disabled="deleteConfirmText !== 'DELETE'" @click="executeDelete">Yes, Delete Order</button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
// definePageMeta({
//   middleware: 'auth'
// })

const config = useRuntimeConfig()

const { getOrders, deleteOrder: apiDeleteOrder } = useOrders()

const orders = ref<Array<{
  id: number;
  order_number: string;
  billing_first_name?: string;
  billing_last_name?: string;
  billing_email?: string;
  total: number;
  status: string;
  created_at: string;
  confirmed_install_date?: string;
  preferred_install_date?: string;
  date?: string;
}>>([])
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage))
const totalOrders = ref(0)
const searchTerm = ref('')
const { showToast } = useToast()
const showModal = ref(false)
const orderToDelete = ref<any>(null)
const deleteConfirmText = ref('')


const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return orders.value.slice(start, start + itemsPerPage)
})

const loadOrders = async () => {
  try {
    const res: any = await getOrders()   // Call without params first

    let filtered = res.data || res || []

    // Client-side search
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase()
      filtered = filtered.filter((o: any) => 
        o.order_number?.toLowerCase().includes(term) || 
        (o.billing_first_name + ' ' + o.billing_last_name).toLowerCase().includes(term) ||
        o.billing_email?.toLowerCase().includes(term)
      )
    }

    // Client-side status filter
    if (statusFilter.value) {
      filtered = filtered.filter((o: any) => o.status === statusFilter.value)
    }

    orders.value = filtered
  } catch (error) {
    console.error('Failed to load orders:', error)
    orders.value = []
  }
}

// DELETE
const currentUser = ref<{ role?: string } | null>(null)

const isSuperAdmin = computed(() => {
  return currentUser.value?.role === 'super_admin'
})

const showDeleteConfirm = (order: any) => {
  if (!isSuperAdmin.value) return
  orderToDelete.value = order
  deleteConfirmText.value = ''
  showModal.value = true
}

const cancelDelete = () => {
  showModal.value = false
  orderToDelete.value = null
  deleteConfirmText.value = ''
}

const executeDelete = async () => {
  if (!orderToDelete.value || !isSuperAdmin.value) return
  if (deleteConfirmText.value !== 'DELETE') return

  const orderNumber = orderToDelete.value.order_number
  const orderId = orderToDelete.value.id

  try {
    await apiDeleteOrder(orderId)

    showToast(`✅ Order ${orderNumber} deleted successfully!`)

    showModal.value = false
    orderToDelete.value = null

    await loadOrders()
  } catch (error: any) {
    console.error(error)
    showToast(error?.data?.message || '❌ Failed to delete order', 'error')
  }
}
// DELETE

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewOrder = (id: number) => {
  navigateTo(`/admin/orders/${id}`)
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadOrders()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadOrders()
  }
}

// Search
const debounceSearch = debounce(() => {
  currentPage.value = 1
  loadOrders()
}, 500)

const clearSearch = () => {
  searchTerm.value = ''
  currentPage.value = 1
  loadOrders()
}

function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

onMounted(async () => {
  try {
    const saved = localStorage.getItem('user')
    if (saved) currentUser.value = JSON.parse(saved)
  } catch {
    currentUser.value = null
  }

  await loadOrders()  
})

</script>

<style scoped>
.table-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.06);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  background: #0c2340;
  color: white;
  padding: 16px;
  text-align: left;
  font-weight: 600;
}

.orders-table td {
  padding: 16px;
  border-bottom: 1px solid #eee;
}


.btn-view, .btn-edit {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 6px;
}

.btn-view { background: #3b82f6; color: white; }
.btn-edit { background: #F49322; color: white; }

.delete-btn {
  background: #ef4444;        /* Red color */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-btn:hover {
  background: #dc2626;
}


/* Delete Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.modal-content h3 {
  margin-bottom: 16px;
  color: #0c2340;
}

.warning-text {
  color: #ef4444;
  margin: 16px 0;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.btn-secondary, .btn-delete {
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
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

/* End Delete Modal */

</style>