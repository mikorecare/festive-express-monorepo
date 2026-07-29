<template>
  <div class="thank-you-page">
    <!-- Hero Banner -->
    <section class="thank-hero snow-bg">
      <div class="container text-center">
        <span class="order-badge">
          <i class="fas fa-check-circle"></i> ORDER CONFIRMED
        </span>
        <h1>Thank You for Choosing Magic!</h1>
        <p class="hero-sub">
          Your holiday lighting experience has been secured. Get ready to shine this season.
        </p>
        <div class="order-number-box">
          <small>CONFIRMATION NUMBER</small>
          <strong>{{ orderNumber }}</strong>
        </div>
      </div>
    </section>

    <div class="container py-5">
      <div class="row g-4">
        <!-- Left: Package Details -->
        <div class="col-lg-8">
          <div class="info-card">
            <h3 class="card-heading">
              <i class="fas fa-gift me-2"></i> Your Holiday Package
            </h3>

            <div class="row g-4">
              <div class="col-md-5">
                <div class="selected-plan">
                  <small>SELECTED PLAN</small>
                  <h4>{{ packageName }}</h4>
                  <p class="plan-desc">{{ packageDesc }}</p>
                  <ul class="plan-features">
                    <li v-for="(f, i) in features" :key="i">
                      <i class="fas fa-check"></i> {{ f }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="col-md-7">
                <div class="date-box mb-3">
                  <div class="date-icon"><i class="fas fa-calendar-alt"></i></div>
                  <div>
                    <small>INSTALLATION DATE</small>
                    <strong>{{ installDate || 'To be confirmed' }}</strong>
                    <span v-if="installTime" class="d-block text-muted small">{{ installTime }}</span>
                  </div>
                </div>

                <div class="date-box">
                  <div class="date-icon"><i class="fas fa-calendar-check"></i></div>
                  <div>
                    <small>REMOVAL WINDOW</small>
                    <strong>{{ removalDate || 'To be scheduled' }}</strong>
                    <span class="d-block text-muted small">Hassle-free take down included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- What Happens Next -->
          <h3 class="section-heading mt-5 mb-4">What Happens Next?</h3>
          <div class="row g-3">
            <div class="col-md-4" v-for="(step, i) in steps" :key="i">
              <div class="step-card">
                <span class="step-num">{{ i + 1 }}</span>
                <h5>{{ step.title }}</h5>
                <p>{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="col-lg-4">
          <div class="help-card mb-4">
            <h4>
              <i class="fas fa-headset me-2"></i> Need Help?
            </h4>
            <p>Our team is standing by to ensure your holiday season is absolutely perfect. Reach out anytime.</p>

            <a href="tel:5555555548" class="help-btn phone">
              <i class="fas fa-phone-alt"></i>
              <div>
                <small>PHONE SUPPORT</small>
                <strong>(555) LIGHT-UP</strong>
              </div>
            </a>

            <a href="mailto:support@festive.express" class="help-btn email">
              <i class="fas fa-envelope"></i>
              <div>
                <small>EMAIL SUPPORT</small>
                <strong>support@festive.express</strong>
              </div>
            </a>

            <NuxtLink to="/" class="btn-dashboard">
              Go to Dashboard <i class="fas fa-arrow-right ms-1"></i>
            </NuxtLink>
          </div>

          <div class="testimonial-card">
            <span class="trusted-badge">TRUSTED PRO</span>
            <p class="quote">
              "The process was seamless and the results were stunning. Truly the best investment we made for our family's holiday spirit!"
            </p>
            <div class="author">— Sarah J., Happy Customer</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const orderNumber = ref(String(route.query.order || 'FLP-XXXX'))
const order = ref<any>(null)

const packageName = computed(() => order.value?.items?.[0]?.product_name || 'Holiday Package')
const packageDesc = computed(() => 'Our most popular all-inclusive residential lighting solution.')
const installDate = computed(() => formatDate(order.value?.preferred_install_date))
const installTime = ref('9:00 AM - 12:00 PM')
const removalDate = computed(() => formatDate(order.value?.removal_date))

const features = computed(() => {
  const opts = order.value?.items?.[0]?.options
  const list = ['Custom-fit C9 Roofline Lights', 'Wreath for the Main Entry', 'Automated Smart Timer']
  if (opts?.c9_color) list[0] = `Custom-fit C9 Roofline Lights (${opts.c9_color})`
  return list
})

const steps = [
  {
    title: 'Consultation',
    desc: 'Our lead designer will call you within 24 hours to confirm your custom layout and bulb colors.'
  },
  {
    title: 'Installation',
    desc: 'Our professional, insured crew arrives to handle the heavy lifting while you stay cozy inside.'
  },
  {
    title: 'Maintenance',
    desc: 'Enjoy a bright season! If a bulb goes out, we\'ll be there within 48 hours to fix it for free.'
  }
]

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(async () => {
  if (!route.query.order) return
  try {
    const res: any = await $fetch(`/orders/by-number/${route.query.order}`, {
      baseURL: config.public.apiBase
    })
    order.value = res
    orderNumber.value = res.order_number || String(route.query.order)
  } catch (e) {
    // fallback – still show confirmation number from query
    console.log('Order details not loaded, showing confirmation only')
  }
})

useHead({
  title: 'Thank You - Festive Lighting Pros Express'
})
</script>

<style scoped>
.thank-you-page {
  background: #e7e7e7;
}

/* Hero */
.thank-hero {
  background: linear-gradient(rgba(12, 35, 64, 0.75), rgba(12, 35, 64, 0.85)),
              url('/Images/Banner/hero-image.webp') center/cover no-repeat;
  color: #fff;
  padding: 80px 20px 70px;
  text-align: center;
}

.order-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(244, 147, 34, 0.2);
  border: 1px solid #F49322;
  color: #F49322;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.thank-hero h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.hero-sub {
  font-size: 1.15rem;
  opacity: 0.9;
  max-width: 520px;
  margin: 0 auto 28px;
}

.order-number-box {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 12px;
  padding: 14px 32px;
}

.order-number-box small {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 1px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.order-number-box strong {
  font-size: 1.4rem;
  letter-spacing: 1px;
}

/* Cards */
.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.card-heading {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 24px;
}

.selected-plan small {
  font-size: 0.7rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

.selected-plan h4 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0c2340;
  margin: 4px 0 8px;
}

.plan-desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 14px;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 6px;
}

.plan-features i {
  color: #10b981;
}

.date-box {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.date-icon {
  width: 42px;
  height: 42px;
  background: #eff6ff;
  color: #F49322;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.date-box small {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

.date-box strong {
  font-size: 1.05rem;
  color: #0c2340;
}

/* Steps */
.section-heading {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0c2340;
}

.step-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  height: 100%;
}

.step-num {
  display: inline-flex;
  width: 32px;
  height: 32px;
  background: #0c2340;
  color: #fff;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.step-card h5 {
  font-weight: 700;
  color: #0c2340;
  margin-bottom: 8px;
}

.step-card p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.55;
}

/* Help Card */
.help-card {
  background: #0c2340;
  color: #fff;
  border-radius: 16px;
  padding: 28px;
}

.help-card h4 {
  font-weight: 700;
  margin-bottom: 10px;
}

.help-card > p {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 20px;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 14px 16px;
  color: #fff;
  text-decoration: none;
  margin-bottom: 12px;
  transition: background 0.2s;
}

.help-btn:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
}

.help-btn i {
  font-size: 1.2rem;
  color: #F49322;
}

.help-btn small {
  display: block;
  font-size: 0.7rem;
  opacity: 0.7;
  letter-spacing: 0.5px;
}

.help-btn strong {
  font-size: 0.95rem;
}

.btn-dashboard {
  display: block;
  text-align: center;
  background: #F49322;
  color: #fff;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  margin-top: 8px;
  transition: background 0.3s;
}

.btn-dashboard:hover {
  background: #e07e0e;
  color: #fff;
}

/* Testimonial */
.testimonial-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  border-left: 4px solid #F49322;
}

.trusted-badge {
  display: inline-block;
  background: #fff7ed;
  color: #F49322;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  border-radius: 50px;
  margin-bottom: 12px;
}

.quote {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 12px;
}

.author {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0c2340;
}

@media (max-width: 768px) {
  .thank-hero h1 {
    font-size: 1.9rem;
  }
}
</style>