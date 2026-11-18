<template>
  <div
    class="announcement-bar"
    role="region"
    aria-label="Promotional announcement and countdown"
  >
    <div class="marquee-track">
      <div
        v-for="group in 2"
        :key="group"
        class="marquee-group"
        :aria-hidden="group === 2 ? 'true' : undefined"
      >
        <template v-for="(entry, i) in marqueeSequence" :key="`${group}-${i}`">
          <!-- Promo message -->
          <p v-if="entry.type === 'promo'" class="marquee-item promo-text">
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
              <strong class="discount-amount">{{ formattedDiscount }}</strong>
              off on your Christmas lights
            </span>
            <span class="separator" aria-hidden="true">•</span>
          </p>

          <!-- Countdown message -->
          <p v-else class="marquee-item countdown-text">
            <span class="countdown-label">
              <IcnChirstmasTree class="inline-tree" />
              Christmas is coming! Only
            </span>

            <!-- Segmented Time Badges -->
            <span class="countdown-badges">
              <span class="countdown-badge">
                <span class="countdown-value">{{ countdown.days }}</span
                >d
              </span>
              <span class="countdown-badge">
                <span class="countdown-value">{{ countdown.hours }}</span
                >h
              </span>
              <span class="countdown-badge">
                <span class="countdown-value">{{ countdown.minutes }}</span
                >m
              </span>
              <span class="countdown-badge">
                <span class="countdown-value">{{ countdown.seconds }}</span
                >s
              </span>
            </span>

            <span class="countdown-label">
              left to shop for your holiday lights!
              <IcnChirstmasTree class="inline-tree" />
            </span>
            <span class="separator" aria-hidden="true">•</span>
          </p>
        </template>
      </div>
    </div>
  </div>

  <!-- Copied Success Modal -->

  <!-- Copied Success Modal -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="copied" class="modal-backdrop" @click.self="copied = false">
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          @keydown.esc="copied = false"
        >
          <button
            type="button"
            class="modal-x"
            aria-label="Close"
            @click="copied = false"
          >
            &times;
          </button>

          <!-- <div class="modal-success-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12l4 4L19 6" />
            </svg>
          </div> -->

          <div>
            <LogosDiscountLogo />
          </div>

          <h3 id="modal-title" class="modal-title">Promo Code Copied!</h3>

          <p id="modal-description" class="modal-message">
            Your discount is ready. Apply this code at checkout to save.
          </p>

          <div class="modal-coupon mb-4">
            <span class="modal-coupon-label"> YOUR PROMO CODE </span>
            <strong class="modal-coupon-code">
              {{ promoCode }}
            </strong>
          </div>

          <button type="button" class="btn-3d-glossy px-4 py-2 font-bold" @click="copied = false">
            Continue Shopping
            <span aria-hidden="true">→</span>
          </button>

          <p class="modal-hint text-gray-700">
            Paste your code in the promo code field at checkout.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import IcnChirstmasTree from "./Icons/IcnChirstmasTree.vue";

/* -------------------- Promo code & currency -------------------- */
const promoCode = "FEX500";
const baseDiscountUSD = 500;
const selectedCurrency = ref("USD");
const copied = ref(false);

const marqueeSequence = computed(() => {
  const promo = { type: "promo" };
  const countdown = { type: "countdown" };

  if (isChristmasSeason.value) {
    return [promo, promo, promo, promo];
  }
  return [promo, countdown, promo, countdown];
});

const currencyRates = {
  USD: { symbol: "$", rate: 1 },
  PHP: { symbol: "₱", rate: 58 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
};

const formattedDiscount = computed(() => {
  const { symbol, rate } = currencyRates[selectedCurrency.value];
  const converted = Math.round(baseDiscountUSD * rate).toLocaleString("en-US");
  return `${symbol}${converted}`;
});

/* ---------- Clipboard (HTTPS + fallback for older browsers) ---------- */
const copyCode = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(promoCode);
    } else {
      // Fallback for non-HTTPS / unsupported browsers
      const el = document.createElement("textarea");
      el.value = promoCode;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    copied.value = true;
  } catch (err) {
    console.error("Failed to copy promo code:", err);
  }
};

