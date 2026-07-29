<template>
  <div class="hero-banner snow-bg">
    <div class="hero-image-fixed"></div>
    
    <!-- Black Overlay -->
    <div class="overlay"></div>
    
    <div class="hero-content">
      <h1>YOUR HOLIDAY LIGHTS, YOUR WAY!</h1>
      <p class="tagline">Brighten your home for the holidays—fast, easy, and totally under your control.</p>
      <NuxtLink to="/packages" class="btn-primary">Shop Packages</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.hero-banner {
  position: relative;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image-fixed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/Images/Banner/hero-image.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;   /* Fixed only in hero */
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: white;
  text-shadow: 0 2px 15px rgba(0,0,0,0.8);
  max-width: 800px;
  padding: 0 20px;
}

.hero-content h1 {
  font-size: 4rem;
  margin-bottom: 16px;
  font-weight: 700;
}

.hero-content .tagline {
  font-size: 1.5rem;
  margin-bottom: 40px;
}
</style>