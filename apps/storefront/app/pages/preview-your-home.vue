<template>
  <div>
    <!-- Hero Banner -->
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

    <div style="width: 100%; height: 1200px; overflow: hidden">
      <iframe
        src="/api/estimator"
        width="100%"
        height="1200px"
        scrolling="no"
        style="border: none; display: block"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Preview Your Home - Festive Express",
});
</script>

<style scoped></style>
