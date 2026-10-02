<template>
  <section
    class="relative w-full overflow-hidden bg-white border-b-[27px] border-[#F49321]"
  >
    <!-- Decorative pattern background -->
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-[url('/Images/LV.webp')] bg-no-repeat bg-center bg-cover"
      aria-hidden="true"
    ></div>

    <div
      class="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 sm:pb-4 lg:pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
    >
      <!-- ============================== -->
      <!-- LEFT: Marketing copy            -->
      <!-- ============================== -->
      <div v-fade class="max-w-[520px]">
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] text-[#1C2D5B]"
        >
          Book a free<br />
          consultation with<br />
          <span
            class="text-[#F49321] [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
          >
            our experts!
          </span>
        </h2>

        <p
          class="mt-5 sm:mt-6 text-[#1C2D5B] text-sm sm:text-base leading-relaxed"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      <!-- ============================== -->
      <!-- RIGHT: Contact form             -->
      <!-- ============================== -->
      <div v-fade class="w-full flex justify-center lg:justify-end">
        <ContactUsContactForm />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: "Book a Free Consultation - Festive Express",
  meta: [
    {
      name: "description",
      content:
        "Book a free consultation with our holiday lighting experts. Tell us about your home and we'll design the perfect display.",
    },
  ],
});
</script>
