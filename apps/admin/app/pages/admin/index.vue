<template>
  <div class="flex-1 p-8 bg-slate-50">
    <!-- Welcome -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-navy mb-2">
        Welcome to Festive Express Admin
      </h1>
      <h3 class="text-sm text-slate-500 font-medium">
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
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <p class="text-slate-500 font-medium mb-4">
            Sales Trend (Last 30 Days)
          </p>
          <div class="flex items-end gap-1 h-48">
            <div
              v-for="day in salesTrend"
              :key="day.label"
              class="flex-1 flex flex-col justify-end items-center h-full"
              :title="`${day.label}: $${day.total.toFixed(0)}`"
            >
              <div
                class="w-full max-w-[10px] rounded-t bg-[#F49321]"
                :style="{ height: `${(day.total / maxTrend) * 100}%` }"
              />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <div
            class="flex justify-between items-center border-b border-slate-100 pb-3"
          >
            <span class="text-slate-600">Top Product</span>
            <span class="font-semibold text-navy text-right">{{
              analytics.topProduct
            }}</span>
          </div>
          <div
            class="flex justify-between items-center border-b border-slate-100 pb-3"
          >
            <span class="text-slate-600">Completed Rate</span>
            <span class="font-semibold text-navy"
              >{{ analytics.conversionRate }}%</span
            >
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-600">Avg. Order Value</span>
            <span class="font-semibold text-navy">
              ${{ analytics.avgOrderValue.toFixed(0) }}
            </span>
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
                ${{
                  Number(order.total || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
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

type DashboardOrder = {
  id: number | string;
  order_number: string;
  billing_first_name?: string | null;
  billing_last_name?: string | null;
  billing_email?: string | null;
  total: number | string | null;
  status: string | null;
  created_at: string | null;
};

interface DashboardStats {
  totalOrders: number;
  monthlyRevenue: number;
  activeProducts: number;
  pendingOrders: number;
}

interface DashboardAnalytics {
  topProduct: string;
  conversionRate: number;
  avgOrderValue: number;
}

interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  analytics: DashboardAnalytics;
  recentOrders: DashboardOrder[];
  salesTrend: Array<{ label: string; total: number }>;
  error?: string;
}

const stats = ref<DashboardStats>({
  totalOrders: 0,
  monthlyRevenue: 0,
  activeProducts: 0,
  pendingOrders: 0,
});

const analytics = ref<DashboardAnalytics>({
  topProduct: "—",
  conversionRate: 0,
  avgOrderValue: 0,
});

const salesTrend = ref<Array<{ label: string; total: number }>>([]);
const recentOrders = ref<DashboardOrder[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const maxTrend = computed(() =>
  Math.max(1, ...salesTrend.value.map((d) => d.total)),
);

const loadDashboard = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await $fetch<DashboardResponse>("/api/dashboard");

    if (response.success) {
      stats.value = response.stats;
      analytics.value = response.analytics;
      recentOrders.value = response.recentOrders || [];
      salesTrend.value = response.salesTrend || [];
    } else {
      error.value = response.error || "Failed to load dashboard data";
      console.error("Dashboard error:", response.error);
    }
  } catch (err) {
    console.error("Failed to load dashboard:", err);
    error.value =
      err instanceof Error ? err.message : "An unexpected error occurred";
  } finally {
    isLoading.value = false;
  }
};

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(loadDashboard);
</script>
