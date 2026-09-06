<template>
  <NuxtLink
    to="/preview-your-home"
    class="group relative z-10 block w-fit transition-transform duration-200 hover:-translate-y-0.5 mx-auto"
  >
    <div
      class="relative w-[320px] max-lg:w-[180px] h-[320px] max-lg:h-[180px] animate-pulse-image"
    >
      <img
        :src="frameSrc"
        alt="Preview Your Home"
        class="absolute inset-0 z-0 h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
        loading="eager"
        draggable="false"
      />
    </div>
  </NuxtLink>
</template>

<script setup>
const FRAME_A = "/Images/Festivo/PreviewYourHomeButton.png";
const FRAME_B = "/Images/Festivo/PreviewYourHomeButton2.png";

const frameSrc = ref(FRAME_A);

onMounted(() => {
  let showB = false;
  setInterval(() => {
    showB = !showB;
    frameSrc.value = showB ? FRAME_B : FRAME_A;
  }, 500);
});
</script>

<style scoped>
.animate-pulse-image {
  animation: softPulse 2s ease-in-out infinite;
}

@keyframes softPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
