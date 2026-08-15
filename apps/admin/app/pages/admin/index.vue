<template>
  <div class="flex-1 p-8 bg-slate-50">
    <!-- Welcome -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-navy mb-2">
        Welcome to FLP-Express Admin
      </h1>
      <h3 class="text-slate-600 font-medium">
        Dashboard Overview • {{ today }}
      </h3>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5">
        <div
          class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-3xl"
        >
          <ShoppingBagIcon class="h-7 w-7 text-navy" />
        </div>
        <div>
          <div class="text-3xl font-bold text-navy">
            {{ stats.totalOrders }}
          </div>
          <div class="text-slate-600 text-sm">Total Orders</div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5">
        <div
          class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-3xl"
        >
          <CurrencyDollarIcon class="h-7 w-7 text-green-600" />
        </div>
        <div>
          <div class="text-3xl font-bold text-navy">
            ${{ stats.monthlyRevenue.toLocaleString() }}
          </div>
          <div class="text-slate-600 text-sm">Revenue This Month</div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5">
        <div
          class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-3xl"
        >
          <CubeIcon class="h-7 w-7 text-orange-500" />
        </div>
        <div>
          <div class="text-3xl font-bold text-navy">
            {{ stats.activeProducts }}
          </div>
          <div class="text-slate-600 text-sm">Active Products</div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md flex items-center gap-5">
        <div
          class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-3xl"
        >
          <ClockIcon class="h-7 w-7 text-yellow-600" />
        </div>
        <div>
          <div class="text-3xl font-bold text-navy">
            {{ stats.pendingOrders }}
          </div>
          <div class="text-slate-600 text-sm">Pending Orders</div>
        </div>
      </div>
    </div>

    <!-- Analytics -->
    <div class="mb-10">
      <h3 class="text-xl font-semibold text-navy mb-4">Analytics Overview</h3>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          class="lg:col-span-2 bg-white h-72 rounded-2xl shadow-md flex items-center justify-center border-2 border-dashed border-slate-300"
        >
          <p class="text-slate-500 font-medium">Sales Trend (Last 30 Days)</p>
        </div>
        <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <div
            class="flex justify-between items-center border-b border-slate-100 pb-3"
          >
            <span class="text-slate-600">Top Product</span>
            <span class="font-semibold text-navy">C9 Roofline Kit</span>
          </div>
          <div
            class="flex justify-between items-center border-b border-slate-100 pb-3"
          >
            <span class="text-slate-600">Conversion Rate</span>
            <span class="font-semibold text-navy">68%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-600">Avg. Order Value</span>
            <span class="font-semibold text-navy">$312</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-2xl shadow-md p-6">
      <h3 class="text-xl font-semibold text-navy mb-4">Recent Orders</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-navy text-white">
              <th class="text-left py-3 px-4 rounded-l-lg">Order #</th>
              <th class="text-left py-3 px-4">Customer</th>
              <th class="text-left py-3 px-4">Date</th>
              <th class="text-left py-3 px-4">Status</th>
              <th class="text-left py-3 px-4 rounded-r-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in recentOrders"
              :key="order.id"
              class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td class="py-3 px-4 font-semibold text-navy">
                {{ order.order_number }}
              </td>
              <td class="py-3 px-4 text-slate-700">
                {{ order.billing_first_name }} {{ order.billing_last_name }}
              </td>
              <td class="py-3 px-4 text-slate-600">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                    order.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.status === 'on-hold'
                              ? 'bg-indigo-100 text-indigo-800'
                              : order.status === 'refunded'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-800',
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="py-3 px-4 font-semibold text-navy">
                ${{ Number(order.total).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";

const config = useRuntimeConfig();

const stats = ref({
  totalOrders: 0,
  monthlyRevenue: 0,
  activeProducts: 0,
  pendingOrders: 0,
});

const recentOrders = ref<
  Array<{
    id: number;
    order_number: string;
    billing_first_name?: string;
    billing_last_name?: string;
    billing_email?: string;
    total: number;
    status: string;
    created_at: string;
  }>
>([]);

const loadDashboard = async () => {
  try {
    const ordersRes: any = await $fetch("/orders", {
      baseURL: config.public.apiBase,
    });

    const orders: any[] = Array.isArray(ordersRes.data)
      ? ordersRes.data
      : Array.isArray(ordersRes)
        ? ordersRes
        : [];

    stats.value.totalOrders = ordersRes.total || ordersRes.length || 0;
    stats.value.pendingOrders = Array.isArray(ordersRes.data)
      ? ordersRes.data.filter((o: any) => o.status === "pending").length
      : 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    stats.value.monthlyRevenue = orders
      .filter((o: any) => {
        if (!o.created_at) return false;
        if (["cancelled", "refunded"].includes(o.status)) return false;
        const d = new Date(o.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

    const productsRes: any = await $fetch("/products", {
      baseURL: config.public.apiBase,
    });
    const products = Array.isArray(productsRes.data)
      ? productsRes.data
      : Array.isArray(productsRes)
        ? productsRes
        : [];
    stats.value.activeProducts = products.length;

    recentOrders.value = ordersRes.data ? ordersRes.data.slice(0, 5) : [];
  } catch (error) {
    console.error("Failed to load dashboard:", error);
  }
};

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

onMounted(loadDashboard);
</script>
