<template>
  <div
    v-if="showWidget"
    class="early-bird-widget relative overflow-hidden text-left text-white max-lg:static max-lg:max-w-full max-lg:bg-transparent max-lg:p-0 max-lg:shadow-none max-lg:backdrop-blur-none max-lg:border-0 lg:max-w-[240px] lg:rounded-xl lg:border lg:border-white/20 lg:bg-[rgba(28,45,91,0.75)] lg:p-3 lg:shadow-lg lg:backdrop-blur-md"
  >
    <h3
      class="mb-1.5 text-[0.7rem] font-extrabold uppercase tracking-wide text-[#F49321] max-lg:text-[0.65rem] max-lg:mb-1"
    >
      Early Bird Special Countdown
    </h3>

    <div class="mb-1.5 flex items-center gap-1.5 max-lg:gap-1 max-lg:mb-1">
      <div
        v-for="unit in units"
        :key="unit.label"
        class="flex min-w-[40px] items-baseline justify-center gap-0.5 rounded-md border border-[#F49321]/60 bg-[#0c1a35] px-1.5 py-1 max-lg:min-w-[28px] max-lg:rounded max-lg:px-1 max-lg:py-0.5"
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

    <p
      v-if="endsLabel"
      class="m-0 text-[0.7rem] font-medium leading-snug text-slate-200 max-lg:text-[0.65rem]"
    >
      Ends {{ endsLabel }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { loadEarlyBird, earlyBirdEnabled, earlyBirdExpiresAt } =
  useEarlyBirdSpecial();

const showWidget = ref(false);
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timer: ReturnType<typeof setInterval> | null = null;

const formatNumber = (n: number) => String(Math.max(0, n)).padStart(2, "0");

const expiryMs = computed(() => {
  const raw = earlyBirdExpiresAt.value;
  if (!raw) return null;
  const ms = new Date(raw).getTime();
  return Number.isNaN(ms) ? null : ms;
});

const endsLabel = computed(() => {
  const raw = earlyBirdExpiresAt.value;
  if (!raw) return "";

  const day = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!day) return "";

  const d = new Date(`${day[1]}-${day[2]}-${day[3]}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
});

const units = computed(() => [
  { label: "d", value: timeLeft.value.days },
  { label: "h", value: timeLeft.value.hours },
  { label: "m", value: timeLeft.value.minutes },
  { label: "s", value: timeLeft.value.seconds },
]);

function tick() {
  if (!expiryMs.value) {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return;
  }

  const diff = Math.max(0, expiryMs.value - Date.now());
  timeLeft.value = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function updateVisibility() {
  const enabled = Boolean(earlyBirdEnabled.value);
  const end = expiryMs.value;
  showWidget.value = enabled && !!end && end > Date.now();
}

onMounted(async () => {
  await loadEarlyBird();

  console.log("EB enabled", earlyBirdEnabled.value);
  console.log("EB expiresAt raw", earlyBirdExpiresAt.value);
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

<style scoped>
@media (min-width: 993px) {
  .mobile-widget {
    display: none !important; /* Hide mobile-widget on desktop */
  }

  .desktop-widget {
    display: block;
    position: absolute;
    top: 200px;
    right: 32px;
    z-index: 10;
    max-width: 330px;
    background: rgba(12, 35, 64, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
    text-align: center;
    color: #ffffff;
    overflow: hidden;
  }
}
</style>
