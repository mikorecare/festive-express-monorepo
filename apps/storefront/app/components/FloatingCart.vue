<template>
  <ClientOnly>
    <!-- Floating trigger -->
    <button
      type="button"
      class="fixed bottom-[100px] right-[20px] z-[999] flex items-center justify-center bg-[#172a50] border-[3px] border-[#F49321] rounded-full w-[60px] h-[60px] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] cursor-pointer max-sm:bottom-[90px]"
      :class="{ 'cart-shake': cartBump > 0 }"
      :key="cartBump"
      aria-label="Open cart"
      @click="open = true"
    >
      <div
        class="relative flex items-center justify-center bg-[#F49321] text-white w-[54px] h-[54px] rounded-full"
      >
        <ShoppingCartIcon class="w-7 h-7" aria-hidden="true" />
        <span
          class="absolute -top-1 -right-1 z-10 bg-white text-[#172a50] text-[0.8rem] font-extrabold w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-[#F49321]"
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
              <img
                src="/Images/Festivo/cart-empty.png"
                alt=""
                class="mb-4 h-28 w-auto object-contain"
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
                class="flex flex-col gap-2"
              >
                <img
                  :src="getImageUrl(item.product?.image_url)"
                  :alt="item.product?.name || ''"
                  class="w-full h-48 rounded-md object-cover bg-slate-100"
                  @error="onImgError"
                />
                <div class="flex flex-col gap-1">
                  <div class="flex items-start justify-between">
                    <h3 class="text-xl font-bold uppercase text-[#f59e0b]">
                      {{ item.product?.name || "—" }}
                    </h3>
                    <p class="shrink-0 text-sm font-bold text-[#f59e0b]">
                      USD {{ lineTotal(item) }}
                    </p>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="text-xs text-navy-500">
                      Quantity: {{ item.quantity }}
                    </p>
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
            <span class="font-bold text-xl">USD {{ displayTotal }}</span>
          </div>
          <NuxtLink
            v-if="cartItems.length"
            to="/checkout"
            class="group relative block w-full overflow-hidden rounded-full bg-[#F49321] py-3.5 text-center text-base font-bold text-white transition hover:bg-[#e67a00] before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full before:skew-x-[-20deg] before:transition-transform before:duration-1000 before:ease-out hover:before:translate-x-full"
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
import { ShoppingCartIcon } from "@heroicons/vue/24/outline";

const cart = useCart();
const supabase = useSupabaseClient();
const config = useRuntimeConfig();

const open = ref(false);

const cartItems = computed(() => cart.cartItems.value);

const cartBump = useState("cart-bump", () => 0);

const displayTotal = computed(() =>
  Number(cart.cartTotal?.value || 0).toFixed(2),
);
const displayCount = computed(() => Number(cart.cartCount?.value || 0));

const lineTotal = (item: any) =>
  (Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2);

const getImageUrl = (url?: string | null) => {
  if (!url) return "/Images/placeholder-package.jpg";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const path = url.replace(/^\//, "").replace(/^Products\//i, "");
  const bucket = (config.public.storageBucket as string) || "Products";
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl || "/Images/placeholder-package.jpg";
};

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  if (img) img.src = "/Images/placeholder.png";
};

const onEmptyImgError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  // fallback if Festivo empty asset missing
  if (img) img.src = "/Images/Festivo/cart-empty.png";
};

const removeItem = async (id: string | number) => {
  await cart.removeFromCart?.(id);
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
</style>
