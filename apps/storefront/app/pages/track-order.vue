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
          Enter your order number and billing email to see the current status.
        </p>

        <form class="space-y-3" @submit.prevent="trackOrder">
          <input
            v-model="form.order_number"
            type="text"
            placeholder="e.g. FLP-2026-00001"
            required
            class="w-full rounded-[10px] border-2 border-slate-200 px-4 py-3.5 text-base outline-none focus:border-brand-orange"
            @blur="validateField('order_number')"
          />
          <p v-if="validationErrors.order_number" class="text-sm text-red-600">
            {{ validationErrors.order_number }}
          </p>

          <input
            v-model="form.email"
            type="email"
            placeholder="Billing email"
            required
            class="w-full rounded-[10px] border-2 border-slate-200 px-4 py-3.5 text-base outline-none focus:border-brand-orange"
            @blur="validateField('email')"
          />
          <p v-if="validationErrors.email" class="text-sm text-red-600">
            {{ validationErrors.email }}
          </p>

          <CheckoutTurnstileWidget
            ref="turnstileRef"
            :site-key="siteKey"
            :errors="validationErrors"
            :status="turnstileStatus"
            :status-type="turnstileStatusType"
            :status-class="turnstileStatusClass"
            :status-icon="turnstileStatusIcon"
            @success="onTurnstileSuccess"
            @error="onTurnstileError"
            @expired="onTurnstileExpired"
          />

          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full rounded-[10px] bg-brand-orange px-6 py-3.5 font-bold text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
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
useHead({ title: "Track Order" });

import CheckoutTurnstileWidget from "../components/Checkout/TurnstileWidget.vue";

const config = useRuntimeConfig();
const siteKey = config.public.turnstile.siteKey as string;

const turnstileRef = ref<InstanceType<typeof CheckoutTurnstileWidget> | null>(
  null,
);
const isTurnstileVerified = ref(false);
const turnstileToken = ref("");
const turnstileStatus = ref("");
const turnstileStatusType = ref("");

const loading = ref(false);
const error = ref("");
const order = ref<any | null>(null);
const timeline = ref<any[]>([]);
const items = ref<any[]>([]);

const form = ref({
  order_number: "",
  email: "",
});

const validationErrors = ref({
  order_number: "",
  email: "",
  turnstile: "",
});

const isFormValid = computed(() => {
  return (
    Object.values(validationErrors.value).every((e) => e === "") &&
    !!form.value.order_number.trim() &&
    !!form.value.email.trim() &&
    isTurnstileVerified.value &&
    !!turnstileToken.value
  );
});

const turnstileStatusClass = computed(() => {
  switch (turnstileStatusType.value) {
    case "success":
      return "text-green-600";
    case "error":
      return "text-red-600";
    case "warning":
      return "text-yellow-600";
    default:
      return "text-gray-500";
  }
});

const turnstileStatusIcon = computed(() => {
  switch (turnstileStatusType.value) {
    case "success":
      return "fas fa-check-circle";
    case "error":
      return "fas fa-exclamation-circle";
    case "warning":
      return "fas fa-exclamation-triangle";
    default:
      return "fas fa-info-circle";
  }
});

const onTurnstileSuccess = (token: string) => {
  turnstileToken.value = token;
  isTurnstileVerified.value = true;
  turnstileStatus.value = "Verification successful!";
  turnstileStatusType.value = "success";
  validationErrors.value.turnstile = "";
};

const onTurnstileError = () => {
  turnstileToken.value = "";
  isTurnstileVerified.value = false;
  turnstileStatus.value = "Verification failed. Please try again.";
  turnstileStatusType.value = "error";
  validationErrors.value.turnstile =
    "Please complete the security verification";
};

const onTurnstileExpired = () => {
  turnstileToken.value = "";
  isTurnstileVerified.value = false;
  turnstileStatus.value = "Verification expired. Please refresh.";
  turnstileStatusType.value = "warning";
  validationErrors.value.turnstile = "Verification expired. Please try again.";
  turnstileRef.value?.reset();
};

const resetTurnstile = () => {
  turnstileToken.value = "";
  isTurnstileVerified.value = false;
  turnstileStatus.value = "";
  turnstileStatusType.value = "";
  validationErrors.value.turnstile = "";
  turnstileRef.value?.reset();
};

const validateField = (field: "order_number" | "email") => {
  if (field === "order_number") {
    validationErrors.value.order_number = form.value.order_number.trim()
      ? ""
      : "Order number is required";
  }
  if (field === "email") {
    const value = form.value.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) validationErrors.value.email = "Email address is required";
    else if (!emailRegex.test(value))
      validationErrors.value.email = "Please enter a valid email address";
    else validationErrors.value.email = "";
  }
};

const validateAllFields = () => {
  validateField("order_number");
  validateField("email");
  if (!isTurnstileVerified.value || !turnstileToken.value) {
    validationErrors.value.turnstile =
      "Please complete the security verification";
  } else {
    validationErrors.value.turnstile = "";
  }
  return isFormValid.value;
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
};

const formatStatus = (status?: string) =>
  (status || "pending").replaceAll("_", " ");

const statusClass = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "paid":
    case "completed":
    case "installed":
      return "bg-green-100 text-green-700";
    case "cancelled":
    case "refunded":
      return "bg-red-100 text-red-700";
    case "in_progress":
    case "scheduled":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const getStatusColor = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "paid":
    case "completed":
    case "installed":
      return "bg-green-500";
    case "cancelled":
    case "refunded":
      return "bg-red-500";
    case "in_progress":
    case "scheduled":
      return "bg-blue-500";
    default:
      return "bg-amber-500";
  }
};

const firstDate = (value: unknown) => {
  if (Array.isArray(value) && value.length) return value[0] || null;
  if (typeof value === "string") return value;
  return null;
};

const trackOrder = async () => {
  error.value = "";
  order.value = null;
  timeline.value = [];
  items.value = [];

  if (!validateAllFields()) return;

  loading.value = true;
  const capturedToken = turnstileToken.value;

  try {
    const data = (await $fetch("/api/track-order", {
      method: "POST",
      body: {
        order_number: form.value.order_number.trim(),
        email: form.value.email.trim().toLowerCase(),
        turnstile_token: capturedToken,
      },
    })) as { success: boolean; order?: any; error?: string };

    if (!data?.success || !data.order) {
      error.value = data?.error || "Order not found or verification failed.";
      return;
    }

    const found = data.order;
    order.value = {
      ...found,
      preferred_install_date:
        firstDate(found.preferred_install_dates) ||
        found.preferred_install_date,
    };
    timeline.value = found.timeline || [];
    items.value = found.items || [];
  } catch (e: any) {
    error.value =
      e?.data?.message ||
      e?.data?.statusMessage ||
      e?.message ||
      "Order not found or verification failed.";
  } finally {
    loading.value = false;
    resetTurnstile();
  }
};
</script>
