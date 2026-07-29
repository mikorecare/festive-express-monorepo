<template>
  <section class="dream-holiday">
    <div class="container">
      <div class="dream-content">
        <div class="dream-text">
          <div class="small-badge text-uppercase">SEASONAL Sale • NOW LIVE</div>
          <h2 class="dream-title">
            Your Dream Holiday<br>
            <span class="highlight">Starts Here</span>
          </h2>
          <p class="dream-desc">
            This season's sale won't last long! Browse our full range of professional lighting rentals and lock in your discount before it's gone.
          </p>
          
          <div class="dream-actions">
            <button class="primary-btn">Shop the Seasonal Sale</button>
            <button class="secondary-btn">View Gallery</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dream-holiday {
  background: linear-gradient(135deg, #0c2340, #1a3558);
  color: white;
  padding: 100px 0;
  position: relative;
  overflow: hidden;
  z-index: 2;
}
/* Pattern Overlay */
.dream-holiday::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/Images/IconPattern-3-30.png');
  background-size: auto;
  background-repeat: repeat;
  opacity: 0.1;
  z-index: -1;
}

.dream-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.small-badge {
  background: #F49322;
  color: #0c2340;
  padding: 8px 24px;
  border-radius: 50px;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 20px;
  font-size: 1.05rem;
}

.dream-title {
  font-family: "Playfair Display", Sans-serif;
  font-size: 4.375rem;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 24px;
}

.highlight {
  font-size: 4.375rem;
  font-style: italic;
  color: #FFB362;
  font-family: "Playfair Display", Sans-serif;
}

.dream-desc {
  font-size: 1.25rem;
  max-width: 680px;
  margin: 0 auto 40px;
  opacity: 0.9;
}

.dream-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  background: #F49322;
  color: #0c2340;
  border: none;
  padding: 18px 48px;
  border-radius: 50px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-btn:hover {
  background: white;
  transform: translateY(-4px);
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 18px 42px;
  border-radius: 50px;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-btn:hover {
  background: rgba(255,255,255,0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .dream-title {
    font-size: 2.5rem;
  }
  .dream-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>