<template>
  <div class="create-product-page">
    <div class="page-header">
      <div>
        <h1 v-if="order">Order #{{ order.order_number }}</h1>
        <p class="text-gray-600" v-if="order">Placed on {{ formatDate(order.created_at) }}</p>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="$router.back()">Back to Orders</button>
        <button class="btn-primary" :disabled="isSaving" @click="saveOrder" v-if="order">
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div v-if="order" class="form-grid">
      <!-- Main Column -->
      <div class="main-form">
        <!-- Order Summary (editable) -->
        <div class="form-section card">
          <h3>Order Summary</h3>

          <div class="form-section">
            <label class="form-label">Status</label>
            <div class="select-wrapper">
              <select v-model="form.status" class="form-control status-select">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div class="summary-row">
            <span>Total</span>
            <strong>${{ Number(order.total).toFixed(2) }}</strong>
          </div>
          <div class="summary-row">
            <span>Payment</span>
            <span>{{ order.payment_method_title || order.payment_method || '—' }}</span>
          </div>

          <div class="form-row mt-3">
            <div class="form-section">
              <label class="form-label">Preferred Install Date</label>
              <input type="date" v-model="form.preferred_install_date" class="form-control">
            </div>
            <div class="form-section">
              <label class="form-label">Confirmed Install Date</label>
              <input type="date" v-model="form.confirmed_install_date" class="form-control">
            </div>
          </div>

          <div class="form-section">
            <label class="form-label">Removal Date</label>
            <input type="date" v-model="form.removal_date" class="form-control">
          </div>
        </div>

        <!-- Order Items (read-only) -->
        <div class="form-section card">
          <h3>Order Items</h3>
          <div v-for="item in order.items" :key="item.id" class="item-row">
            <div class="item-info">
              <strong>{{ item.product_name }}</strong>
              <small>Qty: {{ item.quantity }} × ${{ item.price }}</small>
              <small v-if="item.options?.c9_color" class="text-muted">
                Color: {{ item.options.c9_color }}
              </small>
            </div>
            <div class="item-total">
              <strong>${{ (item.quantity * item.price).toFixed(2) }}</strong>
            </div>
          </div>
        </div>

        <!-- Customer Note (editable) -->
        <div class="form-section card">
          <h3>Customer Note</h3>
          <textarea
            v-model="form.customer_note"
            class="form-control"
            rows="4"
            placeholder="Customer special instructions..."
          ></textarea>
        </div>

        <!-- Internal Note (editable) -->
        <div class="form-section card">
          <h3>Internal Note <small class="text-muted">(admin only)</small></h3>
          <textarea
            v-model="form.admin_note"
            class="form-control"
            rows="3"
            placeholder="Private notes for your team..."
          ></textarea>
        </div>
      </div>

      <!-- Sidebar (read-only customer info) -->
      <div class="sidebar">
        <div class="sidebar-box card">
          <h3>Customer Information</h3>
          <p>Full Name: <strong>{{ order.billing_first_name }} {{ order.billing_last_name }}</strong></p>
          <p>Email: <strong>{{ order.billing_email }}</strong></p>
          <p>Phone: <strong>{{ order.billing_phone }}</strong></p>
        </div>

        <div class="sidebar-box card">
          <h3>Billing Address</h3>
          <p><strong>{{ order.billing_first_name }} {{ order.billing_last_name }}</strong></p>
          <p><strong>{{ order.billing_address_1 }}</strong></p>
          <p v-if="order.billing_address_2"><strong>{{ order.billing_address_2 }}</strong></p>
          <p><strong>{{ order.billing_city }}, {{ order.billing_state }} {{ order.billing_postcode }}</strong></p>
          <p><strong>{{ order.billing_country }}</strong></p>
        </div>

        <div class="sidebar-box card">
          <h3>Shipping / Installation Address</h3>
          <p><strong>{{ order.shipping_first_name || order.billing_first_name }} {{ order.shipping_last_name || order.billing_last_name }}</strong></p>
          <p><strong>{{ order.shipping_address_1 || order.billing_address_1 }}</strong></p>
          <p><strong>{{ order.shipping_city || order.billing_city }}, {{ order.shipping_state || order.billing_state }} {{ order.shipping_postcode || order.billing_postcode }}</strong></p>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      Loading order...
    </div>
  </div>
</template>

<script setup lang="ts">
// definePageMeta({
//   middleware: 'auth'
// })

const { showToast } = useToast()

const route = useRoute()
const orderId = route.params.id as string
const config = useRuntimeConfig()
const isSaving = ref(false)

const order = ref<any>(null)

const form = ref({
  status: 'pending',
  preferred_install_date: '',
  confirmed_install_date: '',
  removal_date: '',
  customer_note: '',
  admin_note: '',
})

const loadOrder = async () => {
  try {
    const res: any = await $fetch(`/orders/${orderId}`, {
      baseURL: config.public.apiBase
    })
    order.value = res

    // Prefill editable form
    form.value = {
      status: res.status || 'pending',
      preferred_install_date: res.preferred_install_date?.substring(0, 10) || '',
      confirmed_install_date: res.confirmed_install_date?.substring(0, 10) || '',
      removal_date: res.removal_date?.substring(0, 10) || '',
      customer_note: res.customer_note || '',
      admin_note: res.admin_note || '',
    }
  } catch (error) {
    console.error('Failed to load order:', error)
  }
}

const saveOrder = async () => {
  if (!order.value) return
  isSaving.value = true

  try {
    await $fetch(`/orders/${orderId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      body: {
        status: form.value.status,
        preferred_install_date: form.value.preferred_install_date || null,
        confirmed_install_date: form.value.confirmed_install_date || null,
        removal_date: form.value.removal_date || null,
        customer_note: form.value.customer_note || null,
        admin_note: form.value.admin_note || null,
      }
    })

    // Refresh local data
    await loadOrder()
    // Optional: showToast('Order updated successfully', 'success')
    showToast('✅ Order updated successfully!', 'success')
  } catch (error: any) {
    console.error(error)
    showToast(error.data?.message || 'Failed to update order!', 'error')
  } finally {
    isSaving.value = false
  }
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(loadOrder)
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.form-section.card, .sidebar-box.card {
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.95rem;
}

.form-control:focus {
  border-color: #F49322;
  outline: none;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.15);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-info strong {
  font-size: 1.05rem;
  color: #1f2937;
}

.item-info small {
  color: #6b7280;
  font-size: 0.9rem;
}

.item-total {
  text-align: right;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0c2340;
}

.status-badge {
  text-transform: capitalize;
  font-weight: 600;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  color: #6b7280;
  pointer-events: none;
}

.status-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 40px;   /* space for the arrow */
  cursor: pointer;
  background: #fff;
}

.status-select:focus {
  border-color: #F49322;
  outline: none;
  box-shadow: 0 0 0 3px rgba(244, 147, 34, 0.15);
}
</style>