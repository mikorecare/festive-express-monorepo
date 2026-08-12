<template>
  <section class="featured-bundles">
    <div class="container">
      <div class="section-header">
        <span class="badge">READY TO RENT</span>
        <h2 class="section-title">Featured Bundles</h2>
        <p class="subtitle">Curated packages combining our most loved products — pick one and we'll handle the rest.</p>
      </div>

      <div class="bundles-grid">
        <!-- Bundle 1 -->
        <div class="bundle-card">
          <img src="/Images/olympia-pine-wreath-bow-768x768.jpg" alt="Holiday Wreath & Bow Set">
          <div class="bundle-info">
            <h3>Holiday Wreath & Bow Set (1 Year Rental)</h3>
            <p class="description">Add timeless holiday charm to your door or wall with our perfectly matched wreath and bow set.</p>
            <div class="price">$24.99</div>
            <button class="details-btn">Details</button>
          </div>
        </div>

        <!-- Bundle 2 -->
        <div class="bundle-card">
          <img src="/Images/roofline-bundle.jpg" alt="Roofline Lighting">
          <div class="bundle-info">
            <h3>Roofline Lighting (1 Year Rental)</h3>
            <p class="description">Transform your home's roofline with this all-in-one lighting bundle! The set includes durable C9 bulbs.</p>
            <div class="price">$145.98</div>
            <button class="details-btn">Details</button>
          </div>
        </div>

        <!-- Bundle 3 -->
        <div class="bundle-card">
          <img src="/Images/ground-bundle.jpg" alt="Ground Lighting">
          <div class="bundle-info">
            <h3>Ground Lighting (1 Year Rental)</h3>
            <p class="description">Illuminate your landscape from the ground up! Our Ground Lighting Bundle includes everything you need to brighten driveways, sidewalks, and more.</p>
            <div class="price">$258.96</div>
            <button class="details-btn">Details</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-bundles {
  padding: 70px 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.badge {
  background: #0c2340;
  color: white;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 12px;
}

.section-title {
  font-size: 2.5rem;
  color: #0c2340;
  margin-bottom: 12px;
}

.subtitle {
  color: #555;
  max-width: 600px;
  margin: 0 auto;
}

.bundles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 30px;
}

.bundle-card {
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.bundle-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.bundle-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.bundle-info {
  padding: 24px;
}

.bundle-info h3 {
  font-size: 1.25rem;
  margin-bottom: 12px;
  line-height: 1.3;
}

.description {
  color: #666;
  font-size: 0.97rem;
  line-height: 1.5;
  margin-bottom: 18px;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 16px;
}

.details-btn {
  width: 100%;
  background: #0c2340;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.details-btn:hover {
  background: #F49322;
  color: #fff;
}

/* Responsive */
@media (max-width: 768px) {
  .bundles-grid {
    grid-template-columns: 1fr;
  }
}
</style>