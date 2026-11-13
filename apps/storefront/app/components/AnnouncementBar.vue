<template>
  <div
    class="announcement-bar"
    role="region"
    aria-label="Promotional announcement"
  >
    <div class="marquee-track">
      <!-- Render two identical groups for a seamless, infinite scroll loop -->
      <div
        v-for="group in 2"
        :key="group"
        class="marquee-group"
        :aria-hidden="group === 2"
      >
        <p v-for="item in 4" :key="item" class="promo-text">
          <span>Light up the holidays! Use code </span>
          <button
            type="button"
            class="code-badge"
            :tabindex="group === 2 ? -1 : 0"
            @click="copyCode"
            title="Click to copy code"
          >
            {{ promoCode }}
          </button>
          <span>
            to get
            <strong class="discount-amount">{{ formattedDiscount }}</strong> off
            on your Christmas lights
          </span>
          <span class="separator" aria-hidden="true">•</span>
        </p>
      </div>
    </div>
  </div>

  <!-- Copied Success Modal -->
  <transition name="modal-fade">
    <div v-if="copied" class="modal-backdrop" @click.self="copied = false">
      <div
        class="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        <h3 id="modal-title" class="modal-title">Promo Code Copied!</h3>
        <p class="modal-message">
          Code <strong class="highlight-code">{{ promoCode }}</strong> has been
          copied to your clipboard. Paste it at promo code section at checkout to get
          <strong class="highlight-discount">{{ formattedDiscount }}</strong>
          off!
        </p>
        <button type="button" class="modal-close-btn" @click="copied = false">
          Got it!
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from "vue";

const promoCode = "FEX500";
const baseDiscountUSD = 500;
const selectedCurrency = ref("USD");
const copied = ref(false);

const currencyRates = {
  USD: { symbol: "$", rate: 1 },
  PHP: { symbol: "₱", rate: 58 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
};

const formattedDiscount = computed(() => {
  const { symbol, rate } = currencyRates[selectedCurrency.value];
  const converted = Math.round(baseDiscountUSD * rate).toLocaleString();
  return `${symbol}${converted}`;
});

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(promoCode);
    copied.value = true;
  } catch (err) {
    console.error("Failed to copy promo code:", err);
  }
};
</script>

<style scoped>
.announcement-bar {
  --brand-primary: #1c2d58;
  --brand-orange: #f49321;
  --brand-pink: #ec008c;

  position: sticky;
  top: 0;
  z-index: 999999;
  width: 100%;
  overflow: hidden;
  background-color: var(--brand-primary);
  color: #ffffff;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(28, 45, 88, 0.25);
  border-bottom: 2px solid var(--brand-orange);
  padding: 0.55rem 0;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: scroll-left 35s linear infinite;
}

/* Pause scrolling on hover so users can easily click FEX500 */
.announcement-bar:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.promo-text {
  margin: 0;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
}

.separator {
  margin: 0 2.5rem;
  color: var(--brand-orange);
  font-weight: 700;
}

.code-badge {
  display: inline-block;
  background-color: var(--brand-pink);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.12rem 0.5rem;
  margin: 0 0.35rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.15s ease,
    filter 0.15s ease;
}

.code-badge:hover {
  filter: brightness(1.12);
  transform: translateY(-1px);
}

.code-badge:active {
  transform: translateY(0);
}

.discount-amount {
  color: var(--brand-orange);
  font-weight: 700;
  margin-left: 0.25rem;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (max-width: 768px) {
  .announcement-bar {
    font-size: 0.8125rem;
    padding: 0.5rem 0;
  }

  .separator {
    margin: 0 1.75rem;
  }
}

/* --- Modal Styles --- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(28, 45, 88, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background-color: #ffffff;
  color: #1c2d58;
  width: 100%;
  max-width: 360px;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-top: 4px solid #ec008c;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
}

.modal-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.modal-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c2d58;
}

.modal-message {
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  line-align: 1.5;
  color: #4a5568;
}

.highlight-code {
  background-color: #fef0f7;
  color: #ec008c;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-weight: 700;
}

.highlight-discount {
  color: #f49321;
  font-weight: 700;
}

.modal-close-btn {
  background-color: #1c2d58;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
}

.modal-close-btn:hover {
  background-color: #273b72;
  transform: translateY(-1px);
}

.modal-close-btn:active {
  transform: translateY(0);
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
