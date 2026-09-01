<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
    >
      <div>
        <h1 v-if="order" class="text-2xl font-bold text-navy">
          Order #{{ order.order_number }}
        </h1>
        <p v-if="order" class="text-sm text-gray-500">
          Placed on {{ formatDate(order.created_at) }}
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-sm transition"
          @click="$router.back()"
        >
          Back to Orders
        </button>
        <button
          v-if="order"
          class="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSaving"
          @click="saveOrder"
        >
          {{ isSaving ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </div>

    <div v-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Column (2/3) - Scrollable -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Order Summary -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="text-lg font-bold text-navy mb-4">Order Summary</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1"
                >Status</label
              >
              <div class="relative">
                <select
                  v-model="form.status"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white pr-10 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                >
                  <option
                    v-for="option in getAvailableStatusOptions()"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  >▾</span
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1"
                >Payment Status</label
              >
              <div class="relative">
                <select
                  v-model="form.payment_status"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white pr-10 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  >▾</span
                >
              </div>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1"
              >Install Status</label
            >
            <div class="relative">
              <select
                v-model="form.install_status"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white pr-10 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                >▾</span
              >
            </div>
          </div>

          <!-- Order Items List -->
          <div class="mt-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Items</h4>
            <div
              v-for="(item, index) in order.items"
              :key="index"
              class="flex justify-between items-start py-2 border-b border-gray-100 last:border-0"
            >
              <div>
                <span class="text-gray-800">{{ item.product_name }}</span>
                <span class="text-sm text-gray-500 ml-2"
                  >× {{ item.quantity }}</span
                >
                <span
                  v-if="item.is_package"
                  class="ml-2 px-2 py-0.5 bg-brand-orange text-white text-xs font-semibold rounded-full"
                  >Package</span
                >
              </div>
              <div class="text-right font-medium text-navy">
                ${{ (item.quantity * Number(item.price)).toFixed(2) }}
              </div>
            </div>
          </div>

          <!-- Promo Code Applied -->
          <div
            v-if="order.promo_codes"
            class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div class="flex justify-between items-center">
              <div>
                <span class="text-sm font-semibold text-green-700"
                  >Promo Code Applied</span
                >
                <span
                  class="ml-2 px-2 py-0.5 bg-green-200 text-green-800 text-xs font-bold rounded"
                >
                  {{ order.promo_codes.code }}
                </span>
              </div>
              <span class="text-sm font-semibold text-green-700">
                -${{ Number(order.discount_amount || 0).toFixed(2) }}
              </span>
            </div>
            <div
              v-if="order.promo_codes.description"
              class="text-xs text-green-600 mt-1"
            >
              {{ order.promo_codes.description }}
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div class="flex justify-between py-1">
              <span class="text-gray-600">Subtotal</span>
              <strong class="text-navy"
                >${{ Number(order.subtotal).toFixed(2) }}</strong
              >
            </div>
            <div v-if="order.promo_codes" class="flex justify-between py-1">
              <span class="text-gray-600"
                >Discount ({{ order.promo_codes.code }})</span
              >
              <strong class="text-green-600"
                >-${{ Number(order.discount_amount || 0).toFixed(2) }}</strong
              >
            </div>
            <div class="flex justify-between py-1">
              <span class="text-gray-600">Tax</span>
              <strong class="text-navy"
                >${{ Number(order.tax_total).toFixed(2) }}</strong
              >
            </div>
            <div
              class="flex justify-between py-2 border-t-2 border-brand-orange"
            >
              <span class="text-lg font-bold text-navy">Total</span>
              <strong class="text-lg font-bold text-brand-orange"
                >${{ Number(order.total).toFixed(2) }}</strong
              >
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">Payment Method</span>
              <span class="text-navy">{{ order.payment_method || "—" }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-gray-600">Transaction ID</span>
              <span class="text-sm font-mono text-gray-500">{{
                order.transaction_id || "—"
              }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-gray-600">Approval Code</span>
              <span class="text-sm font-mono text-gray-500">{{
                order.approval_code || "—"
              }}</span>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Preferred Install Dates</label
            >
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(date, index) in order.preferred_install_dates"
                :key="index"
                class="px-3 py-1 bg-orange-50 text-brand-orange rounded-full text-sm"
              >
                {{ formatShortDate(date) }}
              </span>
              <span
                v-if="!order.preferred_install_dates?.length"
                class="text-sm text-gray-400"
                >Not set</span
              >
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Confirmed Installation Date
            </label>
            <span
              v-if="order.confirmed_install_date"
              class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
            >
              {{ formatShortDate(order.confirmed_install_date) }}
            </span>
            <span v-else class="text-sm text-gray-400">Not confirmed yet</span>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Removal Dates</label
            >
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(date, index) in order.removal_dates"
                :key="index"
                class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {{ formatShortDate(date) }}
              </span>
              <span
                v-if="!order.removal_dates?.length"
                class="text-sm text-gray-400"
                >Not set</span
              >
            </div>
          </div>
        </div>

        <!-- Customer Note -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="text-lg font-bold text-navy mb-4">Customer Note</h3>
          <textarea
            v-model="form.customer_note"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y"
            rows="4"
            placeholder="Customer special instructions..."
          ></textarea>
        </div>

        <!-- Timeline -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h3 class="text-lg font-bold text-navy mb-4">Order Timeline</h3>
          <div v-if="order.timeline && order.timeline.length" class="space-y-3">
            <div
              v-for="(entry, index) in order.timeline"
              :key="index"
              class="flex gap-4 pb-3 border-b border-gray-100 last:border-0"
            >
              <div
                class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                :class="getStatusColor(entry.status)"
              ></div>
              <div>
                <div class="font-medium text-gray-800 capitalize">
                  {{ entry.status }}
                </div>
                <div class="text-sm text-gray-400">
                  {{ formatDate(entry.created_at) }}
                </div>
                <div v-if="entry.notes" class="text-sm text-gray-600 mt-0.5">
                  {{ entry.notes }}
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">No timeline entries yet.</p>
        </div>
      </div>

      <!-- Sidebar (1/3) - Sticky -->
      <div class="lg:col-span-1 space-y-6">
        <div class="sticky top-6 space-y-6">
          <!-- Customer Information -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-navy mb-4">
              Customer Information
            </h3>
            <div class="space-y-2">
              <p>
                <strong class="text-navy"
                  >{{ order.billing_first_name }}
                  {{ order.billing_last_name }}</strong
                >
              </p>
              <p class="text-gray-600">{{ order.billing_email }}</p>
              <p class="text-gray-600">{{ order.billing_phone }}</p>
            </div>
          </div>

          <!-- Billing Address -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-navy mb-4">Billing Address</h3>
            <div class="space-y-0.5 text-gray-700">
              <p>
                {{ order.billing_first_name }} {{ order.billing_last_name }}
              </p>
              <p>{{ order.billing_address }}</p>
              <p>{{ order.billing_postcode }}</p>
            </div>
          </div>

          <!-- Installation Address -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-navy mb-4">
              Installation Address
            </h3>
            <div class="space-y-0.5 text-gray-700">
              <p>{{ order.shipping_address }}</p>
              <p>{{ order.shipping_postcode }}</p>
            </div>
          </div>

          <!-- Order Meta -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-navy mb-4">Order Meta</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Order ID</span>
                <span class="font-mono text-gray-700">{{ order.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Created</span>
                <span class="text-gray-700">{{
                  formatDate(order.created_at)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Last Updated</span>
                <span class="text-gray-700">{{
                  formatDate(order.updated_at)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center items-center py-20">
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-gray-500">Loading order...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { showToast } = useToast();
const route = useRoute();
const orderId = route.params.id as string;
const isSaving = ref(false);

const order = ref<any>(null);
const originalStatus = ref<string>("pending");

const form = ref({
  status: "pending",
  payment_status: "pending",
  install_status: "scheduled",
  customer_note: "",
});

// Status rules based on current/original status
const statusRules: Record<string, string[]> = {
  pending: ["pending", "confirmed", "completed", "cancelled"],
  confirmed: ["confirmed", "completed", "cancelled"],
  completed: ["completed"],
  cancelled: ["cancelled"],
};

const getAvailableStatusOptions = () => {
  const currentStatus =
    originalStatus.value || order.value?.status || "pending";
  const allowedStatuses = statusRules[currentStatus] || statusRules.pending;

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return allowedStatuses!.map((value) => ({
    value,
    label: statusLabels[value] || value,
  }));
};

const loadOrder = async () => {
  try {
    const res: any = await $fetch(`/api/orders/${orderId}`);
    order.value = res.order || res;

    // Store the original status from the database
    originalStatus.value = order.value.status || "pending";

    form.value = {
      status: order.value.status || "pending",
      payment_status: order.value.payment_status || "pending",
      install_status: order.value.install_status || "scheduled",
      customer_note: order.value.customer_note || "",
    };
  } catch (error) {
    console.error("Failed to load order:", error);
    showToast("Failed to load order", "error");
  }
};

const saveOrder = async () => {
  if (!order.value) return;
  isSaving.value = true;

  try {
    await $fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      body: {
        status: form.value.status,
        payment_status: form.value.payment_status,
        install_status: form.value.install_status,
        customer_note: form.value.customer_note || null,
      },
    });

    await loadOrder();
    showToast("Order updated successfully!", "success");
  } catch (error: any) {
    console.error(error);
    showToast(error.data?.message || "Failed to update order!", "error");
  } finally {
    isSaving.value = false;
  }
};

const formatDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShortDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-amber-400",
    confirmed: "bg-blue-400",
    scheduled: "bg-indigo-400",
    completed: "bg-emerald-400",
    cancelled: "bg-rose-400",
    refunded: "bg-gray-400",
    paid: "bg-emerald-400",
    failed: "bg-rose-400",
  };
  return colors[status] || "bg-gray-400";
};

onMounted(loadOrder);
</script>
