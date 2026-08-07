<template>
  <section class="why-choose-us">
    <div class="banner-container">
      
      <!-- Content Container (Sits over the blue area on desktop) -->
      <div class="content-side">
        <div class="section-header">
          <span v-fade class="sub-heading">WHY CHOOSE US?</span>
          <h2 v-fade class="section-title">
            Festive Express <span class="highlight">Difference</span>
          </h2>
        </div>

        <div class="benefits-row">
          <!-- Item 1: Full-Service Installation -->
          <div v-fade-left class="benefit-item">
            <div class="icon-wrapper">
              <img src="/Images/Icons/trained.png" alt="Full-Service Installation" class="benefit-icon-img" />
            </div>
            <h3>Full-Service<br>Installation</h3>
            <p>Installed Safely by<br>Trained Technicians</p>
          </div>

          <!-- Item 2: Licensed & Insured -->
          <div v-fade-left class="benefit-item">
            <div class="icon-wrapper">
              <img src="/Images/Icons/secured.png" alt="Licensed & Insured" class="benefit-icon-img" />
            </div>
            <h3>Licensed &amp;<br>Insured</h3>
            <p>Your Home Is<br>Fully Protected</p>
          </div>

          <!-- Item 3: Professional Grade Lighting -->
          <div v-fade-left class="benefit-item">
            <div class="icon-wrapper">
              <img src="/Images/Icons/service.png" alt="Professional Grade Lighting" class="benefit-icon-img" />
            </div>
            <h3>Professional<br>Grade Lighting</h3>
            <p>Built to Last Year<br>After Year</p>
          </div>

          <!-- Item 4: Ongoing Local Support -->
          <div v-fade-left class="benefit-item">
            <div class="icon-wrapper">
              <img src="/Images/Icons/location.png" alt="Ongoing Local Support" class="benefit-icon-img" />
            </div>
            <h3>Ongoing Local<br>Support</h3>
            <p>We're Here<br>Long After Install</p>
          </div>
        </div>
      </div>

      <!-- Mobile Photo Frame (Visible on Mobile/Tablet Only) -->
      <div class="mobile-image-container">
        <img src="/Images/why-choose-us-bg-2.webp" alt="Festive Express Decorated Home" />
      </div>

    </div>
  </section>
</template>

<style scoped>
/* --------------------------------------------------
   Desktop Base (993px & Up)
-------------------------------------------------- */
.why-choose-us {
  width: 100%;
  background-image: url('/Images/why-choose-us-bg.webp');
  background-size: cover;
  background-position: center right;
  background-repeat: no-repeat;
  min-height: 480px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.banner-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.content-side {
  width: 62%;
  padding: 2.5rem 2rem 2.5rem 3.5rem;
}

.section-header {
  text-align: left;
}

.sub-heading {
  color: #f7941d;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  display: block;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
}

.section-title {
  color: #ffffff;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.15;
}

.section-title .highlight {
  color: #f7941d;
}

/* Horizontal Benefits Row */
.benefits-row {
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
}

.benefit-item {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Double-Ring Circular Icon Styling */
.icon-wrapper {
  width: 68px;
  height: 68px;
  /* background-color: #f7941d; */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
  /* box-shadow: 0 0 0 3px #0d2247, 0 0 0 5px #ffffff; */
  overflow: hidden;
  /* padding: 12px; */
}

.benefit-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Trigger infinite rotation on hover */
.benefit-item:hover .benefit-icon-img {
  animation: spin-once 0.8s ease-in-out 1;
}

.benefit-item:hover .icon-wrapper {
  transform: scale(1.08);
  box-shadow: 0 0 0 3px #0d2247, 0 0 0 5px #f7941d;
}

.benefit-item h3 {
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.35rem;
}

.benefit-item p {
  color: #ff890b;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.25;
  margin: 0;
}

.mobile-image-container {
  display: none;
}

/* --------------------------------------------------
   Tablet & Mobile Overrides (992px & Below)
-------------------------------------------------- */
@media (max-width: 992px) {
  .why-choose-us {
    background-image: none !important;
    background-color: #0d2247;
    border-bottom: 6px solid #f7941d;
    padding: 0;
  }

  .banner-container {
    flex-direction: column;
  }

  .content-side {
    width: 100%;
    padding: 2.5rem 1.5rem;
  }

  .section-title {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  .mobile-image-container {
    display: block;
    width: 100%;
    height: 240px;
    overflow: hidden;
    border-top: 4px solid #f7941d;
  }

  .mobile-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (max-width: 640px) {
  .benefits-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 1rem;
  }
  
  .benefit-item h3 br,
  .benefit-item p br {
    display: none;
  }
}
</style>