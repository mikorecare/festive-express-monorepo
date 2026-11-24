<template>
  <section
    ref="sectionEl"
    class="relative overflow-hidden bg-[#1C2D5B] py-6 sm:py-8 lg:py-10 bg-[url('/New/ChooseYourHomePackage/overlay.png')] bg-no-repeat bg-cover max-sm:pt-0"
    aria-labelledby="homes-lit-heading"
  >
    <div
      class="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-5 px-4 sm:px-6 lg:flex-row lg:justify-center lg:gap-12 lg:px-8 max-sm:px-0"
    >
      <!-- LEFT: House animation + heading overlay -->
      <div
        class="relative aspect-[720/323] w-full max-w-[640px] overflow-hidden bg-[#101B39] lg:w-[58%] lg:max-w-none max-sm:max-w-none max-sm:m-0 max-sm:p-0"
      >
        <img
          v-if="ready"
          :src="frameUrls[currentFrame]"
          alt="House illuminated with festive holiday lights"
          class="absolute inset-0 h-full w-full object-cover"
          width="720"
          height="323"
          decoding="sync"
          fetchpriority="high"
        />

        <!-- Loading spinner -->
        <div
          v-if="!ready"
          class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#101B39]"
          role="status"
          aria-live="polite"
        >
          <span
            v-if="!loadError"
            class="h-10 w-10 animate-spin rounded-full border-[3px] border-white/25 border-t-[#F49321] sm:h-12 sm:w-12"
            aria-hidden="true"
          ></span>

          <p class="px-5 text-center text-sm font-bold text-white sm:text-base">
            {{
              loadError
                ? "Unable to load house animation"
                : "Loading holiday lights..."
            }}
          </p>
        </div>

        <!-- Top fade for text readability -->
        <div
          v-if="ready"
          class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,40,0.45)_0%,rgba(7,16,40,0.1)_35%,rgba(7,16,40,0)_60%)]"
          aria-hidden="true"
        ></div>

        <!-- Heading on image -->
        <div
          v-if="ready"
          class="absolute inset-x-0 top-0 z-10 px-3 pt-[5%] text-center"
        >
          <p
            class="text-[0.7rem] font-extrabold uppercase leading-tight tracking-[0.2em] text-white drop-shadow-lg min-[400px]:text-xs sm:text-sm md:text-base lg:text-[0.8rem] xl:text-base"
          >
            Bringing Holiday
            <span class="block text-[#F49321]">Magic Hour</span>
          </p>
        </div>
      </div>

      <!-- RIGHT: Counter block -->
      <div
        v-if="ready"
        class="flex w-full flex-col items-center px-4 text-center lg:w-[34%] lg:px-0"
      >
        <h2 id="homes-lit-heading" class="sr-only">1,500+ Homes Lit!</h2>

        <!-- Counter + swoosh share one width so the swoosh matches the number -->
        <div class="inline-flex flex-col items-stretch">
          <!-- Slot machine counter -->
          <div
            class="flex items-center justify-center text-[4rem] font-black leading-none tracking-tight text-[#F49321] sm:text-[4.75rem] lg:text-[clamp(3.5rem,5.5vw,5.25rem)]"
            aria-hidden="true"
          >
            <template v-for="(digit, index) in targetDigits" :key="index">
              <span class="digit-window inline-block h-[1em] overflow-hidden">
                <span
                  class="digit-reel block"
                  :class="{ 'reel-animate': rolling }"
                  :style="{
                    transform: activated
                      ? `translateY(-${20 + digit}em)`
                      : 'translateY(0)',
                    transitionDuration: `${1400 + index * 180}ms`,
                    transitionDelay: `${index * 90}ms`,
                  }"
                >
                  <span
                    v-for="n in 30"
                    :key="n"
                    class="block h-[1em] leading-[1em]"
                  >
                    {{ (n - 1) % 10 }}
                  </span>
                </span>
              </span>

              <span v-if="index === 0">,</span>
            </template>

            <span class="self-center">+</span>
          </div>

          <!-- Swoosh: stretches to the counter's width -->
          <svg
            class="mt-1 block h-auto w-0 min-w-full"
            viewBox="0 0 262 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1.0837 21.9904C2.27418 20.6219 3.87688 19.6873 5.61135 19.1988C16.7937 16.024 74.2178 0.534738 129.486 0.064003C184.571 -0.394887 232.893 1.49166 260.685 9.78366C262.143 10.223 261.766 12.3937 260.255 12.2926C238.735 10.8234 183.567 7.87145 129.147 11.6074C69.6246 15.6966 25.2232 25.0481 13.5849 27.6803C11.0202 28.2603 8.36643 28.3176 5.77455 27.8187C2.05949 27.0968 -1.97295 25.5047 1.07291 21.9905L1.0837 21.9904Z"
              fill="#F49321"
            />
          </svg>
        </div>

        <p
          class="mt-3 text-[2.25rem] font-extrabold leading-none text-white sm:text-[2.5rem] lg:mt-5 lg:text-[clamp(2.25rem,3.6vw,3.5rem)]"
        >
          Homes Lit!
        </p>

        <p
          class="mt-3 max-w-[320px] text-base font-semibold leading-snug text-white sm:text-lg lg:max-w-none lg:text-[1rem] xl:text-xl"
        >
          Creating Holidays, <br class="hidden lg:block" />
          One Home At A Time.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const TOTAL_FRAMES = 21;
