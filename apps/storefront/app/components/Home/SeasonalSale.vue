<template>
  <section class="seasonal-sale">
    <div class="container">
      <div class="sale-content">
        <!-- Left Content -->
        <div class="sale-left">
          <div class="limited-badge">LIMITED-TIME OFFER • SEASONAL SALE</div>
          <h2 class="sale-title">Up to 10% Off Your Entire Order</h2>
          <p class="sale-desc">
            Don’t miss our biggest seasonal sale of the year. Apply your exclusive code at checkout and save instantly on any rental or bundle.
          </p>

          <!-- Countdown -->
          <div class="countdown">
            <div class="time-box" v-for="(item, i) in timeLeft" :key="i">
              <div class="number">{{ item.value }}</div>
              <div class="label">{{ item.label }}</div>
            </div>
          </div>

          <div class="sale-actions">
            <button class="shop-btn">Shop the Sale Now</button>
            <button class="code-btn">Code: FESTIVE10</button>
          </div>
        </div>

        <!-- Right Side - Full Background Image -->
        <div class="sale-right"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const timeLeft = ref([
  { label: 'Days', value: '00' },
  { label: 'Hours', value: '00' },
  { label: 'Minutes', value: '00' },
  { label: 'Seconds', value: '00' }
])

let timer: NodeJS.Timeout

onMounted(() => {
  let time = 3 * 24 * 60 * 60 // 3 days

  timer = setInterval(() => {
    time--
    if (time <= 0) return clearInterval(timer)

    const days = Math.floor(time / 86400)
    const hours = Math.floor((time % 86400) / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60

    timeLeft.value[0]!.value = days.toString().padStart(2, '0')
    timeLeft.value[1]!.value = hours.toString().padStart(2, '0')
    timeLeft.value[2]!.value = minutes.toString().padStart(2, '0')
    timeLeft.value[3]!.value = seconds.toString().padStart(2, '0')
  }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.seasonal-sale {
  padding: 60px 0;
}

.sale-content {
  display: flex;
  min-height: 480px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

/* Background on right side */
.sale-right {
  flex: 1;
  background-image: url('/Images/shop-by-holiday.webp');
  background-size: cover;
  background-position: center;
  position: relative;
}

.sale-left {
  flex: 1;
  background: #FF8C00;
  padding: 70px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
}

/* Pattern Overlay */
.sale-left::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/Images/IconPattern-3-30.png');
  background-size: 100%;
  background-repeat: repeat;
  opacity: 0.5;
  z-index: -1;
}

.limited-badge {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 16px;
  opacity: 0.95;
}

.sale-title {
  font-size: 2.8rem;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 18px;
}

.sale-desc {
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 460px;
}

.countdown {
  display: flex;
  gap: 14px;
  margin-bottom: 32px;
}

.time-box {
  background: rgba(255,255,255,0.25);
  padding: 12px 18px;
  border-radius: 10px;
  text-align: center;
  min-width: 78px;
}

.number {
  font-size: 2.1rem;
  font-weight: 700;
}

.label {
  font-size: 0.85rem;
  opacity: 0.9;
}

.sale-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.shop-btn {
  background: white;
  color: #FF8C00;
  border: none;
  padding: 16px 38px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
}

.code-btn {
  background: transparent;
  color: white;
  border: 2px dashed white;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 992px) {
  .sale-content {
    flex-direction: column;
  }
  .sale-left {
    padding: 60px 30px;
  }
}
</style>