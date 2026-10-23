<template>
  <component
    :is="hasLink ? NuxtLink : 'div'"
    v-bind="hasLink ? { to: link } : {}"
    class="group relative z-10 block w-fit transition-transform duration-200 mx-auto"
    :class="
      hasLink
        ? 'cursor-pointer hover:-translate-y-0.5'
        : 'cursor-default pointer-events-none'
    "
  >
    <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
      <NuxtImg
        :src="imageA"
        :alt="alt"
        class="absolute inset-0 z-0 h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
        :class="{ 'opacity-0': showB }"
        fit="contain"
        loading="eager"
        draggable="false"
      />
      <NuxtImg
        :src="imageB"
        :alt="alt"
        class="absolute inset-0 z-0 h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
        :class="{ 'opacity-0': !showB }"
        fit="contain"
        loading="eager"
        draggable="false"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";

const props = withDefaults(
  defineProps<{
    hasLink?: boolean;
    link?: string;
    interval?: number;
    size?: number;
    alt?: string;
    imageA?: string;
    imageB?: string;
  }>(),
  {
    hasLink: true,
    link: "/preview-your-home",
    interval: 500,
    size: 320,
    alt: "Preview Your Home",
    imageA: "/Images/Festivo/PreviewYourHomeButton.webp",
    imageB: "/Images/Festivo/PreviewYourHomeButton2.webp",
  },
);

const showB = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    showB.value = !showB.value;
  }, props.interval);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
