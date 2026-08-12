<template>
  <section class="dream-holiday" id="how-it-works">
  
    <div class="container">
      <div class="dream-content">
        <div class="dream-text">
          <div class="small-badge text-uppercase">SEASONAL SALE • NOW LIVE</div>
          <h2 ref="titleRef" class="dream-title scroll-animate">
            Your <span class="highlight">Dream Holiday</span> Starts here
          </h2>
          <p class="dream-desc">
            This season's sale won't last long! Browse our full range of<br>
            professional lighting rentals and lock in your discount before it's gone.
          </p>
          
          <div class="dream-actions">
            <NuxtLink to="/packages" class="primary-btn">Shop the Seasonal Sales</NuxtLink>
            <NuxtLink to="/gallery" class="secondary-btn">Gallery</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const titleRef = ref(null)
useScrollAnimate(titleRef) // Works instantly on any element!
</script>

<style scoped>
.dream-holiday {
  /* Set background image with overlay and fallbacks */
  background: 
    linear-gradient(rgba(23, 42, 80, 0.75), rgba(23, 42, 80, 0.85)),
    url('/Images/Dream-Holiday.png') no-repeat center center / cover;
  color: white;
  padding: 100px 0;
  position: relative;
  overflow: hidden;
  z-index: 2;
  scroll-margin-top: 110px;
  font-family: 'Poppins', 'Roboto', sans-serif;
}


.dream-content {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.small-badge {
  background: transparent;
  color: #f7941d;
  padding: 0;
  border-radius: 0;
  font-weight: 800;
  letter-spacing: 1.5px;
  display: inline-block;
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.dream-title {
  font-family: 'Poppins', 'Roboto', sans-serif;
  font-size: 3.5rem;
  line-height: 1.15;
  font-weight: 800;
  margin-bottom: 16px;
  color: #ffffff;
}

.dream-desc {
  font-size: 1.25rem;
  max-width: 720px;
  margin: 0 auto 36px;
  opacity: 0.95;
  line-height: 1.5;
}

.dream-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  display: inline-block;
  background: #f7941d;
  color: #ffffff;
  border: 2px solid #ffffff;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(247, 148, 29, 0.3);
}

.primary-btn:hover {
  background: #e08310;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(247, 148, 29, 0.45);
}

.secondary-btn {
  display: inline-block;
  background: rgba(23, 42, 80, 0.85);
  color: #ffffff;
  border: 2px solid #f7941d;
  padding: 14px 42px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s ease;
}

.secondary-btn:hover {
  background: #f7941d;
  color: #ffffff;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .dream-holiday {
    padding: 60px 0;
  }
  .dream-title {
    font-size: 2.25rem;
  }
  .dream-desc {
    font-size: 0.95rem;
  }
  .dream-actions {
    flex-direction: column;
    align-items: center;
  }
  .primary-btn, .secondary-btn {
    width: 100%;
    max-width: 320px;
  }
}

</style>