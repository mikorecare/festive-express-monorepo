<template>
  <section
    class="relative w-full overflow-hidden bg-gray-50 flex flex-col min-h-[800px] lg:min-h-[700px]"
    aria-label="Holiday Lighting Services Hero"
  >
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <picture class="block w-full h-full">
        <source
          media="(min-width: 1024px)"
          srcset="/New/Banner/bg-family-new.webp"
        />
        <img
          src="/New/Banner/bg-family-mobile-new.png"
          alt="Family happily enjoying professionally installed holiday lights on their home"
          fetchpriority="high"
          decoding="async"
          class="block w-full object-contain object-bottom lg:h-full lg:translate-y-0 lg:object-fill lg:object-center"
        />
      </picture>
    </div>

    <!-- Mobile-only white fades so the text is readable over the house -->

    <!-- Main Content Container -->
    <div
      class="relative z-10 w-full max-w-7xl mr-auto px-4 lg:px-8 pt-8 sm:pt-12 lg:pt-24 pb-6 lg:pb-16 flex-1 flex flex-col lg:block lg:flex-none lg:my-auto"
    >
      <div
        class="w-full lg:w-auto max-w-2xl text-left mr-0 lg:mr-auto ml-0 lg:ml-10 flex-1 flex flex-col lg:block"
      >
        <!-- Eyebrow -->
        <div
          class="flex items-center justify-start gap-3 sm:gap-4 text-brand-orange font-bold tracking-wide sm:tracking-wider text-base sm:text-xl mb-3 sm:mb-6"
        >
          <span>RENT</span>
          <span
            class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-orange"
            aria-hidden="true"
          ></span>
          <span>RELAX</span>
          <span
            class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-orange"
            aria-hidden="true"
          ></span>
          <span>CELEBRATE</span>
        </div>

        <!-- Headline: scales with viewport so "Holiday Magic" stays on one line on phones -->
        <h1
          v-fade-left
          class="text-[clamp(1.9rem,8.6vw,3rem)] text-7xl font-black text-navy leading-[1.1] mb-4 sm:mb-6"
        >
          Holiday Lighting<br />
          From Your
          <br />
          <span class="relative inline-block">
            Couch
            <svg
              class="absolute w-[105%] h-auto -bottom-2 -left-[2.5%] pointer-events-none"
              viewBox="0 0 242.54 25.21"
              fill="#f49321"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M1.01,19.51c1.11-1.25,2.6-2.1,4.21-2.54C15.6,14.11,68.9.17,120.13,0c51.06-.16,95.84,1.8,121.56,9.54,1.35.41.99,2.4-.41,2.3-19.94-1.45-71.06-4.42-121.52-1.25-55.19,3.47-96.39,11.84-107.19,14.2-2.38.52-4.84.56-7.24.09-3.44-.68-7.17-2.16-4.33-5.37Z"
              />
            </svg>
          </span>
        </h1>

        <!-- Subheadline -->
        <!-- Subheadline -->
        <p
          v-fade-left
          class="text-2xl font-bold lg:font-semibold text-navy mb-3 sm:mb-4 sm:max-w-none leading-snug lg:leading-normal max-lg:whitespace-nowrap [text-shadow:0_0_15px_rgba(255,255,255,1)] lg:[text-shadow:none]"
        >
          A complete<br class="lg:hidden" />
          holiday decorating<br class="lg:hidden" />
          experience from<br class="lg:hidden" />
          your couch.
        </p>

        <!-- Description -->
        <p
          v-fade-left
          class="text-xs sm:text-lg text-navy/95 lg:mb-10 sm:max-w-xl leading-relaxed lg:leading-normal max-lg:whitespace-nowrap [text-shadow:0_0_15px_rgba(255,255,255,1)] lg:[text-shadow:none]"
        >
          We install, maintain, and<br class="lg:hidden" />
          take it all down — so you<br class="lg:hidden" />
          can simply relax and<br class="lg:hidden" />
          enjoy the season.
        </p>

        <!-- Buttons: mt-auto pushes them to the bottom of the hero on mobile,
             pt-48 guarantees a minimum gap so the family stays visible -->
        <div
          v-fade-left
          class="max-lg:mt-auto max-lg:pt-48 w-full flex flex-col items-center gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-start"
        >
          <NuxtLink
            to="#preview"
            class="w-full max-w-[18rem] sm:max-w-sm mx-auto lg:!mx-0 lg:!w-auto lg:!max-w-none lg:shrink-0 btn-3d-glossy flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg shadow-blue-900/20"
          >
            Preview Your Home →
          </NuxtLink>

          <NuxtLink
            to="/packages"
            class="w-full max-w-[18rem] sm:max-w-sm mx-auto lg:!mx-0 lg:!w-auto lg:!max-w-none lg:shrink-0 btn-3d-glossy btn-3d-glossy-orange text-center px-4 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg shadow-orange-500/20"
          >
            Explore the Packages
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Features Bar -->
    <aside
      class="relative z-10 w-[calc(100%-1.5rem)] lg:w-full max-w-6xl mx-auto mt-auto mb-5 lg:mb-12 bg-white rounded-3xl lg:rounded-[2rem] shadow-xl py-4 lg:py-4 px-2 sm:px-6 lg:px-8"
      aria-label="Key Features"
    >
      <div class="flex flex-row items-center justify-between">
        <!-- Feature 1 -->
        <div
          class="flex-1 flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4 text-center lg:text-left"
        >
          <svg
            class="w-8 h-8 lg:w-9 lg:h-9 text-[#F28E2B] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
            <path d="M11 3 8 9l4 12 4-12-3-6" />
            <path d="M2 9h20" />
          </svg>
          <span
            class="whitespace-nowrap text-[10px] min-[380px]:text-[11px] sm:text-base lg:text-[19px] font-extrabold text-navy leading-[1.2] lg:leading-[1.15]"
          >
            Custom Designs<br />for Every Home
          </span>
        </div>

        <div
          class="w-[2px] h-12 lg:h-10 bg-[#F28E2B] flex-shrink-0"
          aria-hidden="true"
        ></div>

        <!-- Feature 2 -->
        <div
          class="flex-1 flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4 text-center lg:text-left"
        >
          <svg
            class="w-8 h-8 lg:w-9 lg:h-9 text-[#F28E2B] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span
            class="whitespace-nowrap text-[10px] min-[380px]:text-[11px] sm:text-base lg:text-[19px] font-extrabold text-navy leading-[1.2] lg:leading-[1.15]"
          >
            Safe, Professional<br />Installation
          </span>
        </div>

        <div
          class="w-[2px] h-12 lg:h-10 bg-[#F28E2B] flex-shrink-0"
          aria-hidden="true"
        ></div>

        <!-- Feature 3 -->
        <div
          class="flex-1 flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4 text-center lg:text-left"
        >
          <svg
            class="w-8 h-8 lg:w-9 lg:h-9 text-[#F28E2B] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path
              d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
            />
          </svg>
          <span
            class="whitespace-nowrap text-[10px] min-[380px]:text-[11px] sm:text-base lg:text-[19px] font-extrabold text-navy leading-[1.2] lg:leading-[1.15]"
          >
            Hassle-Free<br />Seasonal Service
          </span>
        </div>
      </div>
    </aside>
  </section>
</template>

<script setup>
// No reactive state needed for this purely presentational hero component
</script>
