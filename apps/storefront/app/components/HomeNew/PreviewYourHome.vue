<template>
  <section
    aria-labelledby="estimator-heading"
    class="relative w-full px-1 sm:px-6 bg-white overflow-hidden py-10 sm:py-14 lg:py-20"
    id="preview"
  >
    <!-- Decorative background -->
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-[url('/Images/LV.webp')] bg-no-repeat bg-center"
      aria-hidden="true"
    ></div>

    <div
      class="relative z-10 w-full max-w-full mx-auto p-3 sm:p-4 rounded-xl sm:max-w-[90vw] lg:max-w-[1280px] lg:p-8"
    >
      <!-- ========================================== -->
      <!-- TITLE DESIGN MATCHING "HOW IT WORKS"       -->
      <!-- ========================================== -->
      <div class="mb-10 lg:mb-12">
        <!-- Eyebrow -->
        <h2
          class="text-[#F49321] text-center font-extrabold text-4xl tracking-wide sm:text-5xl md:text-6xl lg:text-7xl [text-shadow:_-1.5px_-1.5px_0_#fff,_1.5px_-1.5px_0_#fff,_-1.5px_1.5px_0_#fff,_1.5px_1.5px_0_#fff,_0_3px_8px_rgba(28,45,91,0.35)] lg:[text-shadow:_-3px_-3px_0_#fff,_3px_-3px_0_#fff,_-3px_3px_0_#fff,_3px_3px_0_#fff,_0_5px_12px_rgba(28,45,91,0.45)]"
        >
          Preview Your Home
        </h2>
      </div>

      <!-- ========================================== -->

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <!-- Estimator: mobile row-2, desktop col-1 -->
        <div
          v-fade
          class="relative flex justify-center lg:justify-start row-start-2 lg:row-start-1 lg:col-start-1"
        >
          <div
            class="w-full bg-white/95 rounded-2xl shadow-xl p-3.5 sm:p-5 lg:p-0 lg:bg-transparent lg:shadow-none"
          >
            <PreviewYourHomeEstimatorWidget :show-header="false" />
          </div>
          <div
            class="hidden lg:block absolute -bottom-6 -left-64 z-[-1]"
            aria-hidden="true"
          >
            <PreviewYourHomeButton :size="350" :has-link="false" />
          </div>
        </div>

        <!-- Copy: mobile row-1, desktop col-2 -->
        <div
          class="relative row-start-1 lg:row-start-1 lg:col-start-2 lg:pt-10"
        >
          <h2
            v-fade
            id="estimator-heading"
            class="text-3xl sm:text-4xl font-extrabold text-[#1C2D5B] leading-[1.15] mb-3.5 sm:mb-4 text-left lg:text-7xl lg:leading-[1.05] lg:mb-6 uppercase tracking-wide"
          >
            See your home
            <span
              class="block text-[#F49321] [text-shadow:_-1.5px_-1.5px_0_#fff,_1.5px_-1.5px_0_#fff,_-1.5px_1.5px_0_#fff,_1.5px_1.5px_0_#fff,_0_3px_8px_rgba(28,45,91,0.35)] lg:[text-shadow:_-3px_-3px_0_#fff,_3px_-3px_0_#fff,_-3px_3px_0_#fff,_3px_3px_0_#fff,_0_5px_12px_rgba(28,45,91,0.45)]"
            >
              Gift-wrapped in lights.
            </span>
          </h2>
          <p
            v-fade
            class="hidden sm:block text-[#3b4a6b] text-base sm:text-lg font-medium text-left lg:text-2xl lg:max-w-[840px] mb-8 lg:mb-12"
          >
            Enter your address, pick a package and a color, click on "Light Up
            My Home."
          </p>

          <ol
            v-fade
            class="mt-4 grid grid-cols-2 gap-x-2 gap-y-4 sm:mt-9 sm:gap-y-6 lg:mt-12 lg:block lg:space-y-6"
          >
            <li
              v-for="(step, i) in steps"
              :key="i"
              class="flex items-center gap-2 sm:gap-5"
            >
              <span
                class="shrink-0 w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-[#F49321] text-[#1C2D5B] font-black text-lg sm:text-xl lg:text-2xl flex items-center justify-center shadow-[0_4px_10px_rgba(244,147,33,0.4)] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]"
                aria-hidden="true"
              >
                {{ i + 1 }}
              </span>
              <span
                class="text-md leading-tight lg:text-3xl font-bold text-black"
              >
                {{ step }}
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  "Enter your address",
  "Select the package",
  "Pick your color",
  "View your home",
];
</script>
