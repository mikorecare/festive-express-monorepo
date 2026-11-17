<template>
  <section
    class="relative w-full overflow-hidden bg-[#f8f9fa] py-16 lg:py-24 border-y border-slate-200"
  >
    <!-- Background Image -->
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-[url('/Images/LV.webp')] bg-cover bg-center bg-no-repeat"
      aria-hidden="true"
    ></div>

    <!-- Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
      <div
        class="flex flex-col lg:flex-row items-center justify-between gap-10"
      >
        <!-- Left Side: Text -->
        <div class="text-center lg:text-left max-w-2xl">
          <p
            class="text-[#1C2F5B] font-extrabold uppercase tracking-wider text-sm md:text-base mb-1"
          >
            Your project starts here
          </p>
          <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            <span class="text-[#F49321] font-extrabold text-4xl tracking-wide mb-1.5 text-center lg:text-left lg:mb-4 [text-shadow:_-1.5px_-1.5px_0_#fff,_1.5px_-1.5px_0_#fff,_-1.5px_1.5px_0_#fff,_1.5px_1.5px_0_#fff,_0_3px_8px_rgba(28,45,91,0.35)] lg:[text-shadow:_-3px_-3px_0_#fff,_3px_-3px_0_#fff,_-3px_3px_0_#fff,_3px_3px_0_#fff,_0_5px_12px_rgba(28,45,91,0.45)]">
              Ready to Make Your Space Shine?
            </span>
          </h2>
          <p class="text-[#1C2F5B] text-base md:text-lg font-medium">
            Let's bring your vision to life with Festive Express.
          </p>
        </div>

        <!-- Right Side: Button -->
        <div class="shrink-0">
          <NuxtLink
            to="/packages"
            class="btn-3d-glossy px-10 py-4 text-lg font-bold uppercase tracking-wider"
          >
            Start Your Project
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Fully static CTA banner. Clicking routes to /packages
</script>
