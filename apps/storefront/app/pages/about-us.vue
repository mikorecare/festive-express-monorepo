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
    <section class="bg-white text-slate-800 py-20">
      <div class="container flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
        
        <!-- Content Left -->
        <div class="flex-1">
          <h2 class="text-3xl lg:text-4xl font-extrabold text-navy mb-5 leading-tight">
            Bringing Joy Back to the Holidays
          </h2>
          <p class="text-[1.25rem] font-semibold text-brand-orange mb-4">
            Festive Express, created by Festive Lighting Pros, is simplicity itself.
          </p>
          <p class="text-[1.05rem] leading-relaxed text-slate-600 mb-4">
            We believe the holidays should feel joyful, not overwhelming. That’s why we designed three clear, fixed-price packages with everything included — lights, décor, installation, and seasonal maintenance. You choose the package that fits your home, select your dates, and we take care of the rest.
          </p>
          <p class="text-[1.05rem] leading-relaxed text-slate-600 mb-4">
            No custom quotes. No surprise fees. No climbing ladders in December. Just beautiful, professionally installed holiday lights that make your home shine so you can focus on what actually matters: family, friends, and the season itself.
          </p>
          <p class="text-[1.05rem] leading-relaxed font-semibold text-navy border-l-4 border-brand-orange pl-4 mt-6">
            Festive Express is a partnership with Festive Lighting Pros, the team known for high-quality outdoor lighting installations across Florida. Same expertise. Same standards. Made simpler.
          </p>
        </div>

        <!-- Image Right -->
        <div class="flex-1 flex justify-center w-full">
          <div class="about-image relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full -rotate-12 border-[10px] border-brand-orange shadow-[0_15px_25px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.1)] overflow-hidden will-change-transform">
            <img 
              src="/Images/Gallery/Festive-Images-14.webp" 
              alt="Festive Express Holiday Lighting" 
              class="w-full h-full object-cover rotate-12 scale-110 origin-center pointer-events-none"
            />
            <!-- Continuous Glossy Shine Overlay -->
            <div class="absolute -top-[50%] -left-[150%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-[25deg] pointer-events-none animate-shine" />
          </div>
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

.animate-shine {
  animation: glossyShineContinuous 3s linear infinite;
}
</style>