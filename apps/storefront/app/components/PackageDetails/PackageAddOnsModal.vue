<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="extras-title"
        @click.self="$emit('close')"
      >
        <div
          class="w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div
            class="flex section-gloss items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 shrink-0 bg-[#1C2D5B]"
          >
            <h2
              id="extras-title"
              class="text-base font-extrabold text-white uppercase tracking-wider"
            >
              Add-ons
            </h2>
            <button
              type="button"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              aria-label="Close"
              @click="$emit('close')"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-4 py-2">
            <div v-if="categories.length">
              <div
                v-for="cat in categories"
                :key="cat.key"
                class="mb-4 last:mb-0"
              >
                <div class="flex items-center gap-2 mb-2 mt-2 px-1">
                  <NuxtImg
                    v-if="cat.image_url"
                    :src="cat.image_url"
                    :alt="cat.image_alt || cat.label"
                    width="24"
                    height="24"
                    fit="contain"
                    loading="lazy"
                    class="w-6 h-6 object-contain opacity-70"
                  />
                  <p
                    class="text-xs font-black text-slate-400 uppercase tracking-widest"
                  >
                    {{ cat.label }}
                  </p>
                </div>
                <ul class="space-y-1" role="list">
                  <li
                    v-for="p in productsByCategory(cat.key)"
                    :key="p.id"
                    class="flex items-center justify-between gap-3 px-2 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-slate-800 leading-tight">
                        {{ p.name }}
                        <span
                          v-if="
                            p.category === 'wreath' && bundledRibbonFor(p.id)
                          "
                          class="text-[0.65rem] font-medium text-slate-400 block mt-0.5"
                          >+ {{ bundledRibbonFor(p.id)!.name }}</span
                        >
                      </p>
                      <p class="text-xs font-semibold text-[#F49321] mt-0.5">
                        ${{ Number(p.price).toFixed(2) }}
                      </p>
                    </div>
                    <div
                      class="flex items-center gap-1 shrink-0 bg-white border border-slate-200 rounded-full p-0.5 shadow-sm"
                    >
                      <button
                        type="button"
                        class="w-7 h-7 rounded-full text-slate-500 hover:bg-slate-100 flex items-center justify-center active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        :disabled="(addonQty[p.id] || 0) <= 0"
                        @click="$emit('decrement', p.id)"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                        >
                          <path d="M5 12h14" />
                        </svg>
                      </button>
                      <span
                        class="w-6 text-center text-xs font-bold text-[#1C2D5B] tabular-nums"
                        >{{ addonQty[p.id] || 0 }}</span
                      >
                      <button
                        type="button"
                        class="w-7 h-7 rounded-full text-white flex items-center justify-center active:scale-95 shadow-sm transition-colors"
                        :class="
                          (addonQty[p.id] || 0) > 0
                            ? 'bg-[#F49321] hover:bg-[#e0851a]'
                            : 'bg-[#1C2D5B] hover:bg-[#F49321]'
                        "
                        @click="$emit('increment', p.id)"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                  </li>
                  <li
                    v-if="!productsByCategory(cat.key).length"
                    class="px-3 py-2 text-xs text-slate-400 italic"
                  >
                    No options available
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="shrink-0 border-t border-slate-200 px-4 py-3 bg-slate-50">
            <div
              v-if="addonSubtotal > 0"
              class="flex items-center justify-between text-sm font-bold text-[#1C2D5B] mb-2 px-1"
            >
              <span>Add-ons subtotal</span>
              <span>${{ addonSubtotal.toFixed(2) }}</span>
            </div>
            <button
              type="button"
              class="w-full btn-3d-glossy relative overflow-hidden inline-flex items-center justify-center bg-[#1C2D5B] hover:bg-[#F49321] text-white font-extrabold text-sm uppercase tracking-wide py-2.5 rounded-full transition-colors"
              @click="$emit('close')"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  categories: any[];
  addonQty: Record<string, number>;
  addonSubtotal: number;
  productsByCategory: (key: string) => any[];
  bundledRibbonFor: (id: string) => any;
}>();
defineEmits<{
  close: [];
  increment: [string];
  decrement: [string];
}>();
</script>
