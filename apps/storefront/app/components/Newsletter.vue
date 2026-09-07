<template>
  <section
    aria-label="Newsletter subscription"
    role="region"
    class="newsletter-bar"
  >
    <div class="container">
      <div class="newsletter-inner">
        <div class="newsletter-left">
          <span class="paper-plane d-none" aria-hidden="true">✉️</span>
          <h2 class="newsletter-title">Sign Up to Newsletter</h2>
        </div>

        <form
          class="newsletter-form"
          @submit.prevent="subscribe"
          aria-label="Subscribe to our newsletter"
        >
          <label for="newsletter-email" class="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            v-model="email"
            placeholder="Email"
            required
            autocomplete="email"
            aria-required="true"
          />
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
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

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
  font-weight: 600;
  color: white;
  margin: 0;
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
  min-width: 0;
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

.newsletter-form button:focus-visible {
  outline: 2px solid #f49321;
  outline-offset: 2px;
}

.newsletter-form input:focus-visible {
  outline: 2px solid #f49321;
  outline-offset: 2px;
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
