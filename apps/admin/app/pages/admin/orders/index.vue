<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Orders Management</h1>
        <p class="text-slate-500 text-sm">View and manage customer orders</p>
      </div>
      <button
        class="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
      >
        <ArrowDownTrayIcon class="h-4 w-4" />
        Export Orders
      </button>
    </div>

    <!-- FestiveTable -->
    <FestiveTable
      :columns="columns"
      :data="orders"
      :loading="isLoading"
      :server-pagination="true"
      :total-items="totalItems"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      search-placeholder="Search by order number or customer..."
      :search-fields="[
        'order_number',
        'billing_first_name',
        'billing_last_name',
        'billing_email',
      ]"
      row-key="id"
      @page-change="onPageChange"
      @search="onSearch"
    >
      <template #filters>
        <select
          v-model="statusFilter"
          @change="applyFilters"
          class="w-full sm:w-48 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-brand-orange focus:outline-none focus:bg-white transition-all"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </template>

      <template #cell-order_number="{ item }">
        <span class="font-semibold text-navy">#{{ item.order_number }}</span>
      </template>

      <template #cell-customer="{ item }">
        <div>
          <div class="font-medium text-slate-900">
            {{ item.billing_first_name }} {{ item.billing_last_name }}
          </div>
          <div class="text-xs text-slate-400">{{ item.billing_email }}</div>
        </div>
      </template>

      <template #cell-status="{ item }">
        <span
          :class="{
            'bg-amber-100 text-amber-700': item.status === 'pending',
            'bg-blue-100 text-blue-700': item.status === 'processing',
            'bg-indigo-100 text-indigo-700': item.status === 'on-hold',
            'bg-emerald-100 text-emerald-700': item.status === 'completed',
            'bg-rose-100 text-rose-700': item.status === 'cancelled',
            'bg-purple-100 text-purple-700': item.status === 'refunded',
            'bg-slate-100 text-slate-600': ![
              'pending',
              'processing',
              'on-hold',
              'completed',
              'cancelled',
              'refunded',
            ].includes(item.status),
          }"
          class="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
        >
          {{ item.status }}
        </span>
      </template>

      <template #cell-install_date="{ item }">
        <span class="text-sm text-slate-600">
          {{
            item.confirmed_install_date
              ? formatDate(item.confirmed_install_date)
              : item.preferred_install_date
                ? formatDate(item.preferred_install_date) + " (preferred)"
                : "—"
          }}
        </span>
      </template>

      <template #cell-total="{ item }">
        <span class="font-semibold text-navy"
          >${{ Number(item.total).toFixed(2) }}</span
        >
      </template>

      <template #cell-actions="{ item }">
        <div class="space-x-2">
          <button
            @click="viewOrder(item.id)"
            class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs font-medium transition-colors"
          >
            View
          </button>
          <button
            v-if="isSuperAdmin"
            @click="showDeleteConfirm(item)"
            class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md text-xs font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </template>
    </FestiveTable>

    <!-- Delete Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center"
          >
            <ExclamationTriangleIcon class="h-5 w-5 text-rose-600" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">Confirm Delete</h3>
        </div>
        <p class="text-sm text-slate-600 mb-2">
          Are you sure you want to delete Order
          <strong class="text-slate-900"
            >#{{ orderToDelete?.order_number }}</strong
          >?
        </p>
        <p class="text-sm text-rose-600 mb-4">This action cannot be undone.</p>

        <div class="space-y-2 mb-4">
          <label class="block text-xs font-medium text-slate-500"
            >Type <strong class="text-rose-600">DELETE</strong> to
            confirm:</label
          >
          <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="DELETE"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-center font-mono text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <div class="flex items-center justify-end gap-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            :disabled="deleteConfirmText !== 'DELETE'"
            class="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Yes, Delete Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";
import type { Column } from "~/components/FestiveTable.vue";

const { getOrders, deleteOrder: apiDeleteOrder } = useOrders();
const { showToast } = useToast();
const supabase = useSupabaseClient();

const columns: Column[] = [
  { key: "order_number", label: "Order ID", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "created_at", label: "Date", type: "date", sortable: true },
  { key: "total", label: "Total", align: "right" },
  { key: "status", label: "Status" },
  { key: "install_date", label: "Install Date" },
  { key: "actions", label: "Actions", align: "right" },
];

const orders = ref<any[]>([]);
const isLoading = ref(true);
const statusFilter = ref("");
const searchQuery = ref("");
const currentUser = ref<{ role?: string } | null>(null);
const isSuperAdmin = computed(() => currentUser.value?.role === "super_admin");
const showModal = ref(false);
const orderToDelete = ref<any>(null);
const deleteConfirmText = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

const loadOrders = async () => {
  isLoading.value = true;
  try {
    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Status filter
    if (statusFilter.value) {
      query = query.eq("status", statusFilter.value);
    }

    // Search
    if (searchQuery.value) {
      query = query.or(
        `order_number.ilike.%${searchQuery.value}%,` +
          `billing_first_name.ilike.%${searchQuery.value}%,` +
          `billing_last_name.ilike.%${searchQuery.value}%,` +
          `billing_email.ilike.%${searchQuery.value}%`,
      );
    }

    // Pagination
    const from = (currentPage.value - 1) * itemsPerPage.value;
    const to = from + itemsPerPage.value - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    orders.value = data || [];
    totalItems.value = count || 0;
  } catch (error) {
    console.error("Failed to load orders:", error);
    orders.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const onSearch = (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1;
  loadOrders();
};

const applyFilters = () => {
  currentPage.value = 1;
  loadOrders();
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  loadOrders();
};

const formatDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const viewOrder = (id: number) => {
  navigateTo(`/admin/orders/${id}`);
};

const showDeleteConfirm = (order: any) => {
  if (!isSuperAdmin.value) return;
  orderToDelete.value = order;
  deleteConfirmText.value = "";
  showModal.value = true;
};

const cancelDelete = () => {
  showModal.value = false;
  orderToDelete.value = null;
  deleteConfirmText.value = "";
};

const executeDelete = async () => {
  if (!orderToDelete.value || !isSuperAdmin.value) return;
  if (deleteConfirmText.value !== "DELETE") return;

  try {
    await apiDeleteOrder(orderToDelete.value.id);
    showToast(
      `Order #${orderToDelete.value.order_number} deleted successfully!`,
    );
    showModal.value = false;
    orderToDelete.value = null;
    await loadOrders();
  } catch (error: any) {
    console.error(error);
    showToast(error?.data?.message || "Failed to delete order", "error");
  }
};

onMounted(async () => {
  try {
    const saved = localStorage.getItem("user");
    if (saved) currentUser.value = JSON.parse(saved);
  } catch {
    currentUser.value = null;
  }
  await loadOrders();
});
</script>
