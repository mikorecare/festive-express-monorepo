<template>
  <div>
    <!-- Contact Hero Banner -->
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade>CONTACT US</h1>
            <p v-fade class="breadcrumb">HOME / CONTACT US</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="page-main-section container">
      <div class="contact-grid">
        <!-- Left: Speak With Our Experts -->
        <div class="contact-left">
          <h2>SPEAK WITH OUR LIGHTING & DECOR EXPERTS TODAY</h2>
          <p class="intro">
            Have a question about your order or need help choosing the right lighting? Our Festive Express experts are ready to assist you with fast, friendly support—contact us today!
          </p>

          <div class="info-cards">
            <div class="info-card">
              <div class="icon">✉️</div>
              <div>
                <strong>Contact Us</strong><br>
                Call us: <span class="highlight">(941) 239-4722</span><br>
                packages@festive.express
              </div>
            </div>

            <div class="info-card">
              <div class="icon">🕒</div>
              <div>
                <strong>Opening Hours</strong><br>
                Mon - Sat: 7:00 am - 8:00 pm<br>
                Sunday: 8:00 am - 6:00 pm
              </div>
            </div>

            <!-- <div class="info-card">
              <div class="icon">📍</div>
              <div>
                <strong>Our Office</strong><br>
                1973 Northgate Blvd<br>
                Sarasota, FL 34234
              </div>
            </div> -->
          </div>
        </div>

        <!-- Right: Contact Form -->
        <div class="contact-form">
          <h3>Let’s connect today.</h3>
          <p class="form-subtitle">
            We’re here to guide you—whether you’re choosing products, planning a display, or just need expert advice to light up your next project.
          </p>

          <form @submit.prevent="submitForm">
            <div class="form-row">
              <input v-model="form.firstName" type="text" placeholder="First Name *" required>
              <input v-model="form.lastName" type="text" placeholder="Last Name *" required>
            </div>

            <input v-model="form.phone" type="tel" placeholder="Phone *" required>
            <input v-model="form.email" type="email" placeholder="Email *" required>

            <textarea v-model="form.message" placeholder="Message *" rows="6" required></textarea>

            <button type="submit" class="submit-btn">Send a Message</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Map Section -->
    <!-- <section class="map-section">
        <div class="container">
            <h2 class="map-title">Our Office Location</h2>
            <div class="map-wrapper"> -->
            <!-- Google Maps Embed -->
            <!-- <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.0000000000005!2d-82.12345678901234!3d27.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c0e5c8e8e8e8e8%3A0x1234567890abcdef!2s1973%20Northgate%20Blvd%2C%20Sarasota%2C%20FL%2034234!5e0!3m2!1sen!2sus!4v1720000000000" 
                width="100%" 
                height="450" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
            </div>
        </div>
    </section> -->

    <!-- <Newsletter /> -->
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Contact Us - Festive Express'
})
const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const submitForm = () => {
  alert('Thank you! Your message has been sent.')
  form.value = { name: '', email: '', phone: '', message: '' }
}
</script>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
}

.contact-left h2 {
  font-size: 2.4rem;
  line-height: 1.2;
  margin-bottom: 20px;
}

.intro {
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 40px;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 12px;
  display: flex;
  gap: 18px;
}

.icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.contact-form h3 {
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.form-subtitle {
  margin-bottom: 30px;
  color: #555;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-row input,
input, textarea {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
}

.submit-btn {
  background: #0c2340;
  color: white;
  border: none;
  padding: 16px 50px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.submit-btn:hover {
  background: #F49322;
}

/* Responsive */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}

.map-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.map-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 40px;
  color: #0c2340;
}

.map-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
</style>