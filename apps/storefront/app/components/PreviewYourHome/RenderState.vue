<template>
  <div
    v-if="rendering"
    aria-hidden="true"
    class="pointer-events-none select-none relative w-screen left-1/2 -translate-x-1/2 max-w-[640px]"
  >
    <div class="space-y-4 lg:space-y-5 animate-pulse max-w-4xl mx-auto px-6">
      <div>
        <div class="h-5 w-32 bg-gray-200 rounded mb-1.5"></div>
        <div
          class="h-[48px] lg:h-[52px] w-full bg-gray-200 rounded-[14px]"
        ></div>
      </div>
      <div>
        <div class="h-5 w-40 bg-gray-200 rounded mb-1.5"></div>
        <div
          class="h-[48px] lg:h-[52px] w-full bg-gray-200 rounded-[14px]"
        ></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div class="h-5 w-28 bg-gray-200 rounded mb-1.5"></div>
          <div
            class="h-[48px] lg:h-[52px] w-full bg-gray-200 rounded-[14px]"
          ></div>
        </div>
        <div>
          <div class="h-5 w-24 bg-gray-200 rounded mb-1.5"></div>
          <div
            class="h-[48px] lg:h-[52px] w-full bg-gray-200 rounded-[14px]"
          ></div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div class="h-5 w-24 bg-gray-200 rounded mb-1.5"></div>
          <div
            class="h-[48px] lg:h-[52px] w-full bg-gray-200 rounded-[14px]"
          ></div>
        </div>
        <div>
          <div class="h-5 w-16 bg-gray-200 rounded mb-1.5"></div>
          <div
            class="h-[48px] lg:h-[52px] w-full bg-gray-200 rounded-[14px]"
          ></div>
        </div>
      </div>
      <div>
        <div class="h-5 w-20 bg-gray-200 rounded mb-1.5"></div>
        <div
          class="h-[48px] lg:h-[52px] w-full bg-gray-200 rounded-[14px]"
        ></div>
      </div>
      <div class="h-[65px] w-full bg-gray-200 rounded-[14px]"></div>
      <div class="space-y-2">
        <div
          class="h-[52px] lg:h-[56px] w-full bg-gray-200 rounded-[14px]"
        ></div>
        <div
          class="h-[46px] lg:h-[50px] w-full bg-gray-200 rounded-[14px]"
        ></div>
      </div>
      <div class="h-3 w-56 bg-gray-200 rounded mx-auto"></div>
    </div>
  </div>

  <div
    v-if="rendering"
    class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
  >
    <div
      class="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl border border-gray-100"
    >
      <div class="relative h-1.5 w-full">
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#f7931e] via-[#f7931e] to-[#1c2f5b]"
        ></div>
      </div>

      <div class="p-8 text-center">
        <div class="flex justify-center mb-6">
          <FLpLoadingLogo
            :animation-speed="300"
            :animate="true"
            width="120"
            height="122"
          />
        </div>

        <template v-if="isPreview">
          <p class="text-base text-gray-600 mb-3">
            Loading the house photo — no lighting yet.
          </p>
          <h3 class="text-2xl font-bold text-navy">Checking address…</h3>
          <p class="text-base text-gray-500 mt-3">Looking up address…</p>
        </template>

        <template v-else>
          <p class="text-base text-gray-600 mb-3">{{ localFact }}</p>
          <h3 class="text-2xl font-bold text-navy">Lighting up your home…</h3>
          <p class="text-base text-gray-500 mt-3">{{ localProgress }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { useEstimator } from "~/composables/useEstimator";
import FLpLoadingLogo from "../Icons/FLpLoadingLogo.vue";

const { rendering, isPreview } = useEstimator();

const localFact = ref("");
const localProgress = ref("");

const facts = [
  "Festive Express installs your lights — you relax and enjoy the season.",
  "Professional C-9 roofline lighting, installed and removed for you.",
  "One simple rental package — no ladders, no tangled cords, no storage.",
  "We handle install, maintenance, and takedown when the season ends.",
  "Licensed & insured technicians — your home is fully protected.",
  "Finding your roofline…",
  "Placing C-9 lights along every eave and peak…",
  "Adding the festive evening glow…",
];

const progressSteps = [
  "Finding your house…",
  "Reading the roofline…",
  "Placing the lights…",
  "Setting the evening glow…",
  "Almost there…",
];

let timer: ReturnType<typeof setInterval> | null = null;
let i = 0;

watch(
  rendering,
  (on) => {
    if (on) {
      i = 0;
      localFact.value = facts[0]!;
      localProgress.value = progressSteps[0]!;
      timer = setInterval(() => {
        i = (i + 1) % facts.length;
        localFact.value = facts[i]!;
        localProgress.value =
          progressSteps[Math.min(i, progressSteps.length - 1)]!;
      }, 1500);
    } else {
      if (timer) clearInterval(timer);
      timer = null;
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
