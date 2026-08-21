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

          <ul class="mb-7 grid gap-2.5">
            <li
              class="rounded-lg px-3.5 py-2.5 font-semibold"
              :class="
                isAtLeast('pending')
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              "
            >
              Order received
            </li>
            <li
              class="rounded-lg px-3.5 py-2.5 font-semibold"
              :class="
                isAtLeast('processing')
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              "
            >
              Processing
            </li>
            <li
              class="rounded-lg px-3.5 py-2.5 font-semibold"
              :class="
                isAtLeast('scheduled')
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              "
            >
              Install scheduled
            </li>
            <li
              class="rounded-lg px-3.5 py-2.5 font-semibold"
              :class="
                isAtLeast('completed')
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              "
            >
              Completed
            </li>
          </ul>

          <div v-if="order.items?.length">
            <h3 class="mb-3 font-bold text-navy">Items</h3>
            <div
              v-for="(item, i) in order.items"
              :key="i"
              class="flex justify-between border-b border-slate-100 py-2.5 text-sm"
            >
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <strong>${{ Number(item.total).toFixed(2) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Track Your Order - Festive Lighting Pros Express" });

const config = useRuntimeConfig();
const route = useRoute();

const orderNumber = ref((route.query.order as string) || "");
const loading = ref(false);
const error = ref("");
const order = ref<any>(null);

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
  const num = orderNumber.value.trim();
  if (!num) return;

  loading.value = true;
  try {
    const res = await $fetch(`/orders/track/${encodeURIComponent(num)}`, {
      baseURL: config.public.apiBase,
    });
    order.value = res;
  } catch (e: any) {
    error.value =
      e?.data?.message || "Order not found. Check the number and try again.";
  } finally {
    loading.value = false;
  }
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
