<template>
  <button class="crystal-btn px-5" type="button">
    <!-- The SVG Background -->
    <svg
      class="crystal-btn__bg"
      viewBox="0 0 463 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <!-- Outer Gradient Layer -->
      <path
        d="M413.792 0H49.008C21.9416 0 0 21.9416 0 49.008C0 76.0743 21.9416 98.016 49.008 98.016H413.792C440.858 98.016 462.8 76.0743 462.8 49.008C462.8 21.9416 440.858 0 413.792 0Z"
        fill="url(#animated_gradient)"
      />
      <!-- Inner Dark Layer with White Stroke -->
      <path
        d="M413.017 3.12708H49.7831C24.4986 3.12708 4.00146 23.6242 4.00146 48.9087V49.107C4.00146 74.3915 24.4986 94.8886 49.7831 94.8886H413.017C438.302 94.8886 458.799 74.3915 458.799 49.107V48.9087C458.799 23.6242 438.302 3.12708 413.017 3.12708Z"
        fill="#181345"
        stroke="white"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <defs>
        <linearGradient
          id="animated_gradient"
          x1="-100%"
          y1="49.008"
          x2="0%"
          y2="49.008"
          gradientUnits="userSpaceOnUse"
        >
          <!-- Base stops -->
          <stop stop-color="#2A3885" />
          <stop offset="0.05" stop-color="#21274C" />
          <stop offset="0.12" stop-color="#121528" />
          <stop offset="0.38" stop-color="#0C9DD9" />
          <stop offset="0.53" stop-color="#101940" />
          <stop offset="0.69" stop-color="#F9F4EA" />
          <stop offset="0.83" stop-color="#13183F" />
          <stop offset="1" stop-color="#27A5D9" />

          <!-- Duplicated stops for seamless looping -->
          <stop offset="1.05" stop-color="#2A3885" />
          <stop offset="1.12" stop-color="#21274C" />
          <stop offset="1.24" stop-color="#121528" />
          <stop offset="1.5" stop-color="#0C9DD9" />
          <stop offset="1.65" stop-color="#101940" />
          <stop offset="1.81" stop-color="#F9F4EA" />
          <stop offset="1.95" stop-color="#13183F" />
          <stop offset="2" stop-color="#27A5D9" />

          <!-- Native SVG Animation to make the gradient flow -->
          <animate
            attributeName="x1"
            values="-100%; 0%"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values="0%; 100%"
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>

    <!-- The Text Layer -->
    <span class="crystal-btn__text">
      <slot>Button</slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  // Optional props if you want to extend later
});
</script>

<style scoped>
.crystal-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 280px; /* Ensures it doesn't get too squished on small screens */
  aspect-ratio: 463 / 99;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.crystal-btn__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.4));
}

/* This makes sure the text is visible, centered, and styled properly */
.crystal-btn__text {
  position: relative;
  z-index: 10; /* Higher than the SVG background */
  color: #ffffff;
  font-family: inherit;
  font-size: clamp(1rem, 4.5cqw, 1.5rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 0 1.5rem;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none; /* Lets clicks pass through to the button */
}

.crystal-btn:hover {
  filter: brightness(1.15);
}

.crystal-btn:hover .crystal-btn__bg {
  filter: drop-shadow(0px 4px 15px rgba(12, 157, 217, 0.5));
}

.crystal-btn:active {
  transform: scale(0.97);
}
</style>
