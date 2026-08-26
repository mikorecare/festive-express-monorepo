<template>
  <ClientOnly>
    <Transition name="fade-slide">
      <div
        v-if="visible"
        class="fixed bottom-[100px] right-[20px] z-[999] font-['Poppins','Roboto',sans-serif] flex justify-end max-sm:bottom-[90px] max-sm:right-[20px]"
      >
        <NuxtLink
          to="/cart"
          class="group flex items-center justify-end bg-[#172a50] border-[3px] border-[#F49321] rounded-[50px] w-[60px] h-[60px] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] no-underline cursor-pointer ml-auto overflow-visible transition-all duration-300 hover:w-[175px] hover:shadow-[0_12px_28px_rgba(247,148,29,0.4)] hover:scale-105"
          aria-label="View Cart"
        >
          <span
            class="flex items-center whitespace-nowrap flex-grow overflow-hidden"
          >
            <!-- Visible on hover when pill expands (default design) -->
            <span
              class="text-white text-[1.1rem] font-bold pl-[18px] pr-3 transition-opacity duration-200 delay-100 group-hover:opacity-100"
            >
              ${{ displayTotal }}
            </span>
          </span>

          <div
            class="relative flex items-center justify-center bg-[#F49321] text-white w-[54px] h-[54px] rounded-full flex-shrink-0 overflow-visible transition-colors duration-300 group-hover:bg-[#e07a0a]"
          >
            <!-- <i class="fas fa-shopping-cart text-[1.2rem]"></i> -->
            <ShoppingCartIcon class="w-7 h-7" aria-hidden="true" />
            <span
              class="absolute -top-1 -right-1 z-10 bg-white text-[#172a50] text-[0.8rem] font-extrabold w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-[#F49321] shadow-[0_2px_5px_rgba(0,0,0,0.25)]"
            >
              {{ displayCount }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
const cart = useCart();

import { ShoppingCartIcon } from "@heroicons/vue/24/outline";

const displayTotal = computed(() =>
  Number(cart.cartTotal.value || 0).toFixed(2),
);
const displayCount = computed(() => Number(cart.cartCount.value || 0));

const visible = ref(false);

onMounted(async () => {
  visible.value = true;
  await cart.loadCart();

  const onFocus = () => cart.loadCart();
  window.addEventListener("focus", onFocus);
  onUnmounted(() => window.removeEventListener("focus", onFocus));
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
</style>
