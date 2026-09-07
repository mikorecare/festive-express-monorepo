<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
        enter-from-class="opacity-0 translate-y-8 md:scale-95"
        enter-to-class="opacity-100 translate-y-0 md:scale-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0 md:scale-100"
        leave-to-class="opacity-0 translate-y-6 md:scale-95"
      >
        <div
          v-if="visible"
          class="fixed bottom-0 left-0 z-[2147483646] w-full p-0 sm:p-6 md:max-w-[480px] pointer-events-none"
          role="region"
          aria-label="Privacy & Cookie Preferences"
        >
          <div
            class="pointer-events-auto w-full bg-white border border-slate-100 shadow-[0_20px_60px_-15px_rgba(28,45,91,0.18)] transition-all duration-300 ease-in-out rounded-t-3xl sm:rounded-2xl p-6 md:p-7 max-md:max-h-[88vh] max-md:overflow-y-auto"
          >
            <!-- Header Section -->
            <div class="flex items-center justify-between mb-4">
              <div>
                <span
                  class="text-[10px] uppercase tracking-widest font-bold text-[#F49321]/90 block mb-1"
                  >Privacy Control</span
                >
                <h2
                  id="cookie-title"
                  class="text-xl font-bold tracking-tight text-[#1C2D5B]"
                >
                  Privacy Settings
                </h2>
              </div>
              <button
                type="button"
                class="text-xs font-semibold text-slate-400 hover:text-[#1C2D5B] transition-colors cursor-pointer underline underline-offset-4 decoration-slate-200 hover:decoration-[#1C2D5B]"
                @click="continueWithout"
              >
                Continue without accepting
              </button>
            </div>

            <!-- Intro Text -->
            <p
              v-text="cookieIntro"
              class="text-xs md:text-[13px] leading-relaxed text-slate-500 mb-6 font-normal"
            />

            <!-- 3 Sliders - Horizontal Row on Desktop -->
            <div class="flex flex-col md:flex-row md:gap-3 gap-3 mb-6">
              <!-- Marketing Slider -->
              <div
                class="flex-1 flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100/80 transition-all hover:bg-slate-50 md:flex-col md:items-center md:gap-2"
              >
                <span
                  id="lbl-marketing"
                  class="text-sm font-semibold text-[#1C2D5B]"
                  >Marketing</span
                >
                <button
                  type="button"
                  role="switch"
                  :aria-checked="prefs.marketing"
                  aria-labelledby="lbl-marketing"
                  class="relative h-5 w-9 shrink-0 cursor-pointer rounded-full p-0 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1C2D5B] focus-visible:ring-offset-2"
                  :class="prefs.marketing ? 'bg-[#1C2D5B]' : 'bg-slate-200'"
                  @click="prefs.marketing = !prefs.marketing"
                >
                  <span
                    class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                    :class="prefs.marketing ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </div>

              <!-- Functional Slider -->
              <div
                class="flex-1 flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100/80 transition-all hover:bg-slate-50 md:flex-col md:items-center md:gap-2"
              >
                <span
                  id="lbl-functional"
                  class="text-sm font-semibold text-[#1C2D5B]"
                  >Functional</span
                >
                <button
                  type="button"
                  role="switch"
                  :aria-checked="prefs.functional"
                  aria-labelledby="lbl-functional"
                  class="relative h-5 w-9 shrink-0 cursor-pointer rounded-full p-0 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1C2D5B] focus-visible:ring-offset-2"
                  :class="prefs.functional ? 'bg-[#1C2D5B]' : 'bg-slate-200'"
                  @click="prefs.functional = !prefs.functional"
                >
                  <span
                    class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                    :class="
                      prefs.functional ? 'translate-x-4' : 'translate-x-0'
                    "
                  />
                </button>
              </div>

              <!-- Essential Slider (Disabled) -->
              <div
                class="flex-1 flex items-center justify-between p-3 rounded-xl bg-slate-50/40 border border-slate-100/50 opacity-70 md:flex-col md:items-center md:gap-2"
              >
                <span
                  id="lbl-essential"
                  class="text-sm font-semibold text-slate-500"
                  >Essential</span
                >
                <button
                  type="button"
                  role="switch"
                  aria-checked="true"
                  aria-labelledby="lbl-essential"
                  disabled
                  class="relative h-5 w-9 shrink-0 cursor-not-allowed rounded-full bg-slate-400 p-0"
                >
                  <span
                    class="absolute top-0.5 left-0.5 h-4 w-4 translate-x-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            </div>

            <!-- Policy Hyperlinks -->
            <div
              class="flex items-center justify-between pt-2 border-t border-slate-100 mb-5"
            >
              <div class="flex gap-3 text-[11px] font-medium text-slate-400">
                <NuxtLink
                  to="/privacy-policy"
                  class="hover:text-[#1C2D5B] transition-colors"
                  >Privacy Policy</NuxtLink
                >
                <span>·</span>
                <NuxtLink
                  to="/cookie-policy"
                  class="hover:text-[#1C2D5B] transition-colors"
                  >Cookie Policy</NuxtLink
                >
                <span>·</span>
                <span class="text-slate-300">Festive Express</span>
              </div>
            </div>

            <!-- Button Layout -->
            <div class="grid grid-cols-3 gap-2 max-md:flex max-md:flex-col">
              <button
                type="button"
                class="order-3 md:order-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-[#1C2D5B] tracking-wide transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] max-md:py-3.5"
                @click="saveSettings"
              >
                Save Settings
              </button>
              <button
                type="button"
                class="order-2 md:order-2 cursor-pointer rounded-xl border border-transparent bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 tracking-wide transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-[0.98] max-md:py-3.5"
                @click="denyAll"
              >
                Deny
              </button>
              <button
                type="button"
                class="order-1 md:order-3 cursor-pointer rounded-xl border border-transparent bg-[#1C2D5B] px-3 py-2.5 text-xs font-bold text-white tracking-wide shadow-sm transition-all hover:bg-[#F49321] hover:shadow-md active:scale-[0.98] max-md:py-3.5"
                @click="acceptAll"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const STORAGE_KEY = "flp_cookie_consent";

