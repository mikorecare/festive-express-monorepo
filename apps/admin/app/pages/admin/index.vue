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

const supabase = useSupabaseClient();

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

type OrderItemRow = {
  product_name: string | null;
  quantity: number | null;
};

const stats = ref({
  totalOrders: 0,
  monthlyRevenue: 0,
  activeProducts: 0,
  pendingOrders: 0,
});

const analytics = ref({
  topProduct: "—",
  conversionRate: 0,
  avgOrderValue: 0,
});

const salesTrend = ref<Array<{ label: string; total: number }>>([]);

const recentOrders = ref<DashboardOrder[]>([]);

const maxTrend = computed(() =>
  Math.max(1, ...salesTrend.value.map((d) => d.total)),
);

const buildSalesTrend = (orders: DashboardOrder[]) => {
  const days = 30;
  const map = new Map<string, number>();
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);
    map.set(d.toISOString().slice(0, 10), 0);
  }

  orders.forEach((o) => {
    if (!o.created_at) return;
    if (["cancelled", "refunded"].includes(String(o.status))) return;
    const key = new Date(o.created_at).toISOString().slice(0, 10);
    if (map.has(key)) {
      map.set(key, (map.get(key) || 0) + (Number(o.total) || 0));
    }
  });

  salesTrend.value = [...map.entries()].map(([key, total]) => ({
    label: new Date(key + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    total,
  }));
};

const loadDashboard = async () => {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        "id, order_number, billing_first_name, billing_last_name, billing_email, total, status, created_at",
      )
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;

    const list: DashboardOrder[] = (orders || []) as DashboardOrder[];

    stats.value.totalOrders = list.length;
    stats.value.pendingOrders = list.filter(
      (o) => o.status === "pending",
    ).length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    stats.value.monthlyRevenue = list
      .filter((o) => {
        if (!o.created_at) return false;
        if (["cancelled", "refunded"].includes(String(o.status))) return false;
        const d = new Date(o.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    recentOrders.value = list.slice(0, 5);

    const paid = list.filter(
      (o) => !["cancelled", "refunded"].includes(String(o.status)),
    );

    analytics.value.avgOrderValue = paid.length
      ? paid.reduce((s, o) => s + (Number(o.total) || 0), 0) / paid.length
      : 0;

    const completed = list.filter((o) => o.status === "completed").length;
    analytics.value.conversionRate = list.length
      ? Math.round((completed / list.length) * 100)
      : 0;

    buildSalesTrend(list);

    const { data: items } = await supabase
      .from("order_items")
      .select("product_name, quantity");

    const rows = (items || []) as OrderItemRow[];
    if (rows.length) {
      const counts: Record<string, number> = {};
      rows.forEach((row) => {
        const name = row.product_name || "Unknown";
        counts[name] = (counts[name] || 0) + (Number(row.quantity) || 1);
      });
      analytics.value.topProduct =
        Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    }

    const { count: productCount, error: productsError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);

    if (productsError) {
      console.error(productsError);
      stats.value.activeProducts = 0;
    } else {
      stats.value.activeProducts = productCount || 0;
    }
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
