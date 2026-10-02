<template>
  <section
    class="relative w-full py-12 px-4 lg:py-24 lg:px-6 overflow-hidden bg-white"
  >
    <!-- Navy bottom band: 60% of section height -->
    <div
      class="absolute bottom-0 left-0 right-0 h-[60%] bg-[#1C2D5B]"
      aria-hidden="true"
    ></div>

    <!-- Content sits above both backgrounds -->
    <div
      class="relative z-10 w-full max-w-full mx-auto bg-white p-4 rounded-xl sm:max-w-[90vw] lg:max-w-[60vw] lg:p-8"
    >
      <!-- Eyebrow -->
      <p
        class="text-[#F49321] font-extrabold text-xl tracking-wide mb-2 text-left lg:text-4xl lg:mb-4"
      >
        How it works
      </p>

      <!-- Headline -->
      <h2
        class="text-3xl font-extrabold text-[#1C2D5B] leading-[1.15] mb-3 text-left lg:text-6xl lg:leading-[1.05] lg:mb-5"
      >
        Professional holiday lighting, made simple.
      </h2>

      <!-- Subhead -->
      <p
        class="text-[#3b4a6b] text-base font-medium mb-8 text-left lg:text-xl lg:max-w-[760px] lg:mb-14"
      >
        Choose one of three fixed rental packages. Pay online. Pick your install
        and take-down dates. We handle the rest.
      </p>

      <!-- Cards row -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-7">
        <article
          v-for="(step, i) in steps"
          :key="i"
          class="bg-white rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-slate-100"
        >
          <!-- Image -->
          <div class="aspect-[16/10] w-full overflow-hidden">
            <NuxtImg
              :src="step.image"
              :alt="step.title"
              sizes="xs:100vw sm:100vw md:33vw lg:400px"
              format="webp"
              quality="80"
              loading="lazy"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Body -->
          <div class="p-5 lg:p-7">
            <h3
              class="text-[#1C2D5B] text-xl font-extrabold mb-2 lg:text-3xl lg:mb-4"
            >
              <span class="text-[#F49321]">{{ step.number }}.</span>
              {{ step.title }}
            </h3>
            <p class="text-slate-600 text-sm leading-relaxed lg:text-lg">
              {{ step.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    number: "01",
    title: "Rent",
    description:
      "Pick a package, pay a small rental fee and book online in minutes. Every package is a one-season rental — nothing to buy, nothing to store.",
    image: "/New/Home-How-It-Works/rent.webp",
  },
  {
    number: "02",
    title: "Relax",
    description:
      "Choose your install and take-down dates. Trained technicians handle the ladders, the cords and the roofline while you stay on the couch.",
    image: "/New/Home-How-It-Works/relax.webp",
  },
  {
    number: "03",
    title: "Celebrate",
    description:
      "Enjoy the magic of the season. We maintain your display through the holidays and take it all down when you're ready.",
    image: "/New/Home-How-It-Works/celebrate.webp",
  },
];
</script>