const visible = ref(false);
const prefs = reactive({
  marketing: false,
  functional: false,
  essential: true,
});

const cookieIntro = ref("");

type CookieResponse = {
  success: boolean;
  data: { short_description?: string } | null;
};

const { data, error } = useLazyFetch<CookieResponse>("/api/cookie-policy", {
  key: "cookie-policy-data",
  server: true,
});

watch(
  data,
  (newData) => {
    if (newData?.success && newData?.data) {
      cookieIntro.value = newData.data.short_description || "";
    }
  },
  { immediate: true },
);

watch(error, (newError) => {
  if (newError) {
    console.error("Failed to load cookie policy:", newError);
  }
});

const persist = (value: {
  marketing: boolean;
  functional: boolean;
  essential: boolean;
  status: "accepted" | "denied" | "custom" | "dismissed";
}) => {
  if (!import.meta.client) return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...value, updatedAt: new Date().toISOString() }),
  );
  visible.value = false;
};

const acceptAll = () => {
  prefs.marketing = true;
  prefs.functional = true;
  persist({
    marketing: true,
    functional: true,
    essential: true,
    status: "accepted",
  });
};

const denyAll = () => {
  prefs.marketing = false;
  prefs.functional = false;
  persist({
    marketing: false,
    functional: false,
    essential: true,
    status: "denied",
  });
};

const saveSettings = () => {
  persist({
    marketing: prefs.marketing,
    functional: prefs.functional,
    essential: true,
    status: "custom",
  });
};

const continueWithout = () => {
  persist({
    marketing: false,
    functional: false,
    essential: true,
    status: "dismissed",
  });
};

onMounted(() => {
  if (!import.meta.client) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      prefs.marketing = !!saved.marketing;
      prefs.functional = !!saved.functional;
      if (
        saved.status === "accepted" ||
        saved.status === "denied" ||
        saved.status === "custom"
      ) {
        visible.value = false;
        return;
      }
    }
    visible.value = true;
  } catch {
    visible.value = true;
  }
});

if (import.meta.client) {
  (window as any).__openCookieSettings = () => {
    visible.value = true;
  };
}
</script>
<style scoped>
/* empty or malformed */
</style>
