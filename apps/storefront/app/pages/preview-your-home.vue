<template>
  <div>
    <section
      class="page-hero-preview snow-bg relative bg-slate-900 py-16 text-white overflow-hidden"
    >
      <div class="hero-overlay absolute inset-0 bg-black/40 z-10 min-h-[200px]">
        <div
          class="container mx-auto px-4 h-full flex items-center justify-center min-h-[200px]"
        >
          <div class="hero-content text-center max-w-2xl mx-auto">
            <h1
              v-fade
              class="text-3xl md:text-5xl tracking-tight text-white mb-4"
            >
              <span class="text-brand-orange">PREVIEW</span> YOUR HOME
            </h1>

            <p v-fade class="text-base md:text-lg text-slate-200">
              See your home gift-wrapped in Lights.
            </p>
          </div>
        </div>
      </div>
    </section>

    <EstimatorWidget />
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
  height: 420px;
  background-image: url("/Images/Preview-Your-Home/hero.png");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: white;
}
</style>
