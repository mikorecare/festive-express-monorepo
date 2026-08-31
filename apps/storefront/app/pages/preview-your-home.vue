<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade>Preview Your Home</h1>
            <p v-fade class="breadcrumb"></p>
          </div>
        </div>
      </div>
    </section>

    <EstimatorWidget />
  </div>
</template>

<script setup lang="ts">
import EstimatorWidget from '~/components/PreviewYourHome/EstimatorWidget.vue';

useHead({
  title: "Preview Your Home - Festive Express",
});
</script>
