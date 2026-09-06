<template>
  <NuxtLink
    to="/preview-your-home"
    class="group relative z-10 block w-fit transition-transform duration-200 hover:-translate-y-0.5 mx-auto"
  >
    <div class="relative w-[320px] max-lg:w-[180px] h-[320px] max-lg:h-[180px]">
      <NuxtImg
        src="/Images/Festivo/PreviewYourHomeButton.png"
        alt="Preview Your Home"
        class="absolute inset-0 z-0 h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
        :class="{ 'opacity-0': showB }"
        fit="contain"
        loading="eager"
        draggable="false"
      />
      <NuxtImg
        src="/Images/Festivo/PreviewYourHomeButton2.png"
        alt="Preview Your Home"
        class="absolute inset-0 z-0 h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
        :class="{ 'opacity-0': !showB }"
        fit="contain"
        loading="eager"
        draggable="false"
      />
    </div>
  </NuxtLink>
</template>

<script setup>
const showB = ref(false);

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
