<!-- components/CountdownWidget.vue -->
<template>
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

    <p class="hero-timer-subtext">
      Install Dates Are Filling Up - <br class="mobile-only" />Reserve Yours
    </p>
  </div>
</template>

<script setup>
defineProps({
  timeLeft: {
    type: Object,
    required: true,
  },
  formatNumber: {
    type: Function,
    required: true,
  },
});
</script>

<style scoped>
/* Base Internal Widget Elements */
.hero-timer-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f49321;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.timer-blocks {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.85rem;
}

.mini-timer-item {
  /* background: rgba(9, 26, 48, 0.8); */
  background: rgba(12, 26, 53, 1);
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
  color: #f49321;
}

.hero-timer-subtext {
  font-size: 0.78rem;
  line-height: 1.35;
  color: #e2e8f0;
  margin: 0;
  font-weight: 500;
}

.mobile-only {
  display: none;
}

/* --------------------------------------------------
   Desktop Base Layout & Sheen Effect
-------------------------------------------------- */
@media (min-width: 993px) {
  .hero-countdown-widget {
    position: absolute;
    top: -120px;
    right: 0;
    max-width: 330px;
    background: rgba(12, 35, 64, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
    text-align: center;
    color: #ffffff;
    overflow: hidden;
  }

  .mobile-widget {
    display: none !important; /* Hide mobile-widget on desktop */
  }

  .desktop-widget {
    display: block;
    position: absolute;
    top: 24px;
    right: 32px;
    z-index: 10;
    max-width: 330px;
    background: rgba(12, 35, 64, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
    text-align: center;
    color: #ffffff;
    overflow: hidden;
  }
}

.hero-countdown-widget::after {
  content: "";
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

/* --------------------------------------------------
   Tablet & Mobile Overrides (992px & Below)
-------------------------------------------------- */
@media (max-width: 992px) {
  .hero-countdown-widget {
    order: 2;
    position: relative;
    top: auto;
    right: auto;
    width: auto;
    max-width: 100%;
    padding: 0;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    box-shadow: none !important;
    text-align: left;
    border-radius: 0 !important;
  }

  .hero-countdown-widget::after {
    display: none !important;
  }

  .hero-timer-title {
    font-size: 0.75rem;
    margin-bottom: 0.35rem;
    text-align: left;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  }

  .timer-blocks {
    justify-content: flex-start;
    gap: 4px;
    margin-bottom: 0.35rem;
  }

  .mini-timer-item {
    min-width: 28px;
    padding: 2px 5px;
    border-radius: 4px;
    /* background: rgba(9, 26, 48, 0.6); */
    background: rgba(12, 26, 53, 1);
    border: 1px solid rgba(255, 137, 11, 0.5);
  }

  .mini-timer-item span {
    font-size: 0.8rem;
  }

  .mini-timer-item small {
    font-size: 0.55rem;
  }

  .hero-timer-subtext {
    font-size: 0.68rem;
    line-height: 1.15;
    text-align: left;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  }

  .mobile-widget {
    display: block;
    order: 2;
    position: relative;
    top: auto;
    right: auto;
    width: auto;
    max-width: 100%;
    padding: 0;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    box-shadow: none !important;
    text-align: left;
    border-radius: 0 !important;
  }

  .mobile-widget::after {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .hero-countdown-widget {
    position: absolute;
    top: 16px;
    max-width: 200px;
    padding: 0.65rem 0.85rem;
    border-radius: 12px;
    z-index: 10;
    left: 12px;
  }

  .mini-timer-item {
    min-width: 32px;
  }
}
</style>
