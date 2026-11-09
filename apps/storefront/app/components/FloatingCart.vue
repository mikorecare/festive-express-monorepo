<template>
  <ClientOnly>
    <!-- Floating trigger -->
    <button
      type="button"
      class="fixed z-[999999] flex items-center justify-center bg-[#1C2D5B] rounded-full w-[64px] h-[64px] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 bottom-[20px] right-[20px] top-auto max-lg:top-[16px] max-lg:right-[16px] max-lg:bottom-auto max-sm:top-[14px] max-sm:right-[14px] max-sm:w-[48px] max-sm:h-[48px]"
      :class="{ 'cart-shake': cartBump > 0 }"
      :key="cartBump"
      aria-label="Open cart"
      @click="open = !open"
    >
      <div
        class="relative flex items-center justify-center bg-[#F49321] text-white w-[60px] h-[60px] rounded-full border-2 border-white max-sm:w-[44px] max-sm:h-[44px]"
      >
        <IcNavCart class="w-7 h-7 max-sm:w-5 max-sm:h-5" aria-hidden="true" />

        <span
          class="absolute -top-1 -right-1 z-10 bg-white text-[#1C2D5B] text-[0.7rem] font-extrabold min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-[#1C2D5B] shadow-sm max-sm:min-w-[16px] max-sm:h-[16px] max-sm:text-[0.6rem]"
        >
          {{ displayCount }}
        </span>
      </div>
    </button>

    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1000] bg-black/50"
        @click="open = false"
      />
    </Transition>

    <!-- Side cart panel -->
    <Transition name="slide-cart">
      <aside
        v-if="open"
        class="fixed top-0 right-0 z-[10001] flex h-full w-full max-w-[380px] flex-col bg-white shadow-2xl"
        role="dialog"
        aria-label="Shopping cart"
      >
        <!-- Orange frame: header + items only -->
        <div
          class="flex min-h-0 flex-1 flex-col border-x-[6px] border-t-[6px] border-[#f59e0b]"
        >
          <!-- Header -->
          <div class="relative border-b border-slate-200 px-6 pb-4 pt-6">
            <button
              type="button"
              class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close cart"
              @click="open = false"
            >
              &times;
            </button>
            <h2 class="text-2xl font-bold text-[#f59e0b]">My Cart</h2>
            <p class="mt-1 text-sm text-navy">
              Total items: {{ displayCount }}
            </p>
          </div>

          <!-- Body -->
          <div class="flex flex-1 flex-col overflow-y-auto px-6 py-6">
            <!-- Empty -->
            <div
              v-if="!cartItems.length"
              class="flex flex-1 flex-col items-center justify-center px-4 text-center"
            >
              <NuxtImg
                src="/Images/Festivo/cart-empty.png"
                alt=""
                class="mb-4 h-28 w-auto object-contain"
                width="112"
                height="112"
                loading="lazy"
                format="webp"
                @error="onEmptyImgError"
              />
              <p class="text-base text-slate-600">
                Your cart is empty,<br />
                <NuxtLink
                  to="/packages"
                  class="font-bold text-[#f59e0b] hover:underline underline"
                  @click="open = false"
                >
                  Explore
                </NuxtLink>
                our packages!
              </p>
            </div>

            <!-- Items -->
            <div v-else class="space-y-5">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex flex-col gap-2 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <NuxtImg
                  :src="item.product?.image_url || '/Images/placeholder.png'"
                  :alt="item.product?.name || 'Product image'"
                  class="w-full h-48 rounded-md object-cover bg-slate-100"
                  width="400"
                  height="300"
                  loading="lazy"
                  format="webp"
                  fit="cover"
                  placeholder
                  @error="onImgError"
                />

                <div class="flex flex-col gap-1">
                  <!-- Header: Name and Total -->
                  <div class="flex items-start justify-between">
                    <h3 class="text-xl font-bold uppercase text-[#f59e0b]">
                      {{ item.product?.name || "—" }}
                    </h3>
                    <!-- Styled Total Price -->
                    <p
                      class="shrink-0 font-bold text-[#f59e0b] inline-flex items-baseline"
                    >
                      <span
                        class="text-[0.8rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
                      >
                        $&nbsp;
                      </span>
                      <span
                        class="text-sm font-extrabold leading-none price-text -tracking-[0.04em]"
                      >
                        {{
                          Number(lineTotal(item)).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        }}
                      </span>
                    </p>
                  </div>

                  <!-- Breakdown & Add-ons -->
                  <div
                    class="mt-1 bg-slate-50 p-3 rounded-md border border-slate-200 text-sm"
                  >
                    <!-- Add-ons list -->
                    <div
                      v-if="item.options?.addons?.length"
                      class="mt-2 pt-2 border-t border-slate-200"
                    >
                      <p
                        class="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                      >
                        Add-ons:
                      </p>
                      <div class="space-y-1">
                        <div
                          v-for="addon in item.options.addons"
                          :key="addon.product_id"
                          class="flex justify-between text-xs text-slate-600"
                        >
                          <span>{{ addon.quantity }}x {{ addon.name }}</span>

                          <!-- Styled Add-on Price -->
                          <span class="inline-flex items-baseline">
                            <span
                              class="text-[0.6rem] font-bold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
                            >
                              $&nbsp;
                            </span>
                            <span
                              class="font-bold leading-none price-text -tracking-[0.04em]"
                            >
                              {{
                                Number(
                                  addon.quantity * Number(addon.price),
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              }}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Overage row (display only) -->
                    <div
                      v-if="Number(item.options?.overage?.amount || 0) > 0"
                      class="mt-2 pt-2 border-t border-slate-200"
                    >
                      <p
                        class="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                      >
                        Overage:
                      </p>
                      <div class="flex justify-between text-xs text-slate-600">
                        <span>{{ item.options?.overage?.feet }} ft extra</span>
                        <span class="inline-flex items-baseline">
                          <span
                            class="text-[0.6rem] font-bold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-0.5 translate-y-[-0.1em]"
                          >
                            $&nbsp;
                          </span>
                          <span
                            class="font-bold leading-none price-text -tracking-[0.04em]"
                          >
                            {{
                              Number(
                                item.options?.overage?.amount || 0,
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between mt-2">
                    <!-- Quantity Selector -->
                    <div
                      class="flex items-center border border-slate-300 rounded-md"
                    >
                      <button
                        type="button"
                        class="px-2 py-0.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        :disabled="item.quantity <= 1"
                        @click="updateQty(item.id, item.quantity - 1)"
                      >
                        -
                      </button>
                      <span class="px-3 text-sm font-semibold text-slate-800">
                        {{ item.quantity }}
                      </span>
                      <button
                        type="button"
                        class="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                        @click="updateQty(item.id, item.quantity + 1)"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      class="text-xs text-red-500 hover:underline"
                      @click="removeItem(item.id)"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-[#1C2D5B] px-6 pb-6 pt-5 text-white">
          <div class="mb-5 flex items-center justify-between text-base">
            <span>Subtotal:</span>
            <!-- Styled Subtotal -->
            <span class="font-bold text-xl inline-flex items-baseline">
              <span
                class="text-[1rem] font-extrabold leading-none price-text -tracking-[0.04em] inline-block scale-[0.75] origin-bottom -mr-1 translate-y-[-0.1em]"
              >
                $&nbsp;
              </span>
              <span
                class="font-black text-2xl leading-none price-text -tracking-[0.04em]"
              >
                {{
                  Number(displayTotal).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </span>
            </span>
          </div>
          <NuxtLink
            v-if="cartItems.length"
            to="/checkout"
            class="group btn-3d-glossy btn-3d-glossy-orange relative block w-full overflow-hidden rounded-full bg-[#F49321] py-3.5 text-center text-base font-bold text-white transition hover:bg-[#e67a00] before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full before:skew-x-[-20deg] before:transition-transform before:duration-1000 before:ease-out hover:before:translate-x-full"
            @click="open = false"
          >
            <span class="relative z-10">Checkout</span>
          </NuxtLink>
          <button
            v-else
            type="button"
            disabled
            class="block w-full cursor-not-allowed rounded-full bg-slate-400 py-3.5 text-center text-base font-bold text-white"
          >
            Checkout
          </button>
        </div>
      </aside>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import IcNavCart from "~/components/Icons/IcNavCart.vue";

const cart = useCart();
const open = ref(false);

const cartItems = computed(() => cart.cartItems.value);

const cartBump = useState("cart-bump", () => 0);

const displayTotal = computed(() =>
  Number(cart.cartTotal?.value || 0).toFixed(2),
);
const displayCount = computed(() => Number(cart.cartCount?.value || 0));

// item.price already includes base + add-ons + overage (server-side),
// so we just multiply by quantity. No double-counting.
const lineTotal = (item: any) =>
  (Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2);

const onImgError = (payload: string | Event) => {
  if (typeof payload === "string") {
    console.error("Image load error:", payload);
    return;
  }

  const img = payload.target as HTMLImageElement;
  if (img) {
    img.src = "/Images/placeholder.png";
  }
};

const onEmptyImgError = (payload: string | Event) => {
  if (typeof payload === "string") {
    console.error("Empty image load error:", payload);
    return;
  }

  const img = payload.target as HTMLImageElement;
  if (img) {
    img.src = "/Images/placeholder.png";
  }
};

const removeItem = async (id: string | number) => {
  await cart.removeFromCart?.(id);
  await cart.loadCart?.();
};

const updateQty = async (id: string | number, newQty: number) => {
  if (newQty < 1) {
    await removeItem(id);
    return;
  }
  await cart.updateCartItemQty?.(id, newQty);
  await cart.loadCart?.();
};

watch(open, (v) => {
  if (!import.meta.client) return;
  document.body.style.overflow = v ? "hidden" : "";
});

onMounted(async () => {
  await cart.loadCart?.();
  const onFocus = () => cart.loadCart?.();
  window.addEventListener("focus", onFocus);
  onUnmounted(() => {
    window.removeEventListener("focus", onFocus);
    document.body.style.overflow = "";
  });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-cart-enter-active,
.slide-cart-leave-active {
  transition: transform 0.3s ease;
}
.slide-cart-enter-from,
.slide-cart-leave-to {
  transform: translateX(100%);
}

.cart-shake {
  animation: cart-shake 0.5s ease-in-out;
}

@keyframes cart-shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(-15deg);
  }
  40% {
    transform: rotate(15deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  80% {
    transform: rotate(10deg);
  }
}
</style>
