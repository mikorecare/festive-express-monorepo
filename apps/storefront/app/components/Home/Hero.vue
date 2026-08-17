<template>
  <div class="hero-banner snow-bgxx relative h-[420px] min-h-[600px] overflow-hidden flex items-center">
    <!-- Base Fixed Background Image (Desktop) -->
    <div class="hero-image-fixed absolute inset-0 bg-cover bg-[center_28%] bg-no-repeat bg-fixed z-0 will-change-transform bg-[url('/Images/Banner/hero-image.webp')]"></div>
    
    <!-- Full-width subtle dark overlay -->
    <div class="overlay absolute inset-0 bg-black/15 z-[1]"></div>

    <!-- Desktop Countdown Widget -->
    <CountdownWidget 
      class="desktop-widget" 
      :time-left="timeLeft" 
      :format-number="formatNumber" 
    />
    
    <!-- Outer Content Container -->
    <div class="hero-content-container relative z-[3] w-full max-w-[1200px] mx-auto px-6 flex justify-between items-center gap-5">
      
      <!-- Main Glassmorphic Card -->
      <div class="hero-card relative w-full max-w-[460px] bg-[#161c30]/50 backdrop-blur-md rounded-2xl p-11 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-white text-center border border-white/12 overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:-left-[150%] before:w-[200%] before:h-[200%] before:bg-[linear-gradient(60deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.08)_60%,rgba(255,255,255,0)_80%)] before:rotate-[25deg] before:pointer-events-none before:animate-[glossyShineContinuous_3s_linear_infinite]">
        <h1 class="text-4xl font-extrabold leading-[1.15] mb-4 tracking-wide text-white">
          RENT THE MAGIC<br>
          <span class="highlight text-[#f7941d]">ENJOY THE SEASON</span>
        </h1>

        <p class="tagline text-[1.1rem] font-semibold leading-[1.35] mb-7 text-slate-200">
          Giftwrapped in<br class="mobile-only"> One Simple Package.<br>
          <span class="subtext block text-[0.88rem] font-normal mt-1.5 opacity-90">(No ladders. No tangled cords.<br class="mobile-only"> No storage. No stress.)</span>
        </p>

        <NuxtLink to="/packages" class="btn-primary-card">Shop the Packages</NuxtLink>
      </div>

      <!-- Mobile Countdown Widget Instance -->
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
/* iOS Safari Fix */
@supports (-webkit-touch-callout: none) {
  .hero-image-fixed {
    background-attachment: scroll;
  }
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
    background-attachment: scroll !important;
    transform: translateZ(0);
  }

  .overlay {
    background: rgba(0, 0, 0, 0.25);
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

  .hero-card::after,
  .hero-card::before {
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
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    display: inline-block;
    position: relative;

    /* Force left alignment */
    float: left;
    clear: both;
    margin-left: 0 !important;
    margin-right: auto !important;
  }
}

@media (max-width: 768px) {
  .btn-primary-card {
    position: relative;
    overflow: hidden;
  }
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

  .hero-card::after,
  .hero-card::before {
    display: none !important;
  }
}
</style>