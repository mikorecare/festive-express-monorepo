<template>
  <div>
    <section class="hero-section">
      <div class="hero-container">
        <img
          src="/Images/Preview-Your-Home/hero.png"
          alt="Preview your home"
          class="hero-image"
        />
        <div class="hero-content">
          <h1 v-fade>PREVIEW YOUR HOME</h1>
          <p v-fade class="breadcrumb"></p>
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
.hero-section {
  background: #1c2f5b;
  width: 100%;
  position: relative;
}

.hero-container {
  max-width: 100%;
  margin: 0 auto;
  position: relative;
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
  width: 100%;
  padding: 0 20px;
}

.hero-content h1 {
  color: white;
  font-size: 72px;
  font-family: Poppins;
  font-weight: 800;
  line-height: 157.44px;
  word-wrap: break-word;
  text-shadow: 0px 10px 4px rgba(0, 0, 0, 0.98);
  margin: 0;
}

.hero-content .breadcrumb {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 48px;
    line-height: 1.2;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 32px;
    line-height: 1.2;
  }
}
</style>
