<template>
  <div>
    <!-- Hero Banner -->
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade class="">Preview Your Home</h1>
            <p v-fade class="breadcrumb"></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Preview Your Home - Festive Express",
});
import { ref, onMounted, onUnmounted } from "vue";
</script>

<style scoped></style>
