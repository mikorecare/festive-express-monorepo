<template>
  <section class="halloween-section">
    <div class="container">
      <div class="section-header">
        <span class="badge">FALL COLLECTION</span>
        <h2 class="section-title">Halloween Décor</h2>
        <NuxtLink to="/halloween" class="view-all"
          >View all Halloween →</NuxtLink
        >
      </div>

      <div class="products-grid">
        <!-- Item 1 -->
        <div class="product-card">
          <img src="/Images/HWN-PO-COFFIN.webp" alt="Photo Op Coffin Grave" />
          <div class="product-info">
            <h3>Photo Op Coffin Grave 6'</h3>
            <div class="price">$5,100.00</div>
            <button class="details-btn">Details</button>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="product-card">
          <img src="/Images/HWN-PO-JACK.webp" alt="Photo Op Pumpkin Lantern" />
          <div class="product-info">
            <h3>Photo Op Pumpkin Lantern 3.5'</h3>
            <div class="price">$3,658.00</div>
            <button class="details-btn">Details</button>
          </div>
        </div>

        <!-- Item 3 -->
        <div class="product-card">
          <img src="/Images/HWN-PO-SCROW.webp" alt="Photo Op Straw Scarecrow" />
          <div class="product-info">
            <h3>Photo Op Straw Scarecrow 6'</h3>
            <div class="price">$3,154.00</div>
            <button class="details-btn">Details</button>
          </div>
        </div>

        <!-- Item 4 -->
        <div class="product-card">
          <img
            src="/Images/HWN-PO-SPDRWB.webp"
            alt="Photo Op Brown Spider Web"
          />
          <div class="product-info">
            <h3>Photo Op Brown Spider Tree Web</h3>
            <div class="price">$4,214.00</div>
            <button class="details-btn">Details</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.halloween-section {
  padding: 70px 0;
  background: #f9f9f9;
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
  background: #1c2d5b;
  color: white;
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 600;
}

.section-title {
  font-size: 2.4rem;
  color: #1c2d5b;
  margin: 0;
}

.view-all {
  color: #1c2d5b;
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
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
  font-size: 1.35rem;
  font-weight: 700;
  color: #1c2d5b;
  margin-bottom: 16px;
}

.details-btn {
  width: 100%;
  padding: 12px;
  background: #1c2d5b;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.details-btn:hover {
  background: #f49321;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
