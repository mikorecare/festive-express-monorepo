<template>
  <ClientOnly>
    <!-- Floating trigger -->
    <Transition name="fade-slide">
      <button
        type="button"
        class="fixed bottom-[100px] right-[20px] z-[999] flex items-center justify-center bg-[#172a50] border-[3px] border-[#ff890b] rounded-full w-[60px] h-[60px] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] cursor-pointer max-sm:bottom-[90px]"
        aria-label="Open cart"
        @click="open = true"
      >
        <div
          class="relative flex items-center justify-center bg-[#ff890b] text-white w-[54px] h-[54px] rounded-full"
        >
          <ShoppingCartIcon class="w-7 h-7" aria-hidden="true" />
          <span
            class="absolute -top-1 -right-1 z-10 bg-white text-[#172a50] text-[0.8rem] font-extrabold w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-[#ff890b]"
          >
            {{ displayCount }}
          </span>
        </div>
      </button>
    </Transition>

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
        class="fixed top-0 right-0 z-[10001] h-full w-full max-w-[400px] bg-white shadow-2xl flex flex-col"
        role="dialog"
        aria-label="Shopping cart"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-5 py-4 border-b border-slate-100"
        >
          <div>
            <h2 class="text-lg font-bold text-[#0c2340]">Your Cart</h2>
            <p class="text-xs text-slate-500">
              {{ displayCount }} {{ displayCount === 1 ? "item" : "items" }}
            </p>
          </div>
          <button
            type="button"
            class="w-10 h-10 rounded-full hover:bg-slate-100 text-2xl leading-none text-slate-600"
            aria-label="Close cart"
            @click="open = false"
          >
            &times;
          </button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <div
            v-if="!cartItems.length"
            class="text-center py-16 text-slate-500"
          >
            <p class="mb-4">Your cart is empty</p>
            <NuxtLink
              to="/packages"
              class="text-[#F49322] font-semibold"
              @click="open = false"
            >
              Browse packages
            </NuxtLink>
          </div>

          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex gap-3 py-4 border-b border-slate-100 last:border-0"
          >
            <img
              :src="getImageUrl(item.product?.image_url)"
              :alt="item.product?.name || ''"
              class="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0"
              @error="onImgError"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-[#0c2340] truncate">
                {{ item.product?.name || "" }}
              </h3>
              <p
                v-if="item.options?.c9_color"
                class="text-xs text-slate-500 mt-0.5"
              >
                {{ item.options.c9_color }} LEDs
              </p>
              <p
                v-if="item.options?.design_name"
                class="text-xs text-slate-500 mt-0.5"
              >
                Theme: {{ item.options.design_name }}
              </p>
              <p class="text-xs text-slate-500 mt-1">
                Qty: {{ item.quantity }}
              </p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-[#F49322]">
                ${{ lineTotal(item) }}
              </p>
              <button
                type="button"
                class="text-xs text-red-500 mt-2 hover:underline"
                @click="removeItem(item.id)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50">
          <div class="flex justify-between text-sm mb-5">
            <span class="text-slate-600">Subtotal</span>
            <span class="font-bold text-[#0c2340]">${{ displayTotal }}</span>
          </div>
          <!-- <NuxtLink
            to="/cart"
            class="block w-full text-center py-3 rounded-lg border-2 border-[#0c2340] text-[#0c2340] font-semibold hover:bg-[#0c2340] hover:text-white transition"
            @click="open = false"
          >
            View cart
          </NuxtLink> -->
          <NuxtLink
            to="/checkout"
            class="btn-checkout relative block w-full text-center py-3 rounded-lg bg-[#F49322] text-white font-bold border-2 border-[#0c2340] transition hover:bg-[#0c2340] overflow-hidden"
            @click="open = false"
          >
            Checkout <i class="fas fa-arrow-right ml-1" />
            <!-- Glossy Shine Overlay -->
            <div
              class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] rotate-[25deg] pointer-events-none animate-[glossyShineContinuous_3s_linear_infinite]"
            />
          </NuxtLink>
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
const visible = ref(false);

const cartItems = computed(() => cart.cartItems.value);
const displayTotal = computed(() =>
  Number(cart.cartTotal?.value || 0).toFixed(2),
);
const displayCount = computed(() => Number(cart.cartCount?.value || 0));

const lineTotal = (item: any) =>
  (Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2);

const getImageUrl = (url?: string | null) => {
  if (!url) return "/Images/placeholder-package.jpg";

  // Already absolute, site path, or local preview
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // DB may store "Products/foo.jpg" or "foo.jpg"
  const path = url.replace(/^\//, "").replace(/^Products\//i, "");

  const bucket = (config.public.storageBucket as string) || "Products";

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl || "/Images/placeholder-package.jpg";
};

const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  if (img) img.src = "/Images/placeholder.png";
};

const removeItem = async (id: string | number) => {
  await cart.removeFromCart?.(id);
  await cart.loadCart?.();
};

// Lock body scroll while open
watch(open, (v) => {
  if (!import.meta.client) return;
  document.body.style.overflow = v ? "hidden" : "";
});

onMounted(async () => {
  visible.value = true;
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
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
