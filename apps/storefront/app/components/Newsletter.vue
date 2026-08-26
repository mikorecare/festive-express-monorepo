<template>
  <section class="newsletter-bar">
    <div class="container">
      <div class="newsletter-inner">
        <div class="newsletter-left">
          <span class="paper-plane d-none">✉️</span>
          <span class="newsletter-title">Sign Up to Newsletter</span>
        </div>

        <form class="newsletter-form" @submit.prevent="subscribe">
          <input type="email" v-model="email" placeholder="Email" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref("");

const subscribe = () => {
  if (email.value) {
    alert(`Thank you for subscribing with ${email.value}!`);
    email.value = "";
  }
};
</script>

<style scoped>
.newsletter-bar {
  background: #1a1a1a;
  color: white;
  padding: 22px 0;
}

.newsletter-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.newsletter-left {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 1.1rem;
  font-weight: 500;
}

.paper-plane {
  font-size: 1.5rem;
}
.newsletter-title {
  font-size: 1.375rem;
}

.newsletter-form {
  display: flex;
  gap: 0;
  max-width: 420px;
  width: 100%;
}

.newsletter-form input {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  outline: none;
}

.newsletter-form button {
  background: #1c2d5b;
  color: white;
  border: none;
  padding: 0 32px;
  border-radius: 0 4px 4px 0;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.3s;
}

.newsletter-form button:hover {
  background: #f49321;
}

/* Responsive */
@media (max-width: 768px) {
  .newsletter-inner {
    flex-direction: column;
    text-align: center;
  }

  .newsletter-form {
    max-width: 100%;
  }
}
</style>
