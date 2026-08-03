<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1>TERMS OF USE</h1>
            <p class="breadcrumb">HOME / TERMS OF USE</p>
          </div>
        </div>
      </div>
    </section>

    <div class="page-main-section container">
      <div class="legal-content">
        <p class="updated">Last updated: July 30, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Festive Lighting Pros Express website and services
          (“Services”), you agree to be bound by these Terms of Use. If you do not agree,
          please do not use our Services.
        </p>

        <h2>2. Services</h2>
        <p>
          We provide holiday and seasonal lighting packages, décor products, and related
          installation or rental services. Package details, pricing, and availability may
          change without notice.
        </p>

        <h2>3. Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials
          and for all activity under your account. Provide accurate information when ordering
          or registering.
        </p>

        <h2>4. Orders & Payments</h2>
        <p>
          Orders are subject to acceptance and availability. Prices are listed in USD unless
          otherwise stated. Payment is due as indicated at checkout. We may cancel or refuse
          orders in case of error, fraud concern, or stock issues.
        </p>

        <h2>5. Installation & Scheduling</h2>
        <p>
          Preferred install and removal dates are requests only. Confirmed dates will be
          communicated by our team. Access to the property and safe working conditions are
          required for service.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All content on this site—including logos, text, images, and design—is owned by
          Festive Lighting Pros or its licensors and may not be copied or used without permission.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Festive Lighting Pros shall not be liable
          for indirect, incidental, or consequential damages arising from use of the Services
          or site.
        </p>

        <h2>8. Changes</h2>
        <p>
          We may update these Terms at any time. Continued use of the site after changes
          means you accept the revised Terms.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about these Terms:
          <a href="/contact">Contact Us</a> or call (941) 222-1012.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Terms of Use'
})
</script>

<style scoped>
.legal-content {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 0 80px;
  color: #334155;
  line-height: 1.7;
}

.legal-content .updated {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 32px;
}

.legal-content h2 {
  color: #0c2340;
  font-size: 1.25rem;
  margin: 32px 0 12px;
}

.legal-content p {
  margin-bottom: 12px;
}

.legal-content a {
  color: #F49322;
  text-decoration: none;
  font-weight: 500;
}

.legal-content a:hover {
  text-decoration: underline;
}
</style>