<template>
  <section
    class="relative w-full overflow-hidden bg-white border-b-[18px] sm:border-b-[27px] border-[#F49321] pt-8 sm:pt-12"
    id="contact"
  >
    <!-- Decorative pattern background -->
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-[url('/Images/LV.webp')] bg-no-repeat bg-center bg-cover"
      aria-hidden="true"
    ></div>

    <div
      class="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pb-8 sm:pb-4 lg:pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
    >
      <!-- ============================== -->
      <!-- LEFT: Marketing copy            -->
      <!-- ============================== -->
      <div v-fade class="max-w-[600px]">
        <h2
          class="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] sm:leading-[1.1] text-[#1C2D5B]"
        >
          Want a custom<br />
          design for your home?<br />
          <span
            class="text-[#F49321] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_4px_rgba(28,45,91,0.35)] lg:[text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
          >
            Let's talk it through.
          </span>
        </h2>

        <p
          class="mt-4 sm:mt-6 text-black text-xs sm:text-base leading-relaxed font-semibold"
        >
          Our packages cover most homes, but if you have a bigger project, an
          unusual layout, or just prefer to talk it through, our team can put
          together something tailored. This is a secondary option — most
          customers find what they need in the packages above.
        </p>
      </div>

      <!-- ============================== -->
      <!-- RIGHT: Contact form             -->
      <!-- ============================== -->
      <div v-fade class="w-full flex justify-center lg:justify-end pb-2">
        <ContactUsContactForm />
      </div>
    </div>
  </section>
</template>
