<template>
  <ClientOnly>
    <div
      v-if="showWidget"
      class="inline-flex flex-wrap items-center justify-center gap-2 md:gap-3 rounded-lg border-2 border-navy bg-white px-4 py-2.5 md:px-5 md:py-3"
    >
      <p
        class="m-0 text-center text-[0.8rem] md:text-[0.95rem] font-black uppercase tracking-wide text-navy"
      >
        Early Bird Special Ends {{ endsLabel }}
      </p>

      <div class="flex items-center gap-1.5 max-lg:gap-1">
        <div
          v-for="unit in units"
          :key="unit.label"
          class="flex min-w-[40px] items-baseline justify-center gap-0.5 rounded-md border border-[#F49321]/60 bg-[#0c1a35] px-1.5 py-1 max-lg:min-w-[28px] max-lg:px-1 max-lg:py-0.5"
        >
          <span
            class="text-base font-black leading-none text-white max-lg:text-[0.8rem]"
          >
            {{ formatNumber(unit.value) }}
          </span>
          <small
            class="text-[0.65rem] font-bold text-[#F49321] max-lg:text-[0.55rem]"
          >
            {{ unit.label }}
          </small>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const {
  loadEarlyBird,
  earlyBirdEnabled,
  earlyBirdExpiresAt,
  isEarlyBirdLive,
  formatEndsLabel,
} = useEarlyBirdSpecial();

const showWidget = ref(false);
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timer: ReturnType<typeof setInterval> | null = null;

const formatNumber = (n: number) => String(Math.max(0, n)).padStart(2, "0");
const endsLabel = computed(() => formatEndsLabel.value || "");

const units = computed(() => [
  { label: "d", value: timeLeft.value.days },
  { label: "h", value: timeLeft.value.hours },
  { label: "m", value: timeLeft.value.minutes },
  { label: "s", value: timeLeft.value.seconds },
]);

function tick() {
  const end = earlyBirdExpiresAt.value
    ? new Date(earlyBirdExpiresAt.value).getTime()
    : Date.now();
  const diff = Math.max(0, end - Date.now());
  timeLeft.value = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function updateVisibility() {
  showWidget.value = Boolean(isEarlyBirdLive.value);
}

onMounted(async () => {
  await loadEarlyBird();
  updateVisibility();
  tick();
  timer = setInterval(() => {
    updateVisibility();
    tick();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>
