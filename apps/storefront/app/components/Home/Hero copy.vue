<template>
  <section class="hero">
    <div class="container">
      <!-- Background Images Slider -->
      <div class="hero-images">
        <img 
          v-for="(image, index) in heroImages" 
          :key="index"
          :src="image" 
          :class="{ active: currentImage === index }"
          class="hero-image"
          alt="Holiday Lighting"
        >
      </div>

      <!-- Content Overlay -->
      <div class="hero-content">
        <div class="hero-text">
          <div class="badge1">YOUR <span>HOLIDAY LIGHTS,</span></div>
          <h1 class="hero-title">YOUR WAY!</h1>
          <p class="hero-subtitle">
            Brighten your home for the holidays—fast, easy, and totally under your control.
          </p>
          <button class="shop-btn" @click="goToShop">
            SHOP SEASONAL COLLECTION
          </button>
        </div>
      </div>

      <!-- Optional Navigation Dots -->
      <div class="hero-dots">
        <button 
          v-for="(image, index) in heroImages" 
          :key="index"
          :class="{ active: currentImage === index }"
          @click="currentImage = index"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentImage = ref(0)

const heroImages = [
  '/Images/Banner/hero-1-scaled.webp',
  '/Images/Banner/hero-2-scaled.webp',
  '/Images/Banner/hero-3.webp'
]

let interval: NodeJS.Timeout

onMounted(() => {
  interval = setInterval(() => {
    currentImage.value = (currentImage.value + 1) % heroImages.length
  }, 5000) // Change image every 5 seconds
})

onUnmounted(() => {
  clearInterval(interval)
})

const goToShop = () => {
  // Navigate to shop page later
  console.log('Go to Shop')
}
</script>

<style scoped>
.hero {
  position: relative;
  height: 520px;
  overflow: hidden;
}

.hero-images {
  position: absolute;
  inset: 0;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hero-image.active {
  opacity: 1;
  z-index: 1;
}

.hero-content {
  font-family: "Poppins", Sans-serif;
  position: relative;
  z-index: 2;
  max-width: 520px;
  margin-left: 0%;
  padding: 40px 30px;
  background: rgba(12, 35, 64, 0.9);
  border-radius: 12px;
  color: white;
  height: fit-content;
  margin-top: 80px;
  border: white 3px solid;
}

.badge1{
  font-size: 2.25rem;
  font-weight: 700;
  color: #FFFFFF;
}
.badge1 span{color: #F49322;}

.hero-title {
  font-size: 4.688rem;
  line-height: 1.05;
  font-weight: 700;
  margin: 12px 0 20px;
}

.hero-subtitle {
  font-size: 1.18rem;
  line-height: 1.5;
  margin-bottom: 32px;
}

.shop-btn {
  background: white;
  color: #0c2340;
  border: none;
  padding: 16px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.shop-btn:hover {
  background: #F49322;
  color: white;
  transform: translateY(-3px);
}

.hero-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}

.hero-dots button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.6);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.hero-dots button.active {
  background: #f5a623;
  transform: scale(1.3);
}

/* Responsive */
@media (max-width: 992px) {
  .hero-content {
    margin-left: 5%;
    margin-top: 60px;
  }
}

@media (max-width: 768px) {
  .hero {
    height: 460px;
  }
  .hero-content {
    max-width: 90%;
    margin: 40px auto;
    text-align: center;
  }
}
</style>