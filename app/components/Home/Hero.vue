<template>
  <div class="hero-banner snow-bgxx">
    <div class="hero-image-fixed"></div>
    
    <!-- Full-width subtle dark overlay -->
    <div class="overlay"></div>

    <CountdownWidget class="desktop-widget" :time-left="timeLeft" 
        :format-number="formatNumber"  />
    
    <div class="hero-content-container container">
      
      <!-- Main Glassmorphic Card (Left Side) -->
      <div class="hero-card">
        <h1>
          HOLIDAY MAGIC<br>
          <span class="highlight">DONE</span>
        </h1>
        <p class="tagline">
          Giftwrapped in<br class="mobile-only">One Simple Package.<br>
          <span class="subtext">(No ladders. No tangled cords.<br class="mobile-only">No storage. No stress.)</span>
        </p>
        <NuxtLink to="/packages" class="btn-primary-card">Shop Packages</NuxtLink>
      </div>

      <!-- Single Reusable Countdown Widget Instance -->
      <CountdownWidget 
        class="mobile-widget"
        :time-left="timeLeft" 
        :format-number="formatNumber" 
      />

      

    </div>
  </div>
</template>

<script setup lang="ts">
// Countdown Logic
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let timerInterval: ReturnType<typeof setInterval> | null = null

const calculateTimeLeft = () => {
  const now = new Date()
  let christmas = new Date(now.getFullYear(), 11, 25, 0, 0, 0)
  if (now.getTime() > christmas.getTime()) {
    christmas = new Date(now.getFullYear() + 1, 11, 25, 0, 0, 0)
  }
  const diff = christmas.getTime() - now.getTime()
  if (diff <= 0) return

  timeLeft.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  }
}

const formatNumber = (num: number) => String(num).padStart(2, '0')

onMounted(() => {
  calculateTimeLeft()
  timerInterval = setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.hero-banner {
  position: relative;
  height: 420px;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

/* Base Fixed Background Image (Desktop) */
.hero-image-fixed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/Images/Banner/hero-image.webp');
  background-size: cover;
  background-position: center 28%;
  background-repeat: no-repeat !important;
  background-attachment: fixed;
  z-index: 0;
}

/* iOS Safari Fix */
@supports (-webkit-touch-callout: none) {
  .hero-image-fixed {
    background-attachment: scroll;
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(8, 8, 8, 0.25);
  z-index: 1;
}

/* Outer Layout Grid */
.hero-content-container {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* Glassmorphism Hero Card */
.hero-card {
  width: 100%;
  max-width: 460px;
  background: rgba(22, 28, 48, 0.50);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2.75rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  color: #ffffff;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
  overflow: hidden;
}

.hero-card h1 {
  font-size: 2.5rem;
  line-height: 1.15;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.hero-card h1 .highlight {
  color: #f7941d;
}

.hero-card .tagline {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.35;
  margin-bottom: 1.75rem;
  color: #e2e8f0;
}

.hero-card .tagline .subtext {
  display: block;
  font-size: 0.88rem;
  font-weight: 400;
  margin-top: 0.4rem;
  opacity: 0.9;
}

/* Permanent Glossy Sheen Overlay */
.hero-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -150%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    60deg,
    rgba(255, 255, 255, 0) 20%,
    rgba(255, 255, 255, 0.08) 40%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.08) 60%,
    rgba(255, 255, 255, 0) 80%
  );
  transform: rotate(25deg);
  pointer-events: none;
  animation: glossyShineContinuous 3s linear infinite;
}

/* Glass Card Button */
.btn-primary-card {
  display: inline-block;
  background-color: #ff890b;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  padding: 0.8rem 2.2rem;
  border-radius: 10px;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 12px rgba(247, 148, 29, 0.35);
  transition: all 0.25s ease-in-out;
}

.btn-primary-card:hover {
  background-color: #ff890b;
  color: #0c2340;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(247, 148, 29, 0.5);
}

/* Tablet & Mobile Layout Adjustments */
@media (max-width: 992px) {
  .hero-banner {
    min-height: auto;
    padding: 2.5rem 0;
  }

  .hero-image-fixed {
    background-image: url('/Images/Banner/hero-image-mobile-768.webp');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat !important;
    background-attachment: scroll;
  }

  .overlay {
    background: rgba(0, 0, 0, 0.45);
  }

  .hero-content-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 6rem;
    padding: 0 5%;
  }

  .hero-card {
    order: 1;
    max-width: 90%;
    padding: 0;
    text-align: left;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  .hero-card::after {
    display: none !important;
  }

  .hero-card h1 {
    font-size: 1.35rem;
    margin-bottom: 0.35rem;
    line-height: 1.15;
    text-align: left;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
  }

  .hero-card .tagline {
    font-size: 0.82rem;
    margin-bottom: 0.85rem;
    line-height: 1.25;
    text-align: left;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  }

  .hero-card .tagline .subtext {
    font-size: 0.68rem;
    margin-top: 0.15rem;
  }

  .btn-primary-card {
    font-size: 0.82rem;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    display: inline-block;
  }
}

@media (max-width: 768px) {
  .btn-primary-card::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -150%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      60deg,
      rgba(255, 255, 255, 0) 20%,
      rgba(255, 255, 255, 0.08) 40%,
      rgba(255, 255, 255, 0.35) 50%,
      rgba(255, 255, 255, 0.08) 60%,
      rgba(255, 255, 255, 0) 80%
    );
    transform: rotate(25deg);
    pointer-events: none;
    animation: glossyShineContinuous 3s linear infinite;
  }
}
</style>