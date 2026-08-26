<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[2147483648] flex pointer-events-none items-end justify-start p-4 md:p-6 max-md:items-end max-md:justify-center max-md:px-3 max-md:pb-5"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-modal="true"
    >
      <div
        class="absolute inset-0 pointer-events-auto bg-[#1C2D5B]/35 max-md:bg-[#1C2D5B]/50"
        @click="continueWithout"
      />

      <div
        class="relative z-10 pointer-events-auto w-full max-w-[520px] rounded-2xl bg-white p-4 shadow-2xl shadow-[#1C2D5B]/20 max-md:max-w-[calc(100%-0.5rem)]"
      >
        <!-- Top: Continue without accepting -->
        <div class="mb-3 flex justify-end">
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent text-sm font-medium text-[#1C2D5B] underline"
            @click="continueWithout"
          >
            Continue without accepting
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <h2 id="cookie-title" class="mb-2 text-lg font-bold text-[#1C2D5B]">
          Privacy Settings
        </h2>

        <p class="mb-4 text-sm leading-relaxed text-slate-600">
          This site uses third-party website tracking technologies to provide
          and continually improve your experience on our website and our
          services. You may revoke or change your consent at any time.
        </p>

        <!-- Desktop: one row · Mobile: stack -->
        <div
          class="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 max-md:flex-col max-md:items-stretch"
        >
          <div class="flex items-center justify-between gap-2 max-md:w-full">
            <span class="text-sm font-medium text-[#1C2D5B]">Marketing</span>
            <button
              type="button"
              role="switch"
              :aria-checked="prefs.marketing"
              class="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-slate-300 p-0 transition-colors"
              :class="
                prefs.marketing
                  ? 'border-[#F49321] bg-[#F49321]'
                  : 'bg-slate-100'
              "
              @click="prefs.marketing = !prefs.marketing"
            >
              <span
                class="absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform"
                :class="prefs.marketing ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between gap-2 max-md:w-full">
            <span class="text-sm font-medium text-[#1C2D5B]">Functional</span>
            <button
              type="button"
              role="switch"
              :aria-checked="prefs.functional"
              class="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-slate-300 p-0 transition-colors"
              :class="
                prefs.functional
                  ? 'border-[#F49321] bg-[#F49321]'
                  : 'bg-slate-100'
              "
              @click="prefs.functional = !prefs.functional"
            >
              <span
                class="absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform"
                :class="prefs.functional ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <div class="flex items-center justify-between gap-2 max-md:w-full">
            <span class="text-sm font-medium text-[#1C2D5B]">Essential</span>
            <button
              type="button"
              role="switch"
              aria-checked="true"
              disabled
              title="Required for the site to work"
              class="relative h-6 w-11 shrink-0 cursor-not-allowed rounded-full border border-slate-300 bg-slate-200 p-0 opacity-60"
            >
              <span
                class="absolute top-0.5 left-0.5 h-[18px] w-[18px] translate-x-5 rounded-full bg-white shadow"
              />
            </button>
          </div>
        </div>

        <div class="mb-3 flex gap-4 text-sm">
          <NuxtLink
            to="/privacy-policy"
            class="font-medium text-[#1C2D5B] underline"
          >
            Privacy Policy
          </NuxtLink>
          <NuxtLink
            to="/cookie-policy"
            class="font-medium text-[#1C2D5B] underline"
          >
            More Information
          </NuxtLink>
        </div>

        <p class="mb-4 text-xs text-slate-400">
          Cookie preferences · Festive Express
        </p>

        <!-- Desktop: row · Mobile: column full width like screenshot -->
        <div
          class="flex flex-row items-center justify-end gap-2 max-md:!flex-col max-md:!items-stretch max-md:!gap-2.5"
        >
          <button
            type="button"
            class="cursor-pointer rounded-lg border-0 bg-[#F49321] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1C2D5B] max-md:order-1 max-md:w-full max-md:py-3"
            @click="acceptAll"
          >
            Accept All
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-lg border-0 bg-[#F49321] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1C2D5B] max-md:order-2 max-md:w-full max-md:py-3"
            @click="denyAll"
          >
            Deny
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#1C2D5B] transition hover:border-[#1C2D5B] max-md:order-3 max-md:w-full max-md:py-3"
            @click="saveSettings"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const STORAGE_KEY = "flp_cookie_consent";

const visible = ref(false);
const prefs = reactive({
  marketing: false,
  functional: false,
  essential: true,
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
      return;
    }
  } catch {
    /* ignore */
  }
  visible.value = true;
});

if (import.meta.client) {
  (window as any).__openCookieSettings = () => {
    visible.value = true;
  };
}
</script>
