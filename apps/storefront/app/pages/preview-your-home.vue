<template>
  <div>
    <section
      class="page-hero-preview relative bg-slate-900 text-white overflow-hidden"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/45 z-10" aria-hidden="true"></div>

      <!-- Content -->
      <div class="relative z-20 container mx-auto px-4 sm:px-6">
        <div
          class="hero-content text-center max-w-2xl mx-auto py-14 sm:py-20 lg:py-28"
        >
          <h1
            v-fade
            class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-3 sm:mb-4 leading-tight"
          >
            <span class="text-brand-orange">Preview</span> Your Home
          </h1>

          <p
            v-fade
            class="text-sm sm:text-base md:text-lg text-slate-200 max-w-md mx-auto"
          >
            See your home gift-wrapped in lights.
          </p>
        </div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 my-6 sm:my-8 lg:my-10">
      <EstimatorWidget />
    </div>
  </div>
</template>

<script setup lang="ts">
import EstimatorWidget from "~/components/PreviewYourHome/EstimatorWidget.vue";

useHead({
  title: "Preview Your Home - Festive Express",
});
</script>

<style scoped>
.page-hero-preview {
  position: relative;
  background-image: url("/Images/Preview-Your-Home/hero.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
