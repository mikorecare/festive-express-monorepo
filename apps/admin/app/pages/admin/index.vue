<template>
  <div class="admin-page">

    <main class="admin-main">
      <div class="welcome">
        <h1 class="text-3xl font-bold mb-5">Welcome to FLP-Express Admin</h1>
        <h3>Dashboard Overview • {{ today }}</h3>
      </div>

      <!-- 1. Overview Cards -->
      <div class="overview-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalOrders }}</div>
            <div class="stat-label">Total Orders</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <div class="stat-number">${{ stats.monthlyRevenue.toLocaleString() }}</div>
            <div class="stat-label">Revenue This Month</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.activeProducts }}</div>
            <div class="stat-label">Active Products</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.pendingOrders }}</div>
            <div class="stat-label">Pending Orders</div>
          </div>
        </div>
      </div>

      <!-- 2. Analytics -->
      <div class="analytics-section">
        <h3>Analytics Overview</h3>
        <div class="analytics-grid">
          <div class="chart-placeholder">
            <p>Sales Trend (Last 30 Days)</p>
            <!-- You can add Chart.js or real chart later -->
          </div>
          <div class="stats-small">
            <div>Top Product: C9 Roofline Kit</div>
            <div>Conversion Rate: 68%</div>
            <div>Avg. Order Value: $312</div>
          </div>
        </div>
      </div>

      <!-- 3. Recent Orders -->
      <div class="recent-orders">
        <h3>Recent Orders</h3>
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td><strong>{{ order.order_number }}</strong></td>
              <td>{{ order.billing_first_name }} {{ order.billing_last_name }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>
                <span :class="['status-badge', order.status]">{{ order.status }}</span>
              </td>
              <td>${{ Number(order.total).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
// definePageMeta({
//   middleware: 'auth'
// })
const config = useRuntimeConfig()

const stats = ref({
  totalOrders: 0,
  monthlyRevenue: 0,
  activeProducts: 0,
  pendingOrders: 0
})

const recentOrders = ref<Array<{
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
}>>([])

const loadDashboard = async () => {
  try {
    // Get Orders stats
    const ordersRes: any = await $fetch('/orders', {
      baseURL: config.public.apiBase
    })

    // Define orders here
    const orders: any[] = Array.isArray(ordersRes.data)
      ? ordersRes.data
      : Array.isArray(ordersRes)
        ? ordersRes
        : []
    
    stats.value.totalOrders = ordersRes.total || ordersRes.length || 0
    stats.value.pendingOrders = Array.isArray(ordersRes.data) 
      ? ordersRes.data.filter((o: any) => o.status === 'pending').length 
      : 0

    // Monthly revenue – current month only
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    stats.value.monthlyRevenue = orders
      .filter((o: any) => {
        if (!o.created_at) return false
        if (['cancelled', 'refunded'].includes(o.status)) return false
        const d = new Date(o.created_at)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0)

    // Products
    const productsRes: any = await $fetch('/products', {
      baseURL: config.public.apiBase
    })
    const products = Array.isArray(productsRes.data)
      ? productsRes.data
      : Array.isArray(productsRes)
        ? productsRes
        : []
    stats.value.activeProducts = products.length

    // Recent Orders
    recentOrders.value = ordersRes.data ? ordersRes.data.slice(0, 5) : []
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  }
}

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

onMounted(loadDashboard)
</script>

<style scoped>
.admin-page {
  display: flex;
}

.admin-main {
  flex: 1;
  padding: 30px;
  background: #f8fafc;
}

.welcome {
  margin-bottom: 40px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  display: flex;
  gap: 20px;
  align-items: center;
}

.stat-icon {
  font-size: 2.8rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 50%;
}

.stat-number {
  font-size: 2.4rem;
  font-weight: 700;
  color: #0c2340;
}

.stat-label {
  color: #666;
  font-size: 0.95rem;
}

.analytics-section {
  margin-bottom: 50px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}

.chart-placeholder {
  background: white;
  height: 300px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
}

.recent-orders {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.recent-orders table {
  width: 100%;
  border-collapse: collapse;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending { background: #fef3c7; color: #92400e; }
.status-badge.processing { background: #dbeafe; color: #1e40af; }
.status-badge.completed { background: #d1fae5; color: #065f46; }
.status-badge.cancelled { background: #fee2e2; color: #991b1b; }
.status-badge.on-hold { background: #e0e7ff; color: #3730a3; }
.status-badge.refunded { background: #f3e8ff; color: #6b21a8; }
</style>