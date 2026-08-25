<template>
  <NuxtLink
    ref="rootRef"
    to="/preview-your-home"
    class="group relative z-10 block w-fit overflow-hidden rounded-lg"
    :class="[
      centered ? 'mx-auto' : '',
      enterFromLeft ? 'festivo-btn-enter' : '',
      enterFromLeft && isIn ? 'is-in' : '',
      isIn ? 'festivo-btn-ready' : '',
    ]"
  >
    <img
      src="/Images/PreviewYourHomeButton.png"
      alt="Preview Your Home"
      class="relative z-0 w-[220px] max-lg:w-[180px] h-auto drop-shadow-[0_12px_28px_rgba(224,107,0,0.35)]"
    />

    <span
      class="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-lg"
      aria-hidden="true"
    >
      <span
        class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,transparent_20%,rgba(255,255,255,0.12)_40%,rgba(255,255,255,0.45)_50%,rgba(255,255,255,0.12)_60%,transparent_80%)] rotate-[25deg] animate-[glossyShineContinuous_3s_linear_infinite]"
      />
    </span>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  /** Slide in from the left when the button enters the viewport */
  enterFromLeft: { type: Boolean, default: true },
  /** Keep mx-auto centering (set false on homepage for asymmetric placement) */
  centered: { type: Boolean, default: true },
});

const rootRef = ref(null);
const isIn = ref(false);

onMounted(() => {
  if (!props.enterFromLeft) {
    isIn.value = true;
    return;
  }

  nextTick(() => {
    const el = rootRef.value?.$el ?? rootRef.value;
    if (!el || typeof el === "string") {
      isIn.value = true;
      return;
    }

    if (!("IntersectionObserver" in window)) {
      isIn.value = true;
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Re-trigger animation: remove class, force reflow, add again
          isIn.value = false;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              isIn.value = true;
            });
          });
        } else {
          // Reset when scrolled away so next enter can play again
          isIn.value = false;
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);

    onUnmounted(() => io.disconnect());
  });
});
</script>

<style scoped>
/* No transition during enter */
.festivo-btn-enter {
  opacity: 0;
  transform: translateX(-50vw) rotate(-8deg);
  transition: none;
}

.festivo-btn-enter.is-in {
  animation: festivoBtnIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Hover lift only after animation done */
.festivo-btn-ready {
  transition: transform 0.2s ease;
}
.festivo-btn-ready:hover {
  transform: translateY(-2px);
}

@keyframes festivoBtnIn {
  0% {
    opacity: 0;
    transform: translateX(-50vw) rotate(-8deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotate(0);
  }
}

@media (max-width: 768px) {
  .festivo-btn-enter {
    transform: translateX(-70vw) rotate(-6deg);
  }

  .festivo-btn-enter.is-in {
    animation-duration: 1.35s;
  }

  @keyframes festivoBtnIn {
    0% {
      opacity: 0;
      transform: translateX(-70vw) rotate(-6deg);
    }
    75% {
      opacity: 1;
      transform: translateX(6px) rotate(1deg);
    }
    100% {
      opacity: 1;
      transform: translateX(0) rotate(0);
    }
  }
}
</style>
