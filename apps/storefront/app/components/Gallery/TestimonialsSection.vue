<template>
  <section
    class="relative w-full overflow-hidden bg-[#1C2F5B] py-16 text-white font-sans"
  >
    <!-- Top Orange Border/Accent -->
    <div class="absolute top-0 left-0 w-full h-2 bg-[#f49321]"></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <!-- Left Side: Quote & Author -->
        <div class="flex flex-col">
          <!-- Header with Icon -->
          <div class="flex items-center gap-3 mb-6">
            <!-- Custom SVG Quote Icon -->
            <svg
              class="w-10 h-10 text-slate-500/50"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
              />
            </svg>
            <h2
              class="text-2xl md:text-3xl font-extrabold text-[#f49321] tracking-wide"
            >
              Customer stories
            </h2>
          </div>

          <!-- Testimonial Quote -->
          <blockquote
            class="text-lg md:text-xl leading-relaxed text-slate-200 mb-8 max-w-lg"
          >
            I couldn't be more happy with the services provided by Festive
            Express. They were very, very efficient, very, very professional,
            easy to deal with. We really liked the way our house turned out.
          </blockquote>

          <!-- Author Info -->
          <div class="flex items-center gap-4">
            <!-- Avatar Placeholder (Using an inline generic avatar) -->
            <div
              class="w-14 h-14 rounded-full border-2 border-[#f49321] overflow-hidden bg-slate-300 flex-shrink-0"
            >
              <img
                src="/New/Gallery/Matt-Nemeth.webp"
                alt="Matt Nemeth"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <div class="text-[#f49321] font-bold text-sm">Matt Nemeth</div>
              <div class="text-slate-300 text-sm">Sarasota, FL</div>
            </div>
          </div>
        </div>

        <!-- Right Side: Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Stat Card 1 -->
          <div
            class="bg-white/5 rounded-2xl p-6 md:p-8 flex flex-col justify-center transition-colors hover:bg-white/10"
          >
            <div
              class="text-4xl md:text-5xl font-extrabold text-[#f49321] mb-2 flex items-center gap-1"
            >
              100+
            </div>
            <div class="text-sm md:text-base text-slate-300 font-medium">
              Completed Projects
            </div>
          </div>

          <!-- Stat Card 2 -->
          <div
            class="bg-white/5 rounded-2xl p-6 md:p-8 flex flex-col justify-center transition-colors hover:bg-white/10"
          >
            <div
              class="text-4xl md:text-5xl font-extrabold text-[#f49321] mb-2 flex items-center gap-2"
            >
              5
              <!-- Star Icon -->
              <svg
                class="w-7 h-7 md:w-9 md:h-9"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
            </div>
            <div class="text-sm md:text-base text-slate-300 font-medium">
              Google Rating
            </div>
          </div>

          <!-- Stat Card 3 -->
          <div
            class="bg-white/5 rounded-2xl p-6 md:p-8 flex flex-col justify-center transition-colors hover:bg-white/10"
          >
            <div
              class="text-4xl md:text-5xl font-extrabold text-[#f49321] mb-2"
            >
              5
            </div>
            <div class="text-sm md:text-base text-slate-300 font-medium">
              Service Area
            </div>
          </div>

          <!-- Stat Card 4 -->
          <div
            class="bg-white/5 rounded-2xl p-6 md:p-8 flex flex-col justify-center transition-colors hover:bg-white/10"
          >
            <div
              class="text-4xl md:text-5xl font-extrabold text-[#f49321] mb-2"
            >
              100%
            </div>
            <div class="text-sm md:text-base text-slate-300 font-medium">
              Customer Satisfaction
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Fully static component for now.
// Can easily be wired up to props or fetched from an API later.
</script>
