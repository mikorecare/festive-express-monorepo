<template>
  <div class="hero-banner snow-bgxx">
    <div class="hero-image-fixed"></div>
    
    <!-- Full-width subtle dark overlay -->
    <div class="overlay"></div>
    
    <div class="hero-content-container">
      
      <!-- Main Glassmorphic Card (Left Side) -->
      <div class="hero-card">
        <h1>
          HOLIDAY MAGIC<br>
          <span class="highlight">INSTALLED</span>
        </h1>
        <p class="tagline">
          Giftwrapped in One Simple Package.<br>
          <span class="subtext">(No ladders. No tangled cords. No storage. No stress.)</span>
        </p>
        <NuxtLink to="/packages" class="btn-primary-card">Shop Packages</NuxtLink>
      </div>

      <!-- Hero Countdown Widget (Upper Right Corner) -->
      <div class="hero-countdown-widget">
        <h3 class="hero-timer-title">Christmas Countdown</h3>
        
        <div class="timer-blocks">
          <div class="mini-timer-item">
            <span>{{ formatNumber(timeLeft.days) }}</span>
            <small>d</small>
          </div>
          <div class="mini-timer-item">
            <span>{{ formatNumber(timeLeft.hours) }}</span>
            <small>h</small>
          </div>
          <div class="mini-timer-item">
            <span>{{ formatNumber(timeLeft.minutes) }}</span>
            <small>m</small>
          </div>
          <div class="mini-timer-item">
            <span>{{ formatNumber(timeLeft.seconds) }}</span>
            <small>s</small>
          </div>
        </div>

        <p class="hero-timer-subtext">It's never been easier to shine bright this holiday season.</p>
      </div>

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

.hero-image-fixed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/Images/Banner/hero-image.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  z-index: 0;
}

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

/* Outer Layout Grid for Left Card & Right Widget */
.hero-content-container {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0%;
  display: flex;
  justify-content: space-between;
  align-items: center; /* flex-start; */
  gap: 20px;
}

/* Glassmorphism Left Card */
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

/* Hero Upper Right Countdown Box */
.hero-countdown-widget {
  background: rgba(12, 35, 64, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  max-width: 330px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
  text-align: center;
  color: #ffffff;
  
  position: absolute;
  top: -133px;
  right: -17%;

  /* Required to contain the animated glossy sheen */
  position: relative;
  overflow: hidden;
}

/* Continuous Glossy Sheen Overlay */
.hero-countdown-widget::after {
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

.hero-timer-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ff890b;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
}

.timer-blocks {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.85rem;
}

.mini-timer-item {
  background: rgba(9, 26, 48, 0.8);
  border: 1.5px solid rgba(255, 137, 11, 0.6);
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 52px;
  justify-content: center;
}

.mini-timer-item span {
  font-size: 1.25rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
}

.mini-timer-item small {
  font-size: 0.75rem;
  font-weight: 700;
  color: #ff890b;
  text-transform: lowercase;
}

.hero-timer-subtext {
  font-size: 0.88rem;
  line-height: 1.35;
  color: #e2e8f0;
  margin: 0;
  font-weight: 500;
}

/* Responsive Layout */
@media (max-width: 992px) {
  .hero-content-container {
    flex-direction: column;
    align-items: center;
  }

  .hero-countdown-widget {
    order: -1; /* Shows countdown above the card on mobile/tablets */
    max-width: 100%;
    width: 100%;

    position: relative;
    top: 0;
    right: 0;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    min-height: 560px;
  }

  .hero-card {
    max-width: 100%;
    padding: 2rem 1.25rem;
  }

  .hero-card h1 {
    font-size: 1.9rem;
  }

  .hero-card .tagline {
    font-size: 0.95rem;
  }

  .hero-card .tagline .subtext {
    font-size: 0.78rem;
  }

  .hero-content-container {
    padding: 0 5%;
  }
}
</style>