const DURATION_MS = 2000;
const BASE_PATH = "/New/ChooseYourHomePackage/AnimatedHouse";

const frameUrls = Array.from(
  { length: TOTAL_FRAMES },
  (_, index) => `${BASE_PATH}/${index + 1}.webp`,
);

const targetDigits = [1, 5, 0, 0];

const sectionEl = ref<HTMLElement | null>(null);
const ready = ref(false);
const loadError = ref(false);
const currentFrame = ref(0);
const activated = ref(false);
const rolling = ref(false);

let mounted = false;
let inFocus = false;
let runToken = 0;

let animationId: number | null = null;
let checkId: number | null = null;

let images: HTMLImageElement[] = [];

/* ----------------------------------
   Preload all animation frames
---------------------------------- */

function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {
      try {
        await img.decode?.();
      } catch {
        // Already loaded; safe to display.
      }

      resolve(img);
    };

    img.onerror = () => reject(new Error(`Could not load ${src}`));

    img.src = src;
  });
}

/* ----------------------------------
   Frame animation
---------------------------------- */

function stopFrames() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function playFrames(token: number) {
  const start = performance.now();

  function tick(now: number) {
    if (!mounted || token !== runToken || !inFocus) return;

    const progress = Math.min((now - start) / DURATION_MS, 1);

    currentFrame.value = Math.min(
      Math.floor(progress * TOTAL_FRAMES),
      TOTAL_FRAMES - 1,
    );

    if (progress < 1) {
      animationId = requestAnimationFrame(tick);
    } else {
      currentFrame.value = TOTAL_FRAMES - 1;
      animationId = null;
    }
  }

  animationId = requestAnimationFrame(tick);
}

/* ----------------------------------
   Reset animation
---------------------------------- */

function resetSequence() {
  ++runToken;

  stopFrames();

  rolling.value = false;
  activated.value = false;
  currentFrame.value = 0;
}

/* ----------------------------------
   Start lighting + slot counter
---------------------------------- */

async function startSequence() {
  const token = ++runToken;

  stopFrames();

  rolling.value = false;
  activated.value = false;
  currentFrame.value = 0;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    currentFrame.value = TOTAL_FRAMES - 1;
    activated.value = true;
    return;
  }

  // Reset DOM before replaying CSS animation
  await nextTick();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!mounted || !inFocus || token !== runToken) {
        return;
      }

      rolling.value = true;
      activated.value = true;

      playFrames(token);
    });
  });
}

/* ----------------------------------
   Detect section center
---------------------------------- */

function checkCenter() {
  if (!mounted || !ready.value || !sectionEl.value) {
    return;
  }

  if (document.hidden) {
    if (inFocus) {
      inFocus = false;
      resetSequence();
    }

    return;
  }

  const rect = sectionEl.value.getBoundingClientRect();

  const viewportCenter = window.innerHeight / 2;

  const sectionCenter = rect.top + rect.height / 2;

  const distance = Math.abs(sectionCenter - viewportCenter);

  const enterTolerance = Math.min(220, window.innerHeight * 0.22);

  const exitTolerance = Math.min(320, window.innerHeight * 0.34);

  if (!inFocus && distance <= enterTolerance) {
    inFocus = true;
    void startSequence();
  } else if (inFocus && distance >= exitTolerance) {
    inFocus = false;
    resetSequence();
  }
}

/* ----------------------------------
   Throttled scroll observer
---------------------------------- */

function scheduleCenterCheck() {
  if (checkId !== null) return;

  checkId = requestAnimationFrame(() => {
    checkId = null;
    checkCenter();
  });
}

function removeScrollListeners() {
  window.removeEventListener("scroll", scheduleCenterCheck);

  window.removeEventListener("resize", scheduleCenterCheck);

  document.removeEventListener("visibilitychange", scheduleCenterCheck);
}

/* ----------------------------------
   Lifecycle
---------------------------------- */

onMounted(async () => {
  mounted = true;

  window.addEventListener("scroll", scheduleCenterCheck, { passive: true });

  window.addEventListener("resize", scheduleCenterCheck, { passive: true });

  document.addEventListener("visibilitychange", scheduleCenterCheck);

  try {
    images = await Promise.all(frameUrls.map(preloadImage));

    if (!mounted) return;

    ready.value = true;

    await nextTick();

    scheduleCenterCheck();
  } catch (error) {
    if (!mounted) return;

    loadError.value = true;

    console.error("House animation preload failed:", error);
  }
});

onUnmounted(() => {
  mounted = false;

  removeScrollListeners();

  ++runToken;

  stopFrames();

  if (checkId !== null) {
    cancelAnimationFrame(checkId);
  }

  images = [];
});
</script>

<style scoped>
.digit-window {
  width: 0.65em;
  font-variant-numeric: tabular-nums;
}

.digit-reel {
  transition: none;
}

.digit-reel.reel-animate {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.12, 0.75, 0.12, 1);
}

@media (prefers-reduced-motion: reduce) {
  .digit-reel {
    transition: none !important;
  }
}

.img-mask {
  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 5%,
    rgba(0, 0, 0, 1) 71%
  );
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 5%,
    rgba(0, 0, 0, 1) 71%
  );
}
</style>
