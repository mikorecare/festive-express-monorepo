<template>
  <div>
    <!-- Hero Banner -->
    <section class="page-hero">
      <div class="hero-overlay">
        <div class="container">
            <div class="hero-content">
                <h1>MEMBERSHIP</h1>
                <p class="breadcrumb">HOME / MEMBERSHIP</p>
            </div>
        </div>
      </div>
    </section>

    <!-- Pricing Plans -->
    <div class="page-main-section container">
        <div class="section-header">
            <h2 class="section-title">Choose Your Membership Plan</h2>
            <p class="subtitle">Worry-free lighting with all the essentials handled by FLP</p>
        </div>

        <div class="plans-grid">
            <!-- Base Plan -->
            <div class="plan-card">
                <div class="plan-header">
                    <h3>Base</h3>
                    <p class="plan-desc">Worry-free lighting with all the essentials handled by FLP</p>
                </div>
                <div class="price text-center">
                    <span class="amount"><sup>$</sup>189<sup>99</sup></span>
                    <span class="period d-block">Monthly</span>
                </div>
                <ul class="features">
                    <li>✓ Professional installation &amp; takedown</li>
                    <li>✓ Annual safety check + system inspection</li>
                    <li>✓ Standard maintenance throughout the season</li>
                    <li>✓ Weather-related service calls included</li>
                    <li>✓ Access to member-only booking priority</li>
                    <li>✓ Clean storage of FLP-provided lights</li>
                </ul>
                <button class="plan-btn">Buy Now</button>
            </div>

            <!-- Enhanced Plan -->
            <div class="plan-card popular">
                <div class="popular-badge">POPULAR</div>
                <div class="plan-header">
                    <h3>Enhanced</h3>
                    <p class="plan-desc">Ideal for homeowners who want elevated style</p>
                </div>
                <div class="price text-center">
                    <span class="amount"><sup>$</sup>275<sup>99</sup></span>
                    <span class="period d-block">Monthly</span>
                </div>
                <ul class="features">
                    <li>✓ Custom design consult with a certified FLP lighting designer</li>
                    <li>✓ Expanded lighting coverage (roofline + one feature area)</li>
                    <li>✓ Proactive maintenance</li>
                    <li>✓ Mid-season refresh</li>
                    <li>✓ Upgraded warm-white LEDs</li>
                    <li>✓ Early-season scheduling priority</li>
                </ul>
                <button class="plan-btn">Buy Now</button>
            </div>

            <!-- Premium Plan -->
            <div class="plan-card">
                <div class="plan-header">
                    <h3>Premium</h3>
                    <p class="plan-desc">The most luxurious, design-forward, and hands-off option</p>
                </div>
                <div class="price text-center">
                    <span class="amount"><sup>$</sup>487<sup>99</sup></span>
                    <span class="period d-block">Monthly</span>
                </div>
                <ul class="features">
                    <li>✓ Full custom design package — whole-home concept + premium layout</li>
                    <li>✓ Expanded display coverage (roofline, trees, greenery, architectural accents)</li>
                    <li>✓ Premium light upgrades: commercial-grade LEDs, RGB add-ons, specialty décor</li>
                    <li>✓ Unlimited in-season maintenance</li>
                    <li>✓ Priority 1 scheduling for install &amp; takedown</li>
                    <li>✓ Complimentary post-season clean &amp; quality check</li>
                    <li>✓ Dedicated account manager</li>
                </ul>
                <button class="plan-btn">Buy Now</button>
            </div>
        </div>
    </div>

    <Newsletter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Membership'
})
</script>

<style scoped>
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.plan-card {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  position: relative;
  transition: transform 0.3s;
}
.plan-header{background: #1d3156;
    padding: 30px 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px; 
    text-align: center;   
}
.plan-header h3{
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    padding: 0;
}
.plan-header p{
    color: #fff;
    font-size: 13px;
}

.plan-card:hover {
  transform: translateY(-10px);
}

.plan-card.popular {
  border: 3px solid #F49322;
  transform: scale(1.05);
}

.popular-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #F49322;
  color: white;
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.price {
  font-size: 3.8rem;
  font-weight: 700;
  color: #ff890b;
  margin: 20px 0;
}
.amount sup{font-size: .3em; top: -1.5em;}
.period{font-size: 14px; color: #54595f;}

.plan-btn {
  width: 80%;
  background: #F49322;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-weight: 700;
  margin-top: 20px;
  cursor: pointer;
  display: block;
  margin: 40px auto 0;
}

.plan-btn:hover {
  background: #0c2340;
}

ul.features{
  display: block;
}
ul.features li{
  display: block;
  padding: 10px 0;
  font-size: 14px;
  color: #7a7a7a;
}
</style>