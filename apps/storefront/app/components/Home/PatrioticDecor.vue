<template>
  <section class="patriotic-section">
    <div class="container">
      <div class="section-header">
        <div>
            <span class="badge">AMERICAN PRIDE COLLECTION</span>
            <h2 class="section-title">Patriotic Décor</h2>
        </div>
        <NuxtLink to="/patriotic" class="view-all">View all Patriotic →</NuxtLink>
      </div>

      <div class="products-grid">
        <!-- Product 1 -->
        <div class="product-card">
          <img src="/Images/American-Flag-Waving-LED-768x768.webp" alt="American Flag Waving LED">
          <div class="product-info">
            <h3>American Flag Waving LED Patriotic Metal Frame 48"</h3>
            <div class="price">$850.00</div>
            <button class="details-btn">Details</button>
          </div>
        </div>

        <!-- Product 2 -->
        <div class="product-card">
          <img src="/Images/Flag-Infinity-Light-1-768x768.webp" alt="Flag Infinity Light">
          <div class="product-info">
            <h3>Flag Infinity Light Standing 23"</h3>
            <div class="price">$345.00</div>
            <button class="details-btn">Details</button>
          </div>
        </div>

        <!-- Product 3 -->
        <div class="product-card">
          <img src="/Images/light-bursts.webp" alt="LED Light Burst Patriotic">
          <div class="product-info">
            <h3>LED Light Burst Patriotic 36"</h3>
            <div class="price">$55.00</div>
            <button class="details-btn">Details</button>
          </div>
        </div>

        <!-- Product 4 -->
        <div class="product-card">
          <img src="/Images/Spritzer-Patriotic-white-bg-768x768.webp" alt="LED Spritzer">
          <div class="product-info">
            <h3>LED Spritzer, Red, Pure White, & Blue</h3>
            <div class="price">$65.00</div>
            <button class="details-btn">Details</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.patriotic-section {
  padding: 70px 0;
  background: #f8f9fa;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 15px;
}

.badge {
  background: #0c2340;
  color: white;
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 600;
}

.section-title {
  font-size: 2.4rem;
  color: #0c2340;
  margin: 0;
}

.view-all {
  color: #0c2340;
  text-decoration: none;
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.12);
}

.product-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  font-size: 1.1rem;
  line-height: 1.4;
  margin-bottom: 12px;
  min-height: 64px;
}

.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 16px;
}

.details-btn {
  width: 100%;
  padding: 12px;
  background: #0c2340;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.details-btn:hover {
  background: #F49322;
  color: #fff;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>