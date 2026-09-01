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
              <!-- <strong class="text-navy"
                >${{ Number(order.total).toFixed(2) }}</strong
              > -->
              <span class="text-navy"
                ><strong
                  >${{
                    Number(order.total || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}</strong
                ></span
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
              <strong class="text-navy">
                {{
                  order.customer_confirmed || order.confirmed_at
                    ? formatDate(order.confirmed_install_date) ||
                      "Not scheduled"
                    : "Not scheduled"
                }}
              </strong>
            </div>
          </div>

          <button
            v-if="showConfirmButton"
            type="button"
            class="mt-4 w-full rounded-[10px] px-6 py-3.5 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            :class="
              confirmEnabled ? 'bg-navy hover:bg-navy/90' : 'bg-slate-400'
            "
            :disabled="!confirmEnabled"
            @click="confirmOrder"
          >
            {{
              confirmedStillActive
                ? "Confirmed"
                : confirming
                  ? "Confirming..."
                  : confirmWindowOpen
                    ? "Confirm Date"
                    : confirmOpensAt
                      ? `Opens ${confirmOpensAt}`
                      : "Confirm Date"
            }}
          </button>

          <div
            class="mb-7 mt-7 rounded-xl border border-slate-100 bg-slate-50/80 p-6"
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
            <div class="space-y-5">
              <div
                v-for="(item, i) in items"
                :key="i"
                class="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
              >
                <img
                  :src="itemImage(item)"
                  :alt="item.product_name || item.name || 'Item'"
                  class="mb-3 w-full rounded-xl object-cover bg-slate-100 aspect-[16/10]"
                  @error="onImgError"
                />
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="font-medium text-navy">
                      {{ item.product_name || item.name }}
                    </div>
                    <div class="text-xs text-slate-500">
                      Qty {{ item.quantity }}
                      <span v-if="item.is_package"> · Package</span>
                    </div>
                  </div>
                  <strong class="flex-shrink-0 text-navy">
                    ${{
                      Number(item.total ?? item.price * item.quantity).toFixed(
                        2,
                      )
                    }}
                  </strong>
                </div>
              </div>
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

    console.log(items.value);
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

const FALLBACK_IMG = "/Images/placeholder.png";
const itemImage = (item: any) => {
  const raw = item?.image_url || item?.image || item?.options?.image_url;
  return raw ? getImageUrl(raw) : FALLBACK_IMG;
};

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return "/Images/placeholder.png";
  if (url.startsWith("http")) return url;

  const path = url
    .replace(/^\//, "")
    .replace(/^products\//i, "")
    .replace(/^Products\//i, "");

  const supabaseUrl =
    (config.public.supabaseUrl as string) ||
    (config.public.supabase as any)?.url ||
    "";

  const bucket = (config.public.storageBucket as string) || "Products";
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

const onImgError = (e: Event) => {
  const el = e.target as HTMLImageElement;
  if (el.src.endsWith(FALLBACK_IMG)) return;
  el.src = FALLBACK_IMG;
};

const confirming = ref(false);

// const alreadyConfirmed = computed(() =>
//   Boolean(order.value?.customer_confirmed || order.value?.confirmed_at),
// );

const isCompleted = computed(() => {
  const status = String(order.value?.status || "").toLowerCase();
  const install = String(order.value?.install_status || "").toLowerCase();
  return (
    status === "completed" || install === "completed" || install === "installed"
  );
});

const MS_48H = 48 * 60 * 60 * 1000;

const startOfDay = (value: Date) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

const toYmd = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const preferredDates = computed(() => {
  const list = order.value?.preferred_install_dates;
  return (Array.isArray(list) ? list : [])
    .map((d: string) => startOfDay(new Date(d)))
    .filter((d: Date) => !Number.isNaN(d.getTime()))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());
});

const confirmedDate = computed(() => {
  const raw = order.value?.confirmed_install_date;
  if (!raw) return null;
  const d = startOfDay(new Date(raw));
  return Number.isNaN(d.getTime()) ? null : d;
});

const confirmedStillActive = computed(() => {
  if (!confirmedDate.value) return false;
  return confirmedDate.value.getTime() >= startOfDay(new Date()).getTime();
});

const nextPreferredDate = computed(() => {
  const today = startOfDay(new Date()).getTime();
  const after = confirmedDate.value ? confirmedDate.value.getTime() : today - 1;
  return (
    preferredDates.value.find(
      (d: Date) => d.getTime() > after && d.getTime() >= today,
    ) || null
  );
});

const confirmWindowOpen = computed(() => {
  if (!nextPreferredDate.value) return false;
  if (!confirmedDate.value) return true;

  const start = nextPreferredDate.value.getTime() - MS_48H;
  const end = nextPreferredDate.value.getTime() + 24 * 60 * 60 * 1000;
  const now = Date.now();
  return now >= start && now < end;
});

const alreadyConfirmed = computed(() => confirmedStillActive.value);

const showConfirmButton = computed(() => {
  if (!order.value || isCompleted.value) return false;
  if (confirmedStillActive.value) return true;
  return Boolean(nextPreferredDate.value);
});

const confirmEnabled = computed(
  () =>
    !confirmedStillActive.value &&
    confirmWindowOpen.value &&
    !confirming.value &&
    !!turnstileToken.value,
);

const confirmOpensAt = computed(() => {
  if (!nextPreferredDate.value || confirmWindowOpen.value) return "";
  return new Date(nextPreferredDate.value.getTime() - MS_48H).toLocaleString();
});

const confirmOrder = async () => {
  if (!order.value || alreadyConfirmed.value) return;

  if (!turnstileToken.value) {
    error.value = "Complete the security check again to confirm.";
    return;
  }

  confirming.value = true;
  error.value = "";

  try {
    const data = (await $fetch("/api/track-order/confirm", {
      method: "POST",
      body: {
        order_number: form.value.order_number.trim(),
        email: form.value.email.trim().toLowerCase(),
        turnstile_token: turnstileToken.value,
      },
    })) as {
      success: boolean;
      already_confirmed?: boolean;
      error?: string;
      order?: any;
    };

    if (data.success || data.already_confirmed) {
      order.value = {
        ...order.value,
        ...data.order,
        customer_confirmed: true,
        confirmed_at: data.order?.confirmed_at || new Date().toISOString(),
        status: data.order?.status || "confirmed",
        preferred_install_dates:
          data.order?.preferred_install_dates ||
          order.value.preferred_install_dates,
        confirmed_install_date: data.order?.confirmed_install_date || null,
      };
      timeline.value = [
        ...timeline.value,
        {
          status: "confirmed",
          notes: `Customer confirmed install date ${
            data.order?.confirmed_install_date || ""
          }`.trim(),
          created_at: order.value.confirmed_at,
        },
      ];
    } else {
      error.value = data.error || "Could not confirm order.";
    }
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "Could not confirm order.";
  } finally {
    confirming.value = false;
    resetTurnstile();
  }
};

const nextInstallDate = (dates?: string[] | string | null): string | null => {
  const list = Array.isArray(dates) ? dates : dates ? [dates] : [];
  const valid = list
    .map((d) => {
      const dt = new Date(d);
      return Number.isNaN(dt.getTime()) ? null : dt;
    })
    .filter((d): d is Date => d !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  if (!valid.length) return null;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcoming = valid.find((d) => d.getTime() >= startOfToday.getTime());
  return upcoming ? upcoming.toISOString() : null;
};
</script>
