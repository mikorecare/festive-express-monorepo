<template>
  <div class="hero-banner snow-bgxx">
    <div class="hero-image-fixed"></div>
    
    <!-- Full-width subtle dark overlay -->
    <div class="overlay"></div>
    
    <div class="hero-content-container">
      <!-- Glassmorphic Card -->
      <div class="hero-card">
        <h1>
          YOUR HOLIDAY<br>
          <span class="highlight">LIGHTS,</span> DONE.
        </h1>
        <p class="tagline">
          Giftwrapped in One Simple Package.<br>
          <span class="subtext">(No ladders. No tangled cords. No storage. No stress.)</span>
        </p>
        <NuxtLink to="/packages" class="btn-primary-card">Shop Packages</NuxtLink>
      </div>
    </div>
  </div>
</template>

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
  /* iOS fix for fixed background */
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

/* Outer layout wrapper */
.hero-content-container {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
}

/* Glassmorphism Dark Card */
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
}

.hero-card h1 {
  font-size: 2.4rem;
  line-height: 1.15;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #ffffff;
  text-shadow: none;
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
  text-shadow: none;
}

.hero-card .tagline .subtext {
  display: block;
  font-size: 0.88rem;
  font-weight: 400;
  margin-top: 0.4rem;
  opacity: 0.9;
}

/* Glass Card Button */
.btn-primary-card {
  display: inline-block;
  background-color: #f7941d;
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
  background-color: #e08310;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(247, 148, 29, 0.5);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .hero-banner {
    min-height: 520px;
  }

  .hero-content-container {
    display: flex;
    justify-content: center;
    padding: 0 15px;
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

  .hero-image-fixed {
    background-attachment: scroll;
  }
}
</style>