/* -------------------- Christmas countdown -------------------- */
const isChristmasSeason = computed(() => {
  // Christmas is Dec 25. Season = December 1 through December 31
  const now = new Date();
  const month = now.getMonth(); // 0-indexed: 11 = December
  return month === 11;
});

const now = ref(new Date());
let timerId = null;

onMounted(() => {
  // Update every 1 second for the seconds display
  timerId = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timerId) clearInterval(timerId);
});

// Return an object with padded values for the UI
const countdown = computed(() => {
  if (isChristmasSeason.value) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const currentYear = now.value.getFullYear();
  const christmas = new Date(currentYear, 11, 25); // Dec 25 of current year

  // If Christmas already passed this year, target next year
  const target =
    now.value.getTime() > christmas.getTime()
      ? new Date(currentYear + 1, 11, 25)
      : christmas;

  const diffMs = target.getTime() - now.value.getTime();
  if (diffMs <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const totalSeconds = Math.floor(diffMs / 1000);

  // Pad with leading zero if less than 10
  const pad = (num) => String(num).padStart(2, "0");

  return {
    days: String(Math.floor(totalSeconds / 86_400)),
    hours: pad(Math.floor((totalSeconds % 86_400) / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(Math.floor(totalSeconds % 60)),
  };
});
</script>

<style scoped>
.announcement-bar {
  --bar-bg: #0f1f45; /* dark navy from the mockup */
  --bar-text: #ffffff;
  --accent: #f58220; /* brand orange */

  position: sticky;
  top: 0;
  z-index: 999999;
  width: 100%;
  overflow: hidden;
  background-color: var(--bar-bg);
  color: var(--bar-text);
  font-family: inherit; /* picks up Poppins from your root, like the mockup */
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  padding: 0.55rem 0;
  contain: layout style paint;
}

.marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: scroll-left 45s linear infinite;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.announcement-bar:hover .marquee-track,
.announcement-bar:focus-within .marquee-track {
  animation-play-state: paused;
}

.marquee-group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.marquee-item {
  margin: 0;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
}

/* Promo text (existing) */
.promo-text {
  /* inherits from .marquee-item */
}

/* Countdown text — brand-aligned */
.countdown-text {
  font-weight: 500;
  gap: 0.5rem;
}

.countdown-label {
  display: inline-flex;
  align-items: center;
}

/* --- Countdown Badges --- */
.countdown-badges {
  display: inline-flex;
  gap: 0.35rem;
  margin: 0 0.25rem;
}

.countdown-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.08);
  border: 2px solid var(--accent);
  border-radius: 6px;
  padding: 0.15rem 0.45rem;
  font-size: 0.85rem;
  line-height: 1;
  font-weight: 500;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
}

.countdown-value {
  color: #ffffff;
  font-weight: 800;
  margin-right: 1px;
}

.inline-tree {
  display: inline-block;
  vertical-align: -0.15em;
  margin: 0 0.2em;
  color: white;
  width: 1.1em;
  height: 1.1em;
}

/* Separator between marquee items */
.separator {
  margin: 0 2.5rem;
  color: var(--accent);
  opacity: 1;
  font-weight: 700;
}

/* --- Code Badge --- */
.code-badge {
  display: inline-block;
  background-color: transparent;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.6rem;
  margin: 0 0.4rem;
  border: 2px solid var(--accent);
  border-radius: 8px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;
}

.code-badge:hover {
  background-color: rgba(245, 130, 32, 0.15);
  transform: translateY(-1px);
}

.code-badge:active {
  transform: translateY(0);
}

.code-badge:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.discount-amount {
  color: var(--bar-text);
  font-weight: 600;
  margin-left: 0.2rem;
}

/* --- Countdown --- */
.countdown-container {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.countdown-label {
  font-weight: 700;
  margin-right: 0.5rem;
  color: var(--bar-text);
}

.countdown-timer {
  display: flex;
  gap: 0.35rem;
}

.time-unit {
  background-color: var(--badge-bg);
  color: var(--badge-text);
  border-radius: 4px;
  padding: 0.15rem 0.45rem;
  display: inline-flex;
  align-items: baseline;
  min-width: 2.2rem;
  justify-content: center;
  font-variant-numeric: tabular-nums;
}

.time-unit strong {
  font-weight: 800;
  color: var(--badge-text);
}

.time-unit small {
  margin-left: 1px;
  font-size: 0.75em;
  color: var(--badge-text);
  opacity: 0.85;
}

/* --- Animation: GPU-accelerated translate3d --- */
@keyframes scroll-left {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .announcement-bar {
    font-size: 0.8125rem;
    padding: 0.5rem 0;
  }

  .separator {
    margin: 0 1.75rem;
  }

  .countdown-badge {
    padding: 0.1rem 0.35rem;
    font-size: 0.75rem;
  }
}

/* --- Accessibility: respect reduced-motion --- */
@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    transform: none;
    flex-wrap: wrap;
  }
  .marquee-group[aria-hidden="true"] {
    display: none;
  }
  .marquee-group {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* Card */
.modal-card {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 36px 30px 28px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
  text-align: center;
  color: #162447;
  font-family: system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI",
    Roboto, sans-serif;
}

/* Close icon */
.modal-x {
  position: absolute;
  top: 14px;
  right: 16px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

/* Success check */
.modal-success-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #ecfdf3;
  color: #16a34a;
}

.modal-success-icon svg {
  width: 30px;
  height: 30px;
}

/* Heading */
.modal-title {
  margin: 0 0 10px;
  color: #162447;
  font-size: 23px;
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: -0.5px;
}

.modal-message {
  margin: 0 0 24px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

/* Coupon */
.modal-coupon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 12px;
  border: 1.5px dashed #f49321;
  border-radius: 12px;
  background: #fff8f1;
}

.modal-coupon-label {
  color: #f49321;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.modal-coupon-code {
  max-width: 100%;
  color: #162447;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 4px;
  overflow-wrap: anywhere;
}

/* Savings */
.modal-discount {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 20px 0;
  padding: 0 2px;
  font-size: 14px;
  color: #64748b;
}

.modal-discount strong {
  color: #16a34a;
  font-size: 21px;
  font-weight: 800;
}


.modal-close-btn:hover {
  background: #df6c0c;
  transform: translateY(-1px);
}

.modal-close-btn:active {
  transform: translateY(0);
}

.modal-hint {
  margin: 16px 0 0;
  font-size: 12px;
  line-height: 1.5;
}

/* Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: translateY(12px) scale(0.97);
  opacity: 0;
}

/* Mobile */
@media (max-width: 480px) {
  .modal-backdrop {
    padding: 16px;
  }

  .modal-card {
    max-height: calc(100dvh - 32px);
    padding: 30px 22px 24px;
    border-radius: 18px;
  }

  .modal-title {
    font-size: 21px;
  }

  .modal-coupon-code {
    font-size: 22px;
  }

  .modal-success-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 16px;
  }

  .modal-discount strong {
    font-size: 19px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .modal-fade-enter-active .modal-card,
  .modal-fade-leave-active .modal-card {
    transition: none;
  }
}
.highlight-code {
  background-color: #162447;
  color: #ffffff;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-weight: 700;
}

.highlight-discount {
  color: #f58220;
  font-weight: 700;
}

.modal-close-btn {
  background-color: #162447;
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
  background-color: #24345f;
  transform: translateY(-1px);
}

.modal-close-btn:active {
  transform: translateY(0);
}

.modal-close-btn:focus-visible {
  outline: 2px solid #f58220;
  outline-offset: 2px;
}

/* --- Modal Transition --- */
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
