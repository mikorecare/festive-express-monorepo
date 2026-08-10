<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade>About Festive Express</h1>
            <p v-fade class="breadcrumb">Our story and mission to simplify holiday lighting</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Content Section -->
    <section class="about-section">
      <div class="container about-container">
        <!-- Content Left -->
        <div class="about-content">
          <h2 class="about-title">Bringing Joy Back to the Holidays</h2>
          <p class="about-lead">
            Festive Express, created by Festive Lighting Pros, is simplicity itself.
          </p>
          <p>
            We believe the holidays should feel joyful, not overwhelming. That’s why we designed three clear, fixed-price packages with everything included — lights, décor, installation, and seasonal maintenance. You choose the package that fits your home, select your dates, and we take care of the rest.
          </p>
          <p>
            No custom quotes. No surprise fees. No climbing ladders in December. Just beautiful, professionally installed holiday lights that make your home shine so you can focus on what actually matters: family, friends, and the season itself.
          </p>
          <p class="about-highlight">
            Festive Express is a partnership with Festive Lighting Pros, the team known for high-quality outdoor lighting installations across Florida. Same expertise. Same standards. Made simpler.
          </p>
        </div>

        <!-- Image Right -->
        <div class="about-image">
          <img src="/Images/Gallery/Festive-Images-14.webp" alt="Festive Express Holiday Lighting" />
        </div>
      </div>
    </section>

    <HomeFeaturedPackage4 />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'About Festive Express'
})
</script>

<style scoped>
.about-section {
  padding: 80px 0;
  background-color: #ffffff;
  color: #1a202c;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.about-container {
  display: flex;
  align-items: center;
  gap: 50px;
}

.about-content {
  flex: 1;
}

.about-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0c1a35;
  margin-bottom: 20px;
  line-height: 1.2;
}

.about-lead {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ff7a00;
  margin-bottom: 16px;
}

.about-content p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #4a5568;
  margin-bottom: 16px;
}

.about-highlight {
  font-weight: 600;
  color: #0c1a35 !important;
  border-left: 4px solid #ff7a00;
  padding-left: 16px;
  margin-top: 24px;
}

.about-image {
  flex: 1;
  display: flex;
  justify-content: center;

  position: relative;
  
  /* Set your desired size for the total circular container */
  width: 400px;
  height: 400px;
  
  /* 1. Make it perfectly circular and angled (rotated) */
  border-radius: 50%;
  transform: rotate(-15deg); /* Recreates the specific angle in the image */
  
  /* 2. Apply the solid orange border */
  border: 10px solid #ff7a00; /* Matching your primary orange */
  
  /* 3. Recreates the double-shadow effect for depth */
  box-shadow: 
    0 15px 25px rgba(0, 0, 0, 0.2), /* Soft deep shadow */
    0 5px 10px rgba(0, 0, 0, 0.1);  /* Sharper near shadow */
  
  /* 4. Ensure everything inside (the image) stays within the circle */
  overflow: hidden;
  
  /* Required for smooth rendering during animations or scrolling */
  will-change: transform;

  position: relative;
  overflow: hidden;
}

.about-image img {
  width: 100%;
  /* max-width: 550px; */
  
  height: 100%;
  
  /* Re-align the image, but un-rotate it slightly so the image content 
     (the people) appears upright while the container circle is angled. 
     Adjust the rotation and translate values slightly if needed. */
  transform: rotate(15deg) scale(1.1); /* Un-rotates the content; slightly zooms to cover edges */
  
  transform-origin: center center;
  object-fit: cover; /* Ensures the image covers the entire circular area */
  pointer-events: none; /* Recommended if you have complex interactions */

}

.about-image::after {
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

/* Tablet & Mobile Responsiveness */
@media (max-width: 992px) {
  .about-container {
    flex-direction: column;
    gap: 40px;
  }

  .about-title {
    font-size: 1.85rem;
  }

  .about-image {
    width: 100%;
  }

  .about-image img {
    max-width: 100%;
  }
}
</style>