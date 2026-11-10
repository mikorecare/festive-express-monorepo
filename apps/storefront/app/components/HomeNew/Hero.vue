<template>
  <div
    ref="heroRef"
    class="hero-banner relative min-h-[88dvh] overflow-hidden flex items-center max-lg:min-h-[85dvh] max-lg:py-0 border-b-[27px] border-[#F49321]"
  >
    <!-- MOBILE -->
    <div class="lg:hidden absolute inset-0 z-0">
      <NuxtImg
        src="/New/Banner/bg-family-mobile.webp"
        alt=""
        role="none"
        sizes="xs:100vw sm:100vw md:100vw"
        format="webp"
        quality="75"
        :img-attrs="{ loading: 'eager', fetchpriority: 'high' }"
        preload
        class="w-full h-full object-cover object-[center_50%]"
      />
    </div>

    <!-- ==================================================== -->
    <!-- 💻 DESKTOP HERO LAYER (z-0)                           -->
    <!-- ==================================================== -->
    <div v-if="!isMobile" class="hero-carousel absolute inset-0 max-lg:hidden">
      <div
        v-for="(src, i) in desktopSlides"
        :key="src"
        class="hero-slide"
        :class="{ 'is-hero': i === activeIndex }"
      >
        <NuxtImg
          :src="src"
          alt=""
          role="none"
          sizes="lg:100vw xl:100vw"
          format="webp"
          quality="100"
          :img-attrs="{
            loading: 'eager',
            fetchpriority: i === 0 ? 'high' : 'auto',
            decoding: 'async',
          }"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- 🌱 GROWING CARD (z-5)                                 -->
    <!-- ==================================================== -->
    <div
      v-if="!isMobile && growIndex !== null"
      class="hero-grow max-lg:hidden"
      :class="{ 'is-expanded': expanding }"
      :style="growStyle"
    >
      <NuxtImg
        :src="slideAt(growIndex)"
        alt=""
        role="none"
        sizes="lg:100vw xl:100vw"
        format="webp"
        quality="100"
        :img-attrs="{
          loading: 'eager',
          fetchpriority: 'high',
          decoding: 'async',
        }"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- OVERLAY z-10 -->
    <div class="overlay absolute inset-0 z-10 max-lg:bg-black/25"></div>

    <!-- CONTENT z-20 -->
    <div
      class="hero-content-container relative z-20 w-full max-w-[1200px] px-[5%] lg:pl-[15%] flex justify-start items-center gap-5 max-lg:flex-col max-lg:items-start max-lg:gap-0 max-lg:px-[6%] max-lg:pt-10 max-lg:w-full max-lg:h-[80dvh]"
    >
      <div
        class="hero-card relative w-full max-w-[460px] bg-[#161c30]/50 backdrop-blur-sm rounded-2xl p-11 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-white text-center border border-white/12 overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:-left-[150%] before:w-[200%] before:h-[200%] before:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] before:rotate-[25deg] before:pointer-events-none before:animate-[glossyShineContinuous_3s_linear_infinite] max-lg:max-w-full max-lg:p-0 max-lg:text-left max-lg:!bg-transparent max-lg:!backdrop-blur-none max-lg:!border-none max-lg:!shadow-none max-lg:!rounded-none max-lg:before:!hidden max-lg:after:!hidden max-lg:flex max-lg:flex-col max-lg:h-full max-lg:justify-between"
        :class="{ 'hero-card-focused': isHeroVisible }"
      >
        <div>
          <h1
            class="text-4xl text-start font-extrabold leading-[1.15] mb-4 tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] max-lg:text-[1.5rem] max-lg:mb-2 max-lg:leading-[1.2] max-lg:drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]"
          >
            <!-- Part 1: navy fill, white outline -->
            <span
              class="highlight block text-white [-webkit-text-stroke:0.085em_#1C2D5B] [paint-order:stroke_fill] drop-shadow-[0_4px_10px_rgba(28,45,91,0.45)] tracking-wider max-lg:[-webkit-text-stroke:1.5px_#1C2D5B]"
              >{{ heroH1White }}</span
            >

            <!-- Part 2: navy fill, white outline -->
            <span
              class="block text-[#1C2D5B] [-webkit-text-stroke:0.055em_#ffffff] [paint-order:stroke_fill] max-lg:[-webkit-text-stroke:1.5px_#ffffff]"
              >{{ heroH1Orange }}</span
            >
          </h1>
        </div>

        <!-- BUTTONS: Removed max-lg:text-base so they stay huge -->
        <div class="flex flex-col gap-3 w-full items-center max-lg:pb-6">
          <div class="flex flex-col gap-4 w-full max-w-[340px] mx-auto">
            <NuxtLink
              to="#preview"
              class="btn-3d-glossy relative uppercase inline-flex items-center justify-center bg-[#1C2D5B] text-white font-bold text-[1.4rem] rounded-[50px] border-2 border-white px-4 lg:px-6 py-[12px] sm:py-[14px] hover:bg-[#e0850a] transition-all duration-200 ease-in-out tracking-[0.5px] max-lg:w-full whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
            >
              <span class="relative z-10">Preview your home</span>
            </NuxtLink>
            <NuxtLink
              to="/packages"
              class="btn-3d-glossy btn-3d-glossy-orange relative uppercase inline-flex items-center justify-center bg-[#F49321] text-white font-bold text-[1.4rem] rounded-[50px] border-2 border-white px-4 lg:px-6 py-[12px] sm:py-[14px] hover:bg-[#e0850a] transition-all duration-200 ease-in-out tracking-[0.5px] max-lg:w-full whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
            >
              <span class="relative z-10">{{ heroButtonLabel }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================================================== -->
    <!-- 🃏 QUEUE (z-30) — ONLY upcoming slides.               -->
    <!-- ==================================================== -->
    <TransitionGroup
      v-if="!isMobile"
      tag="div"
      name="q"
      class="hero-queue max-lg:hidden"
      :style="{ '--queue-w': queueWidth + 'px' }"
    >
      <div
        v-for="(idx, slot) in queue"
        :key="'q-' + idx"
        class="hero-card-slide is-queued"
        :style="{ '--x': slot * SLOT_STEP + 'px' }"
      >
        <NuxtImg
          :src="slideAt(idx)"
          alt=""
          role="none"
          sizes="120px"
          format="webp"
          quality="75"
          :img-attrs="{ loading: 'eager', decoding: 'async' }"
          class="w-full h-full object-cover"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval: ReturnType<typeof setInterval> | null = null;
const heroRef = ref<HTMLElement | null>(null);
const isHeroVisible = ref(false);

const isMobile = ref(false);
const FL_TZ = "America/New_York";

const heroWidth = ref(1200);
const heroHeight = ref(700);

const flParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: FL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === t)?.value || 0);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
};

const floridaWallTimeToUtc = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
) => {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const shown = flParts(new Date(utcGuess));
  const asUtc = Date.UTC(
    shown.year,
    shown.month - 1,
    shown.day,
    shown.hour,
    shown.minute,
    shown.second,
  );
  return utcGuess - (asUtc - utcGuess);
};

const calculateTimeLeft = () => {
  const now = Date.now();
  const year = flParts(new Date()).year;
  let christmas = floridaWallTimeToUtc(year, 12, 25, 0, 0, 0);
  if (now >= christmas)
    christmas = floridaWallTimeToUtc(year + 1, 12, 25, 0, 0, 0);
  const diff = christmas - now;
  if (diff <= 0) return;
  timeLeft.value = {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const formatNumber = (num: number) => String(num).padStart(2, "0");

// ============================================
// 🎠 CAROUSEL
// ============================================
const desktopSlides = [
  "/New/Banner/bg-family.webp",
  "/New/Banner/bg-family-3.webp",
  "/New/Banner/bg-family-2.webp",
] as const;

const TOTAL = desktopSlides.length;

const slideAt = (i: number): string => {
  return desktopSlides[((i % TOTAL) + TOTAL) % TOTAL]!;
};

const SLIDE_MS = 6000;
const GROW_MS = 900;

// card geometry (keep in sync with the CSS below)
const CARD_W = 120;
const CARD_H = 180;
const CARD_GAP = 20;
const SLOT_STEP = CARD_W + CARD_GAP;
const QUEUE_RIGHT = 40;
const QUEUE_BOTTOM = 40;

// the queue holds every slide EXCEPT the current hero
const queueWidth = (TOTAL - 1) * SLOT_STEP - CARD_GAP;

const buildQueue = (active: number) =>
  Array.from({ length: TOTAL - 1 }, (_, i) => (active + 1 + i) % TOTAL);

const activeIndex = ref(0); // current hero (never in the queue)
const queue = ref<number[]>(buildQueue(0)); // upcoming slides, slot 0 = next
const growIndex = ref<number | null>(null); // card currently growing
const expanding = ref(false);
const prefersReducedMotion = ref(false);

let carouselInterval: ReturnType<typeof setInterval> | null = null;
let commitTimeout: ReturnType<typeof setTimeout> | null = null;
let rafId: number | null = null;

// grow card: starts exactly on queue slot 0, ends full-bleed
const growStyle = computed(() => {
  if (expanding.value) {
    return {
      left: "0px",
      top: "0px",
      width: heroWidth.value + "px",
      height: heroHeight.value + "px",
      borderRadius: "0px",
    };
  }
  return {
    left: heroWidth.value - QUEUE_RIGHT - queueWidth + "px",
    top: heroHeight.value - QUEUE_BOTTOM - CARD_H + "px",
    width: CARD_W + "px",
    height: CARD_H + "px",
    borderRadius: "12px",
  };
});

const advanceCarousel = () => {
  if (growIndex.value !== null) return; // already animating

  const outgoing = activeIndex.value;
  const incoming = queue.value[0]!;

  // 1. mount the grow card on top of slot 0 (small, not expanded yet)
  expanding.value = false;
  growIndex.value = incoming;

  // 2. wait two frames so the small state is painted, then:
  //    - grow the card to full-bleed
  //    - remove it from the queue (it fades out under the grow card)
  //    - remaining cards slide LEFT
  //    - the previous hero enters from the RIGHT as the last card
  rafId = requestAnimationFrame(() => {
    rafId = requestAnimationFrame(() => {
      expanding.value = true;
      queue.value = [...queue.value.slice(1), outgoing];

      // 3. when the growth is done, the stacked hero layer switches to the
      //    new slide (same image, same size → seamless) and the grow card goes.
      commitTimeout = setTimeout(() => {
        activeIndex.value = incoming;
        growIndex.value = null;
        expanding.value = false;
      }, GROW_MS + 60);
    });
  });
};

const startCarousel = () => {
  if (carouselInterval) return;
  carouselInterval = setInterval(advanceCarousel, SLIDE_MS);
};
const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
};

let intersectionObserver: IntersectionObserver | null = null;
let resizeObserver: ResizeObserver | null = null;

const {
  isEarlyBirdActive,
  loadEarlyBird,
  earlyBirdEnabled,
  earlyBirdExpiresAt,
  earlyBirdIconSecondaryUrl,
  formatEndsLabel,
} = await useEarlyBirdSpecial();

const {
  heroH1White,
  heroH1Orange,
  heroDescription1,
  heroDescription2,
  heroButtonLabel,
  heroCountdownEnabled,
  loadHeroSettings,
} = useHeroSettings();

const handleVisibilityChange = () => {
  if (document.hidden) stopCarousel();
  else if (!isMobile.value && !prefersReducedMotion.value) startCarousel();
};
const handleResize = () => {
  isMobile.value = window.innerWidth <= 992;
  if (isMobile.value) stopCarousel();
  else if (!prefersReducedMotion.value) startCarousel();
};

onMounted(() => {
  loadEarlyBird();
  loadHeroSettings();
  isMobile.value = window.innerWidth <= 992;

  if (heroRef.value) {
    heroWidth.value = heroRef.value.clientWidth;
    heroHeight.value = heroRef.value.clientHeight;
    resizeObserver = new ResizeObserver(() => {
      if (!heroRef.value) return;
      heroWidth.value = heroRef.value.clientWidth;
      heroHeight.value = heroRef.value.clientHeight;
    });
    resizeObserver.observe(heroRef.value);
  }

  calculateTimeLeft();
  timerInterval = setInterval(calculateTimeLeft, 1000);

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        isHeroVisible.value = e.isIntersecting;
      });
    },
    { threshold: 0.1 },
  );
  if (heroRef.value) intersectionObserver.observe(heroRef.value);

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = mq.matches;

  if (!isMobile.value && !prefersReducedMotion.value) startCarousel();

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (commitTimeout) clearTimeout(commitTimeout);
  if (rafId) cancelAnimationFrame(rafId);
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  stopCarousel();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.hero-layer {
  background-attachment: scroll !important;
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

/* ============================================ */
/* 🎬 HERO LAYER — z-0                           */
/* ============================================ */
.hero-carousel {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #0b1020;
  z-index: 0;
}
.hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}
.hero-slide.is-hero {
  z-index: 1;
}
.hero-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
}

/* ============================================ */
/* 🌱 GROWING CARD — z-5 (under overlay/content) */
/* ============================================ */
.hero-grow {
  position: absolute;
  z-index: 5;
  overflow: hidden;
  background: #0b1020;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
  pointer-events: none;
  transition:
    left 900ms cubic-bezier(0.65, 0, 0.35, 1),
    top 900ms cubic-bezier(0.65, 0, 0.35, 1),
    width 900ms cubic-bezier(0.65, 0, 0.35, 1),
    height 900ms cubic-bezier(0.65, 0, 0.35, 1),
    border-radius 900ms cubic-bezier(0.65, 0, 0.35, 1),
    box-shadow 900ms cubic-bezier(0.65, 0, 0.35, 1);
  will-change: left, top, width, height;
}
.hero-grow.is-expanded {
  box-shadow: none;
}
.hero-grow img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
}

/* ============================================ */
/* 🃏 QUEUE STRIP — z-30                          */
/* ============================================ */
.hero-queue {
  position: absolute;
  right: 40px; /* keep in sync with QUEUE_RIGHT */
  bottom: 40px; /* keep in sync with QUEUE_BOTTOM */
  width: var(--queue-w, 260px);
  height: 180px;
  z-index: 30;
  pointer-events: none;
  overflow: visible;
}

.hero-card-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
  background: #0b1020;
  transform: translateX(var(--x, 0px));
}
.hero-card-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
}
.hero-card-slide.is-queued {
  transition:
    transform 900ms cubic-bezier(0.65, 0, 0.35, 1),
    opacity 500ms ease;
  will-change: transform, opacity;
}

/* previous hero enters from the RIGHT, pushing the others left */
.hero-card-slide.is-queued.q-enter-from {
  opacity: 0;
  transform: translateX(calc(var(--x, 0px) + 240px));
}

/* the card that became the hero fades out while the grow card takes over */
.hero-card-slide.is-queued.q-leave-active {
  transition: opacity 250ms ease;
}
.hero-card-slide.is-queued.q-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .hero-grow,
  .hero-card-slide.is-queued {
    transition: opacity 300ms ease;
  }
}
</style>
