<template>
  <div
    v-if="show"
    class="mt-3 mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3"
  >
    <div
      class="flex items-center justify-between text-sm text-slate-600 mb-1.5"
    >
      <span>{{ baseLabel }} (Base)</span>
      <span class="font-semibold"
        >${{ Math.round(basePrice).toLocaleString() }}</span
      >
    </div>

    <div
      v-for="[id, qty] in activeAddons"
      :key="id"
      class="flex items-center justify-between text-sm text-slate-600 mb-1.5"
    >
      <span class="truncate pr-2"
        >{{ addonName(id) }}
        <span class="text-slate-400">× {{ qty }}</span></span
      >
      <span class="font-semibold"
        >${{
          (addonPrice(id) * qty).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}</span
      >
    </div>

    <div v-if="overagePrice > 0" class="flex flex-col mb-1.5">
      <div class="flex items-center justify-between text-sm text-slate-600">
        <span class="truncate pr-2"
          >Overage
          <span class="text-slate-400">({{ overageFt }} ft extra)</span></span
        >
        <span class="font-semibold"
          >${{
            overagePrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</span
        >
      </div>

      <!-- Tiny detail text below overage -->
      <div
        v-if="estimatedFootage && packageIncludedFt"
        class="text-[10px] text-slate-400 mt-0.5 text-right w-full"
      >
        (Home is ~{{ estimatedFootage }} ft · {{ packageIncludedFt }} ft
        included)
      </div>
    </div>

    <div
      class="flex items-center justify-between text-sm font-extrabold text-[#1C2D5B] border-t border-slate-200 pt-1.5 mt-1.5"
    >
      <span>Total</span>
      <span
        >${{
          (basePrice + addonSubtotal + overagePrice).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  baseLabel: string;
  basePrice: number;
  addonQty: Record<string, number>;
  addonProducts: any[];
  addonSubtotal: number;
  overagePrice: number;
  overageFt: number;
  estimatedFootage?: number | null;
  packageIncludedFt?: number | null;
}>();

const show = computed(() => props.addonSubtotal > 0 || props.overagePrice > 0);
const activeAddons = computed(() =>
  Object.entries(props.addonQty).filter(([_, q]) => q > 0),
);
const addonName = (id: string) =>
  props.addonProducts.find((x) => x.id === id)?.name || "Add-on";
const addonPrice = (id: string) =>
  Number(props.addonProducts.find((x) => x.id === id)?.price || 0);
</script>
