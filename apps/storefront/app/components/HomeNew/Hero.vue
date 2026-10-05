<template>
  <div
    ref="heroRef"
    class="hero-banner relative min-h-[90dvh] overflow-hidden flex items-center max-lg:min-h-auto max-lg:py-10 border-b-[27px] border-[#F49321]"
  >
    <!-- ========================================== -->
    <!-- 📱 MOBILE ONLY HERO LAYER (High Performance) -->
    <!-- ========================================== -->
    <div class="lg:hidden absolute inset-0 z-0">
      <NuxtImg
        src="/New/Banner/bg-family-mobile.webp"
        alt=""
        role="none"
        sizes="xs:100vw sm:100vw md:100vw"
        format="webp"
        quality="75"
        :img-attrs="{
          loading: 'eager',
          fetchpriority: 'high',
        }"
        preload
        class="w-full h-full object-cover"
      />
    </div>

    <!-- ========================================== -->
    <!-- 💻 DESKTOP ONLY HERO LAYER (Static)        -->
    <!-- ========================================== -->
    <NuxtImg
      v-if="!isMobile"
      src="/New/Banner/bg-family.webp"
      alt=""
      role="none"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
      format="webp"
      quality="80"
      :img-attrs="{
        loading: 'eager',
        fetchpriority: 'high',
        decoding: 'async',
      }"
      preload
      class="hero-layer absolute inset-0 w-full h-full object-cover z-0 max-lg:hidden"
    />

    <!-- ========================================== -->
    <!-- 🛠️ COMMON OVERLAYS & STRUCTURAL CONTENT     -->
    <!-- ========================================== -->
    <div class="overlay absolute inset-0 z-[2] max-lg:bg-black/25"></div>

    <CountdownWidget
      v-if="heroCountdownEnabled"
      class="desktop-widget max-lg:hidden"
      :time-left="timeLeft"
      :format-number="formatNumber"
    />

    <CountdownWidget
      v-if="heroCountdownEnabled"
      class="mobile-widget lg:hidden"
      :time-left="timeLeft"
      :format-number="formatNumber"
    />

    <div
      class="hero-content-container relative z-[3] w-full max-w-[1200px] px-[5%] lg:pl-[22%] flex justify-start items-center gap-5 max-lg:flex-col max-lg:items-start max-lg:gap-8 max-lg:px-[6%] max-lg:py-6"
    >
      <div
        class="hero-card relative w-full max-w-[460px] bg-[#161c30]/50 backdrop-blur-sm rounded-2xl p-11 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-white text-center border border-white/12 overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:-left-[150%] before:w-[200%] before:h-[200%] before:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] before:rotate-[25deg] before:pointer-events-none before:animate-[glossyShineContinuous_3s_linear_infinite] max-lg:max-w-full max-lg:p-0 max-lg:text-left max-lg:!bg-transparent max-lg:!backdrop-blur-none max-lg:!border-none max-lg:!shadow-none max-lg:!rounded-none max-lg:before:!hidden max-lg:after:!hidden max-lg:flex max-lg:flex-col max-lg:gap-8"
        :class="{ 'hero-card-focused': isHeroVisible }"
      >
        <!-- Top Section: Title and Tagline -->
        <div>
          <h1
            class="text-4xl text-start font-extrabold leading-[1.15] mb-4 tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] max-lg:text-[1.5rem] max-lg:mb-2 max-lg:leading-[1.2] max-lg:drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)] max-lg:[text-shadow:0_2px_6px_rgba(0,0,0,0.95),0_4px_16px_rgba(0,0,0,0.75)]"
          >
            <span class="highlight block text-[#F49321]">{{
              heroH1White
            }}</span>
            <span class="block text-white">{{ heroH1Orange }}</span>
          </h1>

          <p
            class="tagline text-start text-[1.1rem] font-bold leading-[1.35] tracking-wide mb-8 text-slate-200 max-lg:text-[0.9rem] max-lg:mb-0 max-lg:leading-[1.4] max-lg:[text-shadow:0_2px_4px_rgba(0,0,0,0.7)]"
          >
            <template v-for="(part, i) in heroDescription1.split('|')" :key="i">
              <br v-if="i > 0" class="mobile-only" />
              {{ part }}
            </template>
            <br />
          </p>

          <p
            class="subtext block text-start text-[0.88rem] tracking-widest font-semibold my-4 opacity-90 max-lg:text-[0.78rem] max-lg:mt-2"
          >
            <template
              v-for="(part2, i) in heroDescription2.split('|')"
              :key="i"
            >
              <br v-if="i > 0" class="mobile-only" />
              {{ part2 }}<span v-if="i === 0">.</span>
            </template>
          </p>
        </div>

        <!-- Bottom Section: Buttons -->
        <div class="flex flex-col gap-3 w-full">
          <!-- Button 1 -->
          <NuxtLink
            to="#preview"
            class="relative uppercase inline-flex items-center justify-center bg-transparent text-[#F49321] font-extrabold text-lg rounded-full border-[3px] border-[#F49321] px-12 py-2 hover:bg-[#e0850a] transition-colors max-lg:text-base max-lg:px-6 max-lg:py-3 max-lg:border-2 max-lg:w-full"
          >
            <span>Preview your home</span>
          </NuxtLink>

          <!-- Button 2 -->
          <NuxtLink
            to="/packages"
            class="relative inline-flex items-center justify-center uppercase bg-[#F49321] text-white font-extrabold text-lg rounded-full border-[3px] border-[#F49321] shadow-[0_0_0_4px_#F49321] px-12 py-2 hover:bg-[#e0850a] transition-colors max-lg:text-base max-lg:px-6 max-lg:py-3 max-lg:border-2 max-lg:shadow-none max-lg:w-full"
          >
            <span>{{ heroButtonLabel }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval: ReturnType<typeof setInterval> | null = null;
const heroRef = ref<HTMLElement | null>(null);
const isHeroVisible = ref(false);

const isMobile = ref(false);
const FL_TZ = "America/New_York";

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

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value || 0);

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
  if (now >= christmas) {
    christmas = floridaWallTimeToUtc(year + 1, 12, 25, 0, 0, 0);
  }

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

const bgStyle = computed(() => {
  if (isMobile.value) {
    return {
      backgroundImage: "url('/New/Banner/bg-family-mobile.webp')",
      backgroundPosition: "center center",
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
    };
  }
  return {
    backgroundImage: "url('/New/Banner/bg-family.webp')",
    backgroundPosition: "center center",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
  };
});

let intersectionObserver: IntersectionObserver | null = null;

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

onMounted(() => {
  loadEarlyBird();
  loadHeroSettings();
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

  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth <= 992;
  });
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);

  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
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
