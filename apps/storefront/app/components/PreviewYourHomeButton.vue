<template>
  <NuxtLink
    to="/preview-your-home"
    class="group relative z-10 block w-fit transition-transform duration-200 hover:-translate-y-0.5 mx-auto"
  >
    <div class="relative w-[320px] max-lg:w-[180px] h-[320px] max-lg:h-[180px]">
      <NuxtImg
        :src="frameSrc"
        alt="Preview Your Home"
        class="absolute inset-0 z-0 h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition-opacity duration-300"
        fit="contain"
        loading="eager"
        draggable="false"
        :img-attrs="{
          style:
            'display: block; width: 100%; height: 100%; object-fit: contain;',
        }"
      />
    </div>
  </NuxtLink>
</template>

<script setup>
const FRAME_A = "/Images/Festivo/PreviewYourHomeButton.png";
const FRAME_B = "/Images/Festivo/PreviewYourHomeButton2.png";

const showB = ref(false);
const frameSrc = computed(() => (showB.value ? FRAME_B : FRAME_A));

let timer;
onMounted(() => {
  timer = setInterval(() => {
    showB.value = !showB.value;
  }, 500);
});
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
