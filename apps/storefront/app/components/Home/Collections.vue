<template>
  <section aria-label="Our collections" role="region" class="collections">
    <div class="container">
      <div class="section-header">
        <span class="badge" aria-hidden="true">SHOP BY CATEGORY</span>
        <h2 class="section-title">Our Collections</h2>
      </div>

      <div class="collections-grid" role="list">
        <!-- Collection 1 -->
        <div class="collection-card" role="listitem">
          <NuxtImg
            src="/Images/Permanent-outdoor-lights.jpg"
            alt="Roofline lighting display on a house"
            class="collection-image"
            loading="lazy"
          />
          <div class="card-content">
            <h3>Roofline Lighting</h3>
            <p class="popular">Most Popular</p>
            <button
              class="view-btn"
              aria-label="View Roofline Lighting products"
            >
              View Products
            </button>
          </div>
        </div>

        <!-- Collection 2 -->
        <div class="collection-card" role="listitem">
          <NuxtImg
            src="/Images/roofline-lighting-2.jpg"
            alt="Wreath and garlands holiday decoration"
            class="collection-image"
            loading="lazy"
          />
          <div class="card-content">
            <h3>Wreath, Garlands &amp; Bows</h3>
            <p class="popular">Classic</p>
            <button
              class="view-btn"
              aria-label="View Wreath and Garlands products"
            >
              View Products
            </button>
          </div>
        </div>

        <!-- Collection 3 -->
        <div class="collection-card" role="listitem">
          <NuxtImg
            src="/Images/21-web-or-mls-4605-5th-Ave-NE23.jpg"
            alt="Ground and shrub landscape lighting"
            class="collection-image"
            loading="lazy"
          />
          <div class="card-content">
            <h3>Ground &amp; Shrub Lighting</h3>
            <p class="popular">Most Popular</p>
            <button
              class="view-btn"
              aria-label="View Ground and Shrub Lighting products"
            >
              View Products
            </button>
          </div>
        </div>

        <!-- Collection 4 -->
        <div class="collection-card" role="listitem">
          <NuxtImg
            src="/Images/Ground-Lighting-Bundle.jpg"
            alt="Light burst and spritzer decorative lights"
            class="collection-image"
            loading="lazy"
          />
          <div class="card-content">
            <h3>Light Burst &amp; Spritzers</h3>
            <p class="popular">Seasonal</p>
            <button
              class="view-btn"
              aria-label="View Light Burst and Spritzers products"
            >
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.collections {
  padding: 60px 0;
  background: #f9f9f9;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.badge {
  background: #1c2d5b;
  color: white;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 12px;
}

.section-title {
  text-align: center;
  font-size: 2.4rem;
  margin-bottom: 0;
  color: #1c2d5b;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.collection-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.collection-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.collection-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(12, 35, 64, 0.95));
  padding: 30px 20px 25px;
  color: white;
}

.card-content h3 {
  margin: 0 0 8px;
  font-size: 1.35rem;
}

.popular {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 15px;
}

.view-btn {
  background: white;
  color: #1c2d5b;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn:hover {
  background: #f49321;
  color: white;
}

.view-btn:focus-visible {
  outline: 2px solid #f49321;
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .collections {
    padding: 40px 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .collection-image {
    height: 220px;
  }
}
</style>
