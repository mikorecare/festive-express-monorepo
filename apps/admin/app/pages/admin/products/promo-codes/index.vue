<template>
  <div class="p-6 space-y-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-navy">Promo Codes</h1>
        <p class="text-slate-500 text-sm">Create and manage discount codes</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: form -->
      <div class="lg:col-span-5">
        <div
          class="inline-block px-3 py-1.5 bg-navy text-white rounded-md text-xs font-medium hover:bg-brand-orange hover:text-navy transition-colors no-underline"
        >
          <h2 class="text-lg font-bold text-navy mb-5">
            {{ editingId ? "Edit Promo Code" : "Add Promo Code" }}
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-navy mb-2">
                Code <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.code"
                type="text"
                class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                :class="{ 'border-red-500': errors.code }"
                placeholder="e.g. EARLYBIRD15"
                @blur="form.code = form.code.trim().toUpperCase()"
              />
              <p v-if="errors.code" class="text-red-500 text-xs mt-1">
                {{ errors.code }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-navy mb-2"
                >Description</label
              >
              <input
                v-model="form.description"
                type="text"
                class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="Internal note (optional)"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-navy mb-2">
                  Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.discount_type"
                  class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-2">
                  Value <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.discount_value"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  :class="{ 'border-red-500': errors.discount_value }"
                  :placeholder="form.discount_type === 'percent' ? '15' : '100'"
                />
                <p
                  v-if="errors.discount_value"
                  class="text-red-500 text-xs mt-1"
                >
                  {{ errors.discount_value }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-navy mb-2"
                >Applies to</label
              >
              <select
                v-model="form.applies_to"
                class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              >
                <option value="all">All</option>
                <option value="packages">Packages only</option>
                <option value="products">Products only</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-navy mb-2"
                  >Min order ($)</label
                >
                <input
                  v-model.number="form.min_order_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-2"
                  >Max discount ($)</label
                >
                <input
                  v-model.number="form.max_discount_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-navy mb-2"
                >Usage limit</label
              >
              <input
                v-model.number="form.usage_limit"
                type="number"
                min="1"
                class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="Blank = unlimited"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-navy mb-2"
                  >Starts at</label
                >
                <input
                  v-model="form.starts_at"
                  type="date"
                  class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-navy mb-2"
                  >Expires at</label
                >
                <input
                  v-model="form.expires_at"
                  type="date"
                  class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  :class="{ 'border-red-500': errors.expires_at }"
                />
                <p v-if="errors.expires_at" class="text-red-500 text-xs mt-1">
                  {{ errors.expires_at }}
                </p>
              </div>
            </div>

            <label
              class="flex items-center gap-2 cursor-pointer text-sm text-navy"
            >
              <input
                v-model="form.is_active"
                type="checkbox"
                class="w-auto rounded border-slate-300"
              />
              Active
            </label>

            <div class="flex gap-3 pt-2">
              <button
                type="button"
                class="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-60 transition"
                :disabled="isSaving"
                @click="savePromoCode"
              >
                {{
                  isSaving
                    ? "Saving..."
                    : editingId
                      ? "Update"
                      : "Add Promo Code"
                }}
              </button>
              <button
                v-if="editingId"
                type="button"
                class="px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                @click="cancelEdit"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: list -->
      <div class="lg:col-span-7">
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-slate-100">
            <h3 class="font-bold text-navy text-sm">
              Existing Codes ({{ promoCodes.length }})
            </h3>
          </div>

          <div
            v-if="!promoCodes.length"
            class="p-10 text-center text-slate-400 text-sm"
          >
            No promo codes yet.
          </div>

          <div
            v-for="(promo, index) in promoCodes"
            :key="promo.id"
            class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100"
            :class="index % 2 === 0 ? 'bg-slate-50' : 'bg-white'"
          >
            <div class="min-w-0">
              <strong class="text-navy text-sm font-mono">{{
                promo.code
              }}</strong>
              <p class="text-slate-500 text-xs mt-0.5">
                {{ formatDiscount(promo) }}
                <span v-if="promo.description"> · {{ promo.description }}</span>
              </p>
              <p class="text-slate-400 text-xs mt-0.5">
                Used {{ promo.used_count || 0
                }}{{ promo.usage_limit ? ` / ${promo.usage_limit}` : "" }}
                <span v-if="promo.starts_at || promo.expires_at">
                  · {{ formatDateRange(promo) }}
                </span>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="
                  promo.is_active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                "
              >
                {{ promo.is_active ? "Active" : "Inactive" }}
              </span>
              <button
                type="button"
                class="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-navy hover:bg-slate-200 transition"
                @click="editPromo(promo)"
              >
                Edit
              </button>
              <button
                type="button"
                class="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                @click="confirmDelete(promo)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h3 class="text-lg font-bold text-navy mb-2">Delete promo code?</h3>
        <p class="text-slate-600 text-sm mb-6 font-mono">
          {{ promoToDelete?.code }}
        </p>
        <div class="flex gap-3 justify-end">
          <button
            type="button"
            class="px-4 py-2 bg-white border border-slate-200 text-navy rounded-lg text-sm font-medium hover:bg-slate-50 transition"
            @click="showModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            @click="executeDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  applies_to: string;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

const supabase = useSupabaseClient();
const promoCodes = ref<PromoCode[]>([]);
const isSaving = ref(false);
const editingId = ref<string | null>(null);
const errors = ref<Record<string, string>>({});
const showModal = ref(false);
const promoToDelete = ref<PromoCode | null>(null);

const emptyForm = () => ({
  code: "",
  description: "",
  discount_type: "percent" as "percent" | "fixed",
  discount_value: null as number | null,
  applies_to: "all",
  min_order_amount: null as number | null,
  max_discount_amount: null as number | null,
  usage_limit: null as number | null,
  starts_at: "",
  expires_at: "",
  is_active: true,
});

const form = ref(emptyForm());

const toDateInput = (value: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const formatDiscount = (promo: PromoCode) => {
  if (promo.discount_type === "percent") {
    return `${promo.discount_value}% off`;
  }
  return `$${Number(promo.discount_value).toFixed(2)} off`;
};

const formatDateRange = (promo: PromoCode) => {
  const start = promo.starts_at ? toDateInput(promo.starts_at) : null;
  const end = promo.expires_at ? toDateInput(promo.expires_at) : null;
  if (start && end) return `${start} → ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return "";
};

const loadPromoCodes = async () => {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    promoCodes.value = [];
    return;
  }
  promoCodes.value = (data as PromoCode[]) || [];
};

const validate = () => {
  errors.value = {};
  if (!form.value.code.trim()) {
    errors.value.code = "Code is required";
  }
  if (form.value.discount_value == null || form.value.discount_value <= 0) {
    errors.value.discount_value = "Value must be greater than 0";
  } else if (
    form.value.discount_type === "percent" &&
    form.value.discount_value > 100
  ) {
    errors.value.discount_value = "Percent cannot exceed 100";
  }
  if (
    form.value.starts_at &&
    form.value.expires_at &&
    form.value.expires_at < form.value.starts_at
  ) {
    errors.value.expires_at = "Expires must be on or after start date";
  }
  return Object.keys(errors.value).length === 0;
};

const savePromoCode = async () => {
  if (!validate()) return;
  isSaving.value = true;

  const payload = {
    code: form.value.code.trim().toUpperCase(),
    description: form.value.description?.trim() || null,
    discount_type: form.value.discount_type,
    discount_value: form.value.discount_value,
    applies_to: form.value.applies_to,
    min_order_amount: form.value.min_order_amount || null,
    max_discount_amount: form.value.max_discount_amount || null,
    usage_limit: form.value.usage_limit || null,
    starts_at: form.value.starts_at || null,
    expires_at: form.value.expires_at || null,
    is_active: form.value.is_active,
    updated_at: new Date().toISOString(),
  };

  try {
    if (editingId.value) {
      const { error } = await supabase
        .from("promo_codes")
        .update(payload as never)
        .eq("id", editingId.value);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("promo_codes")
        .insert(payload as never);
      if (error) throw error;
    }
    cancelEdit();
    await loadPromoCodes();
  } catch (e: any) {
    console.error(e);
    if (e?.code === "23505" || e?.message?.includes("duplicate")) {
      errors.value.code = "This code already exists";
    }
  } finally {
    isSaving.value = false;
  }
};

const editPromo = (promo: PromoCode) => {
  editingId.value = promo.id;
  form.value = {
    code: promo.code,
    description: promo.description || "",
    discount_type: promo.discount_type,
    discount_value: Number(promo.discount_value),
    applies_to: promo.applies_to || "all",
    min_order_amount:
      promo.min_order_amount != null ? Number(promo.min_order_amount) : null,
    max_discount_amount:
      promo.max_discount_amount != null
        ? Number(promo.max_discount_amount)
        : null,
    usage_limit: promo.usage_limit,
    starts_at: toDateInput(promo.starts_at),
    expires_at: toDateInput(promo.expires_at),
    is_active: promo.is_active,
  };
  errors.value = {};
};

const cancelEdit = () => {
  editingId.value = null;
  form.value = emptyForm();
  errors.value = {};
};

const confirmDelete = (promo: PromoCode) => {
  promoToDelete.value = promo;
  showModal.value = true;
};

const executeDelete = async () => {
  if (!promoToDelete.value) return;
  const id = promoToDelete.value.id;

  const { error } = await supabase.from("promo_codes").delete().eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  showModal.value = false;
  promoToDelete.value = null;
  if (editingId.value === id) cancelEdit();
  await loadPromoCodes();
};

onMounted(loadPromoCodes);
</script>
