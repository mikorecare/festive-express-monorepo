<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="visible"
          class="fixed bottom-4 left-4 right-4 z-[2147483646] sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[340px] pointer-events-none"
        >
          <div
            class="pointer-events-auto w-full bg-white border border-slate-200 shadow-lg rounded-2xl px-4 py-3 relative"
          >
            <!-- Close (X) -->
            <button
              type="button"
              class="absolute top-2 right-2 text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Dismiss"
              @click="acceptCookies"
            >
              <svg
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Text -->
            <p class="text-xs text-black-400 leading-snug pr-4 mb-3">
              We use cookies to improve your experience. Please read our
              <NuxtLink
                to="/privacy-policy"
                class="underline hover:text-[#1C2D5B] transition-colors font-medium"
                >privacy policy</NuxtLink
              >
              for more info.
            </p>

            <!-- Accept Button -->
            <button
              type="button"
              class="btn-3d-glossy inline-flex items-center justify-center bg-[#1C2D5B] hover:bg-[#F49321] text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors active:scale-95"
              @click="acceptCookies"
            >
              <span class="relative z-10">Accept</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const STORAGE_KEY = "flp_cookie_consent";
const visible = ref(false);

const acceptCookies = () => {
  if (import.meta.client) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        status: "accepted",
        updatedAt: new Date().toISOString(),
      }),
    );
  }
  visible.value = false;
};

onMounted(() => {
  if (!import.meta.client) return;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    visible.value = true;
  }
});
</script>
