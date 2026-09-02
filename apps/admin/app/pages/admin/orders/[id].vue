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
      <div class="flex gap-3 flex-wrap">
        <button
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-sm transition"
          @click="$router.back()"
        >
          Back to Orders
        </button>

        <!-- Refund Button -->
        <button
          v-if="canRefund"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isRefunding || !canRefund"
          @click="openRefundModal"
        >
          <span v-if="isRefunding" class="inline-flex items-center gap-2">
            <span
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            Processing...
          </span>
          <span v-else>Refund Order</span>
        </button>

        <button
          v-if="
            order && order.status !== 'cancelled' && order.status !== 'refunded'
          "
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
                  :disabled="
                    form.status === 'cancelled' || form.status === 'refunded'
                  "
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
              <div
                class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
              >
                <span
                  :class="{
                    'text-emerald-600 font-semibold':
                      form.payment_status === 'paid',
                    'text-amber-600 font-semibold':
                      form.payment_status === 'pending',
                    'text-rose-600 font-semibold':
                      form.payment_status === 'failed',
                    'text-gray-600 font-semibold':
                      form.payment_status === 'refunded',
                  }"
                >
                  {{
                    form.payment_status.charAt(0).toUpperCase() +
                    form.payment_status.slice(1)
                  }}
                </span>
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
                :disabled="
                  form.status === 'cancelled' || form.status === 'refunded'
                "
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
                  >x {{ item.quantity }}</span
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
            :disabled="
              form.status === 'cancelled' || form.status === 'refunded'
            "
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
              <div v-if="order.refunded_at" class="flex justify-between">
                <span class="text-gray-500">Refunded</span>
                <span class="text-gray-700">{{
                  formatDate(order.refunded_at)
                }}</span>
              </div>
              <div v-if="order.refund_amount" class="flex justify-between">
                <span class="text-gray-500">Refund Amount</span>
                <span class="text-red-600 font-semibold"
                  >${{ Number(order.refund_amount).toFixed(2) }}</span
                >
              </div>
              <div
                v-if="order.refund_transaction_id"
                class="flex justify-between"
              >
                <span class="text-gray-500">Refund Transaction</span>
                <span class="font-mono text-gray-500 text-xs">{{
                  order.refund_transaction_id
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

    <!-- Refund Modal -->
    <div
      v-if="showRefundModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeRefundModal"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <h3 class="text-xl font-bold text-navy mb-2">Process Refund</h3>
        <p class="text-sm text-gray-500 mb-4">
          Order #{{ order?.order_number }} - Transaction:
          {{ order?.transaction_id }}
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Refund Amount
            </label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                >$</span
              >
              <input
                v-model.number="refundAmount"
                type="number"
                step="0.01"
                min="0.01"
                :max="order?.total || 0"
                class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p class="text-xs text-gray-400 mt-1">
              Max: ${{ Number(order?.total || 0).toFixed(2) }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Refund Reason
            </label>
            <select
              v-model="refundReason"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            >
              <option value="customer_request">Customer Request</option>
              <option value="duplicate">Duplicate Order</option>
              <option value="fraudulent">Fraudulent Transaction</option>
              <option value="item_unavailable">Item Unavailable</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              v-model="refundNotes"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-y"
              rows="2"
              placeholder="Additional notes..."
            ></textarea>
          </div>
        </div>

        <div class="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-sm transition"
            @click="closeRefundModal"
          >
            Cancel
          </button>
          <button
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="
              !canRefund ||
              isRefunding ||
              refundAmount <= 0 ||
              refundAmount > (order?.total || 0)
            "
            @click="processRefund"
          >
            <span v-if="isRefunding" class="inline-flex items-center gap-2">
              <span
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              Processing...
            </span>
            <span v-else>Confirm Refund</span>
          </button>
        </div>

        <p v-if="refundError" class="text-red-600 text-sm mt-3">
          {{ refundError }}
        </p>
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

// Refund state
const isRefunding = ref(false);
const showRefundModal = ref(false);
const refundAmount = ref(0);
const refundReason = ref("customer_request");
const refundNotes = ref("");
const refundError = ref("");

// Status rules based on current/original status
const statusRules: Record<string, string[]> = {
  pending: ["pending", "confirmed", "completed", "cancelled"],
  confirmed: ["confirmed", "completed", "cancelled"],
  completed: ["completed"],
  cancelled: ["cancelled"],
  refunded: ["refunded"],
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
    refunded: "Refunded",
  };

  return allowedStatuses!.map((value) => ({
    value,
    label: statusLabels[value] || value,
  }));
};

// Check if refund is possible
const canRefund = computed(() => {
  if (!order.value) return false;
  return (
    order.value.payment_status === "paid" &&
    order.value.transaction_id &&
    order.value.status !== "refunded" &&
    order.value.status !== "cancelled"
  );
});

// Open refund modal
const openRefundModal = () => {
  refundAmount.value = Number(order.value?.total || 0);
  refundReason.value = "customer_request";
  refundNotes.value = "";
  refundError.value = "";
  showRefundModal.value = true;
};

// Close refund modal
const closeRefundModal = () => {
  if (isRefunding.value) return;
  showRefundModal.value = false;
  refundAmount.value = 0;
  refundError.value = "";
};

// Process refund
const processRefund = async () => {
  if (!order.value || !order.value.transaction_id) {
    refundError.value = "No transaction ID found for this order.";
    return;
  }

  if (refundAmount.value <= 0) {
    refundError.value = "Please enter a valid refund amount.";
    return;
  }

  if (refundAmount.value > Number(order.value.total)) {
    refundError.value = `Refund amount cannot exceed $${Number(order.value.total).toFixed(2)}.`;
    return;
  }

  isRefunding.value = true;
  refundError.value = "";

  try {
    const result = await $fetch<{ success: boolean; error?: string }>(
      "/api/orders/refund",
      {
        method: "POST",
        body: {
          orderId: order.value.id,
          transactionId: order.value.transaction_id,
          amount: refundAmount.value,
          reason: refundReason.value,
          notes: refundNotes.value,
        },
      },
    );

    if (result.success) {
      showToast(
        `Refund of $${refundAmount.value.toFixed(2)} processed successfully!`,
        "success",
      );
      await loadOrder();
      closeRefundModal();
    } else {
      refundError.value = result.error || "Refund failed. Please try again.";
    }
  } catch (error: any) {
    console.error("Refund error:", error);
    refundError.value =
      error.data?.message || "Refund failed. Please try again.";
  } finally {
    isRefunding.value = false;
  }
};

const loadOrder = async () => {
  try {
    const res: any = await $fetch(`/api/orders/${orderId}`);
    order.value = res.order || res;

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
