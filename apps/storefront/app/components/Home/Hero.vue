<template>
  <div
    ref="heroRef"
    class="hero-banner snow-bgxx relative min-h-[70dvh] overflow-hidden flex items-center max-lg:min-h-auto max-lg:py-10"
  >
    <!-- Single layer on mobile, separate layers on desktop -->
    <div
      ref="bgRef"
      class="hero-layer hero-layer-background absolute inset-0 bg-cover bg-no-repeat z-0 will-change-transform"
      :style="bgStyle"
    ></div>

    <!-- Only visible on desktop -->
    <div
      v-show="!isMobile"
      ref="familyRef"
      class="hero-layer hero-layer-family absolute inset-0 bg-cover bg-no-repeat z-[1] will-change-transform"
      :style="familyStyle"
    ></div>

    <div class="overlay absolute inset-0 z-[2] max-lg:bg-black/25"></div>

    <CountdownWidget
      class="desktop-widget max-lg:hidden"
      :time-left="timeLeft"
      :format-number="formatNumber"
    />

    <div
      class="hero-content-container relative z-[3] w-full max-w-[1200px] mx-auto px-6 flex justify-between items-center gap-5 max-lg:flex-col max-lg:items-start max-lg:gap-24 max-lg:px-[5%]"
    >
      <div
        class="hero-card relative w-full max-w-[460px] bg-[#161c30]/50 backdrop-blur-md rounded-2xl p-11 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-white text-center border border-white/12 overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:-left-[150%] before:w-[200%] before:h-[200%] before:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] before:rotate-[25deg] before:pointer-events-none before:animate-[glossyShineContinuous_3s_linear_infinite] max-lg:order-1 max-lg:max-w-[90%] max-lg:p-0 max-lg:text-left max-lg:!bg-transparent max-lg:!backdrop-blur-none max-lg:!border-none max-lg:!shadow-none max-lg:!rounded-none max-lg:before:!hidden max-lg:after:!hidden"
        :class="{ 'hero-card-focused': isHeroVisible }"
      >
        <h1
          class="text-4xl font-extrabold leading-[1.15] mb-4 tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] max-lg:text-[1.35rem] max-lg:mb-1 max-lg:text-left max-lg:drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)] max-lg:[text-shadow:0_2px_6px_rgba(0,0,0,0.95),0_4px_16px_rgba(0,0,0,0.75)]"
        >
          RENT THE MAGIC<br />
          <span class="highlight text-[#F49321]">ENJOY THE SEASON</span>
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
          class="btn-primary-card bg-[#F49321] text-white font-bold py-3 px-6 rounded-xl inline-block hover:bg-[#e0850a] transition-colors shadow-lg hover:shadow-xl max-lg:text-[0.82rem] max-lg:py-2 max-lg:px-3 max-lg:rounded-lg max-lg:float-left max-lg:clear-both max-lg:!ml-1 max-lg:!mr-auto max-lg:relative max-lg:overflow-hidden max-lg:after:content-[''] max-lg:after:absolute max-lg:after:-top-1/2 max-lg:after:-left-[150%] max-lg:after:w-[200%] max-lg:after:h-[200%] max-lg:after:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] max-lg:after:rotate-[25deg] max-lg:after:pointer-events-none max-lg:after:animate-[glossyShineContinuous_3s_linear_infinite]"
        >
          Explore the Packages
        </NuxtLink>
      </div>

      <CountdownWidget
        class="mobile-widget max-lg:block hidden"
        :time-left="timeLeft"
        :format-number="formatNumber"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval: ReturnType<typeof setInterval> | null = null;
const bgRef = ref<HTMLElement | null>(null);
const familyRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);
const isHeroVisible = ref(false);

const bgOffset = ref(0);
const familyOffset = ref(0);
const isMobile = ref(false);

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

const updateParallax = () => {
  if (!bgRef.value || !familyRef.value || isMobile.value) return;

  const rect = bgRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const heroCenter = rect.top + rect.height / 2;
  const viewportCenter = viewportHeight / 2;
  const offset = (viewportCenter - heroCenter) / viewportHeight;
  const clampedOffset = Math.max(-0.4, Math.min(0.4, offset));
  const maxShiftBg = 150;
  const shiftBg = clampedOffset * maxShiftBg;
  const maxShiftFamily = 100;
  const shiftFamily = clampedOffset * maxShiftFamily;

  bgOffset.value = shiftBg;
  familyOffset.value = shiftFamily;
};

const bgStyle = computed(() => {
  if (isMobile.value) {
    return {
      backgroundImage: "url('/Images/Banner/hero-image-mobile-768.webp')",
      backgroundPosition: "center center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    };
  }
  // Desktop: house background with parallax
  return {
    backgroundImage: "url('/Images/Banner/house.webp')",
    backgroundPosition: `center ${28 + bgOffset.value}%`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    transition: "background-position 0.08s ease-out",
  };
});

const familyStyle = computed(() => {
  if (isMobile.value) {
    return {};
  }
  return {
    backgroundImage: "url('/Images/Banner/family.webp')",
    backgroundPosition: `center ${28 + familyOffset.value}%`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    transition: "background-position 0.08s ease-out",
  };
});

let animationFrameId: number | null = null;
let intersectionObserver: IntersectionObserver | null = null;

onMounted(() => {
  isMobile.value = window.innerWidth <= 992;

  calculateTimeLeft();
  timerInterval = setInterval(calculateTimeLeft, 1000);

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isHeroVisible.value = entry.isIntersecting;
      });
    },
    { threshold: 0.1 },
  );

  if (heroRef.value) {
    intersectionObserver.observe(heroRef.value);
  }

  if (!isMobile.value) {
    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => {
      const wasMobile = isMobile.value;
      isMobile.value = window.innerWidth <= 992;

      if (isMobile.value) {
        // Reset offsets when switching to mobile
        bgOffset.value = 0;
        familyOffset.value = 0;
      } else if (!isMobile.value && wasMobile) {
        // Update parallax when switching to desktop
        updateParallax();
      } else if (!isMobile.value) {
        updateParallax();
      }
    });

    updateParallax();
  } else {
    // Mobile - ensure offsets are reset
    bgOffset.value = 0;
    familyOffset.value = 0;
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);

  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
});
</script>

<style scoped>
.hero-layer {
  background-attachment: scroll !important;
  will-change: transform, background-position;
}

.hero-layer-background {
  transform-origin: center center;
}

.hero-layer-family {
  transform-origin: center center;
}

.hero-card {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-card-focused .hero-card {
  transform: scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.hero-card .highlight {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-card-focused .highlight {
  text-shadow: 0 0 30px rgba(247, 148, 29, 0.6);
}

.hero-card .btn-primary-card {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-card-focused .btn-primary-card {
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(247, 148, 29, 0.5);
}

.hero-card .tagline {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-card-focused .tagline {
  transform: translateY(-2px);
}

@supports (-webkit-touch-callout: none) {
  .hero-layer {
    background-attachment: scroll;
  }
}

@keyframes glossyShineContinuous {
  0% {
    transform: rotate(25deg) translateX(-100%);
  }
  100% {
    transform: rotate(25deg) translateX(100%);
  }
}

@media (max-width: 992px) {
  .hero-card::before,
  .hero-card::after {
    display: none !important;
    content: none !important;
    animation: none !important;
  }

  .hero-layer {
    transform: none !important;
  }

  /* Hide family layer on mobile */
  .hero-layer-family {
    display: none !important;
  }
}

@media (min-width: 993px) {
  .hero-card::before {
    display: block !important;
    content: "" !important;
  }
}

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
