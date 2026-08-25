<template>
  <div class="min-h-[60vh] bg-slate-50 py-12 px-5">
    <div class="mx-auto max-w-xl">
      <div
        class="rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] max-sm:p-6"
      >
        <h1 class="mb-2 text-center text-2xl font-bold text-navy">
          Track Your Order
        </h1>
        <p class="mb-7 text-center text-slate-500">
          Enter your order number to see the current status.
        </p>

        <form
          class="flex flex-wrap gap-3 max-sm:flex-col"
          @submit.prevent="trackOrder"
        >
          <input
            v-model="orderNumber"
            type="text"
            placeholder="e.g. FLP-2026-00001"
            required
            class="min-w-[200px] flex-1 rounded-[10px] border-2 border-slate-200 px-4 py-3.5 text-base outline-none focus:border-brand-orange"
          />
          <button
            type="submit"
            :disabled="loading"
            class="rounded-[10px] bg-brand-orange px-6 py-3.5 font-bold text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ loading ? "Searching..." : "Track Order" }}
          </button>
        </form>

        <p v-if="error" class="mt-4 text-center text-red-600">
          {{ error }}
        </p>

        <div v-if="order" class="mt-8 border-t border-slate-100 pt-7">
          <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-xl font-bold text-navy">
              Order {{ order.order_number }}
            </h2>
            <span
              class="rounded-full px-3.5 py-1.5 text-sm font-bold capitalize"
              :class="statusClass(order.status)"
            >
              {{ formatStatus(order.status) }}
            </span>
          </div>

          <div class="mb-7 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div>
              <small class="block text-xs text-slate-500">Placed</small>
              <strong class="text-navy">{{
                formatDate(order.created_at)
              }}</strong>
            </div>
            <div>
              <small class="block text-xs text-slate-500">Total</small>
              <strong class="text-navy"
                >${{ Number(order.total).toFixed(2) }}</strong
              >
            </div>
            <div>
              <small class="block text-xs text-slate-500"
                >Preferred install</small
              >
              <strong class="text-navy">{{
                formatDate(order.preferred_install_date) || "—"
              }}</strong>
            </div>
            <div>
              <small class="block text-xs text-slate-500"
                >Confirmed install</small
              >
              <strong class="text-navy">{{
                formatDate(order.confirmed_install_date) || "Not scheduled"
              }}</strong>
            </div>
          </div>

          <!-- Timeline -->
          <div
            class="mb-7 rounded-xl border border-slate-100 bg-slate-50/80 p-6"
          >
            <h3 class="mb-4 text-lg font-bold text-navy">Order Timeline</h3>

            <div v-if="timeline.length" class="space-y-3">
              <div
                v-for="(entry, index) in timeline"
                :key="entry.id || index"
                class="flex gap-4 border-b border-gray-100 pb-3 last:border-0"
              >
                <div
                  class="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  :class="getStatusColor(entry.status)"
                />
                <div>
                  <div class="font-medium capitalize text-gray-800">
                    {{ formatStatus(entry.status) }}
                  </div>
                  <div class="text-sm text-gray-400">
                    {{ formatDateTime(entry.created_at) }}
                  </div>
                  <div
                    v-if="entry.notes || entry.description"
                    class="mt-0.5 text-sm text-gray-600"
                  >
                    {{ entry.notes || entry.description }}
                  </div>
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-gray-400">No timeline entries yet.</p>
          </div>

          <div v-if="items.length">
            <h3 class="mb-3 font-bold text-navy">Items</h3>
            <div
              v-for="(item, i) in items"
              :key="i"
              class="flex justify-between border-b border-slate-100 py-2.5 text-sm"
            >
              <span
                >{{ item.product_name || item.name }} ×
                {{ item.quantity }}</span
              >
              <strong
                >${{
                  Number(item.total ?? item.price * item.quantity).toFixed(2)
                }}</strong
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Track Your Order - Festive Express" });

const supabase = useSupabaseClient();
const route = useRoute();

const orderNumber = ref((route.query.order as string) || "");
const loading = ref(false);
const error = ref("");
const order = ref<Record<string, any> | null>(null);
const timeline = ref<Record<string, any>[]>([]);
const items = ref<Record<string, any>[]>([]);

const fallbackSteps = [
  { key: "pending", label: "Order received" },
  { key: "processing", label: "Processing" },
  { key: "scheduled", label: "Install scheduled" },
  { key: "completed", label: "Completed" },
];

const statusRank: Record<string, number> = {
  pending: 1,
  processing: 2,
  scheduled: 3,
  completed: 4,
  cancelled: 0,
};

const trackOrder = async () => {
  error.value = "";
  order.value = null;
  timeline.value = [];
  items.value = [];

  const num = orderNumber.value.trim();
  if (!num) return;

  loading.value = true;
  try {
    // Public / unrestricted view preferred for guest tracking
    const { data: orderRow, error: orderErr } = await supabase
      .from("orders_with_promo")
      .select("*")
      .eq("order_number", num)
      .maybeSingle();

    if (orderErr) throw orderErr;
    if (!orderRow) {
      error.value = "Order not found. Check the number and try again.";
      return;
    }

    const row = orderRow as Record<string, any>;
    order.value = row;

    const { data: timelineRows, error: tlErr } = await supabase
      .from("order_timeline")
      .select("*")
      .eq("order_id", row.id)
      .order("created_at", { ascending: true });

    if (tlErr) console.error(tlErr);
    timeline.value = timelineRows || [];

    // Optional: only if order_items exists + RLS allows read by order_id
    const { data: itemRows, error: itemsErr } = await supabase
      .from("order_items")
      .select("product_name, name, quantity, price, total, options")
      .eq("order_id", row.id);

    if (!itemsErr && itemRows) items.value = itemRows;
  } catch (e: any) {
    console.error(e);
    error.value =
      e?.message || "Order not found. Check the number and try again.";
  } finally {
    loading.value = false;
  }
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-amber-400",
    confirmed: "bg-blue-400",
    processing: "bg-blue-400",
    scheduled: "bg-indigo-400",
    completed: "bg-emerald-400",
    cancelled: "bg-rose-400",
    refunded: "bg-gray-400",
    paid: "bg-emerald-400",
    failed: "bg-rose-400",
  };
  return colors[status] || "bg-gray-400";
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (s: string) =>
  (s || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (d?: string | null) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isAtLeast = (step: string) => {
  if (!order.value?.status) return false;
  const current = statusRank[order.value.status] ?? 0;
  const target = statusRank[step] ?? 0;
  return current >= target && order.value.status !== "cancelled";
};

const statusClass = (s: string) => {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    processing: "bg-blue-100 text-blue-800",
    scheduled: "bg-indigo-100 text-indigo-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return map[s] || "bg-slate-200 text-slate-700";
};

onMounted(() => {
  if (orderNumber.value) trackOrder();
});
</script>
