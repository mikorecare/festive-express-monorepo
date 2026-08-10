<template>
  <footer class="main-footer">
    <div class="container">
      <div class="footer-content">
        <!-- Logo -->
        <div class="footer-logo">
          <img src="/Images/FE-Logo.png" alt="Festive Lighting Pros" class="footer-logo-img">
        </div>

        <!-- Contact Us -->
        <div class="footer-column">
          <h4>CONTACT US</h4>
          <p>packages@festive.express</p>
          <p>☎ {{ settings.contact_phone_display || '(941) 239-4722' }}</p>
          <!-- <p>By appointment only</p> -->
          <!-- <p>1973 Northgate Blvd, Sarasota, FL 34234</p> -->
        </div>

        <!-- Customer -->
        <div class="footer-column d-none">
          <h4>CUSTOMER</h4>
          <a href="#">Help Center</a>
          <!-- <a href="#">My Account</a> -->
          <a href="#">Refund Policy</a>
          <a href="#">Gift Cards</a>
        </div>

        <!-- Quick Links -->
        <div class="footer-column">
          <h4>QUICK LINKS</h4>
          <!-- <a href="#">Search</a> -->
          <a href="/about-us">About Us</a>
          <a href="/contact">Contact Us</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom2">
        <!-- Bottom Bar -->
        <div class="container footer-bottom">
            <div class="copyright">
                Copyright © 2026 Festive Express. All Rights Reserved.
            </div>
            
            <div class="payment-methods">
                <img src="/Images/checkout.png" alt="Payment Methhod" class="payment-method-img">
            </div>
        </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { settings, loadSettings, telHref } = useSettings()

</script>

<style scoped>
.main-footer {
  background: #101518;
  color: white;
  padding-top: 60px;
  border-top: 5px solid #FFF;
}

.footer-content {
  display: grid;
  /* grid-template-columns: 2fr 1fr 1fr 1fr; */
  grid-template-columns: repeat(3, 1fr); /* 3 col */
  gap: 40px;
  margin-bottom: 60px;
}

.footer-logo-img {
  height: auto;
  width: 75%;
}

.tagline {
  color: #aaa;
  margin-top: 8px;
  font-size: 0.95rem;
}

.footer-column h4 {
  color: #ff7a00;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.footer-column a {
  color: #ccc;
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #ff7a00;
}

.footer-bottom {
  border-top: 1px solid #1f3a5c;
  padding-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  color: #aaa;
  font-size: 0.95rem;
}
.footer-bottom2 {
  background-color: #fff;
  padding-bottom: 25px;
}
.copyright{color: #0c2340; font-size: 16px;}

.payment-methods span {
  margin-left: 12px;
  font-size: 1.1rem;
}
.payment-method-img{
  width: 100%;
}

/* Responsive */
@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>