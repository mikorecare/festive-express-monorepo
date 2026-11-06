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
          Book a Free<br />
          Consultation With Our<br />
          <span
            class="text-[#F49321] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_4px_rgba(28,45,91,0.35)] lg:[text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
          >
            Holiday Lighting Experts!
          </span>
        </h2>

        <p
          class="mt-4 sm:mt-6 text-black text-xs sm:text-base leading-relaxed font-semibold"
        >
          Planning holiday lighting for your Florida home? Our experts can help
          you choose the right package, lighting style, and installation options
          for your property. Get answers to your questions and take the first
          step toward a professionally installed holiday display.
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
