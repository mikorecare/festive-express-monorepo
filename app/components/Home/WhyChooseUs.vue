<template>
  <section class="why-choose-us">
    <div class="container">
      <div class="section-header">
        <span class="badge">WHY CHOOSE US</span>
        <h2 class="section-title">Built for Peace of Mind</h2>
      </div>

      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="icon">🔧</div>
          <h3>Full-Service Installation</h3>
          <p>Installed Safely by Trained Technicians</p>
        </div>

        <div class="benefit-card">
          <div class="icon">🛡️</div>
          <h3>Licensed &amp; Insured</h3>
          <p>Your Home is Fully Protected</p>
        </div>

        <div class="benefit-card">
          <div class="icon">🏆</div>
          <h3>Professional-Grade Lighting</h3>
          <p>Built to Last Year After Year</p>
        </div>

        <div class="benefit-card">
          <div class="icon">📍</div>
          <h3>Ongoing Local Support</h3>
          <p>We're Here Long After Install</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why-choose-us {
  padding: 80px 0;
  background: #f8f9fa;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.badge {
  background: #0c2340;
  color: white;
  padding: 8px 22px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 12px;
}

.section-title {
  font-size: 2.6rem;
  color: #0c2340;
  font-weight: 700;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
}

.benefit-card {
  background: #1d3156;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0,0,0,0.07);
  transition: transform 0.3s, box-shadow 0.3s;
}

.benefit-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.12);
}

.icon {
  font-size: 3.2rem;
  margin-bottom: 20px;
  display: block;
}

.benefit-card h3 {
  font-size: 1.35rem;
  margin-bottom: 12px;
  color: #fff;
}

.benefit-card p {
  color: #fff;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>