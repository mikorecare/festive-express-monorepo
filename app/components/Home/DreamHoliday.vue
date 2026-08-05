<template>
  <section class="dream-holiday" id="how-it-works">
    <!-- SVG Curved Wave Pattern -->
    <div class="wave-shape">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="rgba(255, 255, 255, 0.06)"
          d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,234.7C1120,235,1280,181,1360,154.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,0,320Z"
        ></path>
        <path
          fill="rgba(110, 85, 120, 0.2)"
          d="M0,224L80,213.3C160,203,320,181,480,197.3C640,213,800,267,960,261.3C1120,256,1280,192,1360,160L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,0,320Z"
        ></path>
      </svg>
    </div>

    <div class="container">
      <div class="dream-content">
        <div class="dream-text">
          <div class="small-badge text-uppercase">SEASONAL SALE • NOW LIVE</div>
          <h2 class="dream-title">
            Your <span class="highlight">Dream</span> Holiday<br>
            Starts here
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

<style scoped>
.dream-holiday {
  background-color: #172a50;
  color: white;
  padding: 90px 0;
  position: relative;
  overflow: hidden;
  z-index: 2;
  scroll-margin-top: 110px;
  font-family: 'Poppins', 'Roboto', sans-serif;
}

/* Background Waves Container */
.wave-shape {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.wave-shape svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  font-size: 0.95rem;
}

.dream-title {
  font-family: 'Poppins', 'Roboto', sans-serif;
  font-size: 3.5rem;
  line-height: 1.15;
  font-weight: 800;
  margin-bottom: 16px;
  color: #ffffff;
}

.highlight {
  font-size: inherit;
  font-style: normal;
  color: #f7941d;
  font-family: inherit;
  font-weight: inherit;
}

.dream-desc {
  font-size: 1.05rem;
  max-width: 720px;
  margin: 0 auto 36px;
  opacity: 0.9;
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