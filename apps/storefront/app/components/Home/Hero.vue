<template>
  <div
    class="hero-banner snow-bgxx relative h-[420px] min-h-[600px] overflow-hidden flex items-center max-lg:min-h-auto max-lg:py-10"
  >
    <!-- Base Fixed Background Image (Desktop) -->
    <div
      class="hero-image-fixed absolute inset-0 bg-cover bg-[center_28%] bg-no-repeat bg-fixed z-0 will-change-transform bg-[url('/Images/Banner/hero-image.webp')] max-lg:bg-[url('/Images/Banner/hero-image-mobile-768.webp')] max-lg:bg-center max-lg:bg-scroll max-lg:!bg-cover max-lg:translate-z-0"
    ></div>

    <!-- Full-width subtle dark overlay -->
    <div class="overlay absolute inset-0 z-[1] max-lg:bg-black/25"></div>

    <!-- Desktop Countdown Widget -->
    <CountdownWidget
      class="desktop-widget max-lg:hidden"
      :time-left="timeLeft"
      :format-number="formatNumber"
    />

    <!-- Outer Content Container -->
    <div
      class="hero-content-container relative z-[3] w-full max-w-[1200px] mx-auto px-6 flex justify-between items-center gap-5 max-lg:flex-col max-lg:items-start max-lg:gap-24 max-lg:px-[5%]"
    >
      <!-- Main Glassmorphic Card -->
      <div
        class="hero-card relative w-full max-w-[460px] bg-[#161c30]/50 backdrop-blur-md rounded-2xl p-11 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-white text-center border border-white/12 overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:-left-[150%] before:w-[200%] before:h-[200%] before:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] before:rotate-[25deg] before:pointer-events-none before:animate-[glossyShineContinuous_3s_linear_infinite] max-lg:order-1 max-lg:max-w-[90%] max-lg:p-0 max-lg:text-left max-lg:!bg-transparent max-lg:!backdrop-blur-none max-lg:!border-none max-lg:!shadow-none max-lg:!rounded-none max-lg:before:!hidden max-lg:after:!hidden"
      >
        <h1
          class="text-4xl font-extrabold leading-[1.15] mb-4 tracking-wide text-white max-lg:text-[1.35rem] max-lg:mb-1 max-lg:text-left max-lg:[text-shadow:0_2px_5px_rgba(0,0,0,0.7)]"
        >
          RENT THE MAGIC<br />
          <span class="highlight text-[#f7941d]">ENJOY THE SEASON</span>
        </h1>

        <p
          class="tagline text-[1.1rem] font-semibold leading-[1.35] mb-7 text-slate-200 max-lg:text-[0.82rem] max-lg:mb-3.5 max-lg:leading-[1.25] max-lg:text-left max-lg:[text-shadow:0_2px_4px_rgba(0,0,0,0.7)]"
        >
          Giftwrapped in<br class="mobile-only" />
          One Simple Package.<br />
          <span
            class="subtext block text-[0.88rem] font-normal mt-1.5 opacity-90 max-lg:text-[0.68rem] max-lg:mt-0.5"
            >(No ladders. No tangled cords.<br class="mobile-only" />
            No storage. No stress.)</span
          >
        </p>

        <NuxtLink
          to="/packages"
          class="btn-primary-card bg-[#f7941d] text-white font-bold py-3 px-6 rounded-xl inline-block hover:bg-[#e0850a] transition-colors shadow-lg hover:shadow-xl max-lg:text-[0.82rem] max-lg:py-2 max-lg:px-3 max-lg:rounded-lg max-lg:float-left max-lg:clear-both max-lg:!ml-0 max-lg:!mr-auto max-lg:relative max-lg:overflow-hidden max-lg:after:content-[''] max-lg:after:absolute max-lg:after:-top-1/2 max-lg:after:-left-[150%] max-lg:after:w-[200%] max-lg:after:h-[200%] max-lg:after:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] max-lg:after:rotate-[25deg] max-lg:after:pointer-events-none max-lg:after:animate-[glossyShineContinuous_3s_linear_infinite]"
        >
          Shop the Packages
        </NuxtLink>
      </div>

      <!-- Mobile Countdown Widget Instance -->
      <CountdownWidget
        class="mobile-widget max-lg:block hidden"
        :time-left="timeLeft"
        :format-number="formatNumber"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Countdown Logic
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval: ReturnType<typeof setInterval> | null = null;

const calculateTimeLeft = () => {
  const now = new Date();
  let christmas = new Date(now.getFullYear(), 11, 25, 0, 0, 0);
  if (now.getTime() > christmas.getTime()) {
    christmas = new Date(now.getFullYear() + 1, 11, 25, 0, 0, 0);
  }
  const diff = christmas.getTime() - now.getTime();
  if (diff <= 0) return;

  timeLeft.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const formatNumber = (num: number) => String(num).padStart(2, "0");

onMounted(() => {
  calculateTimeLeft();
  timerInterval = setInterval(calculateTimeLeft, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
/* iOS Safari Fix */
@supports (-webkit-touch-callout: none) {
  .hero-image-fixed {
    background-attachment: scroll;
  }
}

/* Custom animation keyframes */
@keyframes glossyShineContinuous {
  0% {
    transform: rotate(25deg) translateX(-100%);
  }
  100% {
    transform: rotate(25deg) translateX(100%);
  }
}

/* Additional mobile overrides for the hero-card pseudo-elements */
@media (max-width: 992px) {
  .hero-card::before,
  .hero-card::after {
    display: none !important;
    content: none !important;
    animation: none !important;
  }
}

/* Ensure desktop has the shine and mobile doesn't */
@media (min-width: 993px) {
  .hero-card::before {
    display: block !important;
    content: "" !important;
  }
}

/* Only show mobile-widget on mobile */
@media (min-width: 993px) {
  .mobile-widget {
    display: none !important;
  }
}

@media (max-width: 992px) {
  .desktop-widget {
    display: none !important;
  }
  .mobile-widget {
    display: block !important;
  }
}
</style>
