<template>
  <section
    class="relative w-full py-10 px-3 sm:py-14 sm:px-4 lg:py-28 lg:px-6 overflow-hidden bg-white font-poppins"
  >
    <!-- Navy bottom band -->
    <div
      class="absolute bottom-0 left-0 right-0 h-[50%] lg:h-[60%] bg-[#1C2D5B]"
      aria-hidden="true"
    ></div>

    <!-- Soft glow behind cards -->
    <div
      class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[400px] lg:h-[500px] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(244,147,33,0.12)_0%,transparent_60%)]"
      aria-hidden="true"
    ></div>

    <!-- Content -->
    <div
      class="relative z-10 w-full max-w-full mx-auto bg-white p-3.5 rounded-2xl sm:p-6 sm:max-w-[90vw] lg:max-w-[70vw] xl:max-w-[65vw] lg:p-8 shadow-[0_20px_60px_-20px_rgba(28,45,91,0.25)]"
    >
      <!-- Eyebrow -->
      <p
        class="text-[#F49321] font-extrabold text-base tracking-wide mb-1.5 text-left sm:text-lg lg:text-4xl lg:mb-4 [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_6px_rgba(28,45,91,0.35)] lg:[text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
      >
        How it works
      </p>

      <!-- Headline -->
      <h2
        class="text-2xl font-poppins font-extrabold text-[#1C2D5B] leading-tight mb-2 text-left sm:text-3xl lg:text-5xl lg:leading-[1.1] lg:mb-5"
      >
        Professional holiday lighting, made simple.
      </h2>

      <!-- Subhead -->
      <p
        class="text-slate-600 text-xs sm:text-sm font-medium mb-6 text-left lg:text-lg lg:max-w-[680px] lg:mb-14 leading-relaxed"
      >
        Choose one of three fixed rental packages. Pay online. Pick your install
        and take-down dates. We handle the rest.
      </p>

      <!-- Cards row -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        <article
          v-for="(step, i) in steps"
          :key="i"
          class="group relative bg-white rounded-2xl overflow-visible border border-slate-200/70 shadow-[0_4px_20px_-8px_rgba(28,45,91,0.15)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(28,45,91,0.25)] hover:border-[#F49321]/40"
        >
          <!-- Image area -->
          <div class="relative">
            <!-- Inner wrapper ONLY clips the image -->
            <div
              class="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl"
            >
              <NuxtImg
                :src="step.image"
                :alt="step.title"
                sizes="xs:100vw sm:100vw md:33vw lg:400px"
                format="webp"
                quality="80"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              <!-- Gradient overlay stays inside the clip -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#1C2D5B]/40 via-transparent to-transparent"
                aria-hidden="true"
              ></div>
            </div>

            <!-- Floating number badge -->
            <div
              class="absolute font-raleway -bottom-5 left-4 sm:-bottom-6 sm:left-5 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-[#F49321] text-[#1C2D5B] font-black text-lg sm:text-xl lg:text-2xl ring-4 ring-white shadow-[0_8px_20px_-4px_rgba(244,147,33,0.55)] transition-transform duration-300 ease-out group-hover:scale-110 [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]"
            >
              {{ step.number }}
            </div>
          </div>

          <!-- Body -->
          <div
            class="px-3.5 pb-4 pt-6 sm:px-4 sm:pb-4 sm:pt-7 lg:px-6 lg:pb-6 lg:pt-11"
          >
            <h3
              class="text-[#F49321] uppercase text-base sm:text-lg lg:text-2xl font-raleway font-extrabold mb-1.5 sm:mb-2 lg:mb-3 tracking-wide [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_4px_rgba(28,45,91,0.35)] lg:[text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_4px_8px_rgba(28,45,91,0.45)]"
            >
              {{ step.title }}
            </h3>

            <p
              class="text-[#1C2D5B] font-semibold text-xs sm:text-sm leading-relaxed tracking-wide lg:text-base"
            >
              {{ step.description }}
            </p>
          </div>

          <!-- Bottom accent -->
          <span
            class="absolute bottom-0 left-0 right-0 h-1 bg-[#F49321] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-b-2xl"
            aria-hidden="true"
          ></span>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    number: "1",
    title: "Rent",
    description:
      "Pick a package, pay a small rental fee and book online in minutes. Every package is a one-season rental — nothing to buy, nothing to store.",
    image: "/New/Home-How-It-Works/rent.webp",
  },
  {
    number: "2",
    title: "Relax",
    description:
      "Choose your install and take-down dates. Trained technicians handle the ladders, the cords and the roofline while you stay on the couch.",
    image: "/New/Home-How-It-Works/relax.webp",
  },
  {
    number: "3",
    title: "Celebrate",
    description:
      "Enjoy the magic of the season. We maintain your display through the holidays and take it all down when you're ready.",
    image: "/New/Home-How-It-Works/celebrate.webp",
  },
];
</script>
