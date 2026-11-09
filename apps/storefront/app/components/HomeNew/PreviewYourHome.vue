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
      <div class="mb-10 lg:mb-14">
        <!-- Eyebrow -->
        <h2
          class="text-[#F49321] text-center font-extrabold text-3xl tracking-wide mb-4 sm:text-4xl md:text-5xl lg:text-6xl lg:mb-6 [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_6px_rgba(28,45,91,0.35)] lg:[text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
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
        <div class="relative row-start-1 lg:row-start-1 lg:col-start-2 lg:pt-8">
          <h2
            v-fade
            id="estimator-heading"
            class="text-2xl sm:text-3xl font-extrabold text-[#1C2D5B] leading-[1.15] mb-2.5 sm:mb-3 text-left lg:text-6xl lg:leading-[1.05] lg:mb-5 uppercase tracking-wide"
          >
            See your home
            <span
              class="block mt-1.5 sm:mt-2 lg:mt-3 text-[#F49321] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_6px_rgba(28,45,91,0.35)] lg:[text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
            >
              Gift-wrapped in lights.
            </span>
          </h2>
          <p
            v-fade
            class="hidden sm:block text-[#3b4a6b] text-sm sm:text-base font-medium text-left lg:text-xl lg:max-w-[760px] mb-6 lg:mb-10"
          >
            Enter your address, pick a package and a color, click on "Light Up
            My Home."
          </p>

          <ol
            v-fade
            class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:mt-8 lg:mt-10 lg:block lg:space-y-5"
          >
            <li
              v-for="(step, i) in steps"
              :key="i"
              class="flex items-center gap-2 sm:gap-4"
            >
              <span
                class="shrink-0 w-7 h-7 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-[#F49321] text-[#1C2D5B] font-black text-sm sm:text-xl lg:text-2xl flex items-center justify-center shadow-[0_4px_10px_rgba(244,147,33,0.4)] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]"
                aria-hidden="true"
              >
                {{ i + 1 }}
              </span>
              <span
                class="text-[13px] leading-tight sm:text-xl lg:text-2xl font-bold text-black"
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
