<template>
  <svg
    width="120"
    height="122"
    viewBox="0 0 120 122"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
  >
    <!-- Position 1 - Bottom Left -->
    <path
      d="M35.6279 80.1997L29.8984 85.7792L32.3861 88.3337L38.1155 82.7542L35.6279 80.1997Z"
      :fill="getFill(0)"
      :opacity="getOpacity(0)"
      :style="{
        filter: getFilter(0),
        transition: 'all 0.15s ease',
      }"
    />

    <!-- Position 2 - Left -->
    <path
      d="M27.8008 57H19.8008V61H27.8008V57Z"
      :fill="getFill(1)"
      :opacity="getOpacity(1)"
      :style="{
        filter: getFilter(1),
        transition: 'all 0.15s ease',
      }"
    />

    <!-- Position 3 - Top Left -->
    <path
      d="M32.3861 29.9687L29.8984 32.5232L35.6279 38.1027L38.1155 35.5482L32.3861 29.9687Z"
      :fill="getFill(2)"
      :opacity="getOpacity(2)"
      :style="{
        filter: getFilter(2),
        transition: 'all 0.15s ease',
      }"
    />

    <!-- Position 4 - Top Center -->
    <path
      d="M61.8008 20H57.8008V28H61.8008V20Z"
      :fill="getFill(3)"
      :opacity="getOpacity(3)"
      :style="{
        filter: getFilter(3),
        transition: 'all 0.15s ease',
      }"
    />

    <!-- Position 5 - Top Right -->
    <path
      d="M87.2139 29.9665L81.4844 35.546L83.972 38.1005L89.7015 32.5211L87.2139 29.9665Z"
      :fill="getFill(4)"
      :opacity="getOpacity(4)"
      :style="{
        filter: getFilter(4),
        transition: 'all 0.15s ease',
      }"
    />

    <!-- Position 6 - Right -->
    <path
      d="M99.8008 57H91.8008V61H99.8008V57Z"
      :fill="getFill(5)"
      :opacity="getOpacity(5)"
      :style="{
        filter: getFilter(5),
        transition: 'all 0.15s ease',
      }"
    />

    <!-- Position 7 - Bottom Right -->
    <path
      d="M83.9739 80.2072L81.4863 82.7617L87.2158 88.3412L89.7034 85.7867L83.9739 80.2072Z"
      :fill="getFill(6)"
      :opacity="getOpacity(6)"
      :style="{
        filter: getFilter(6),
        transition: 'all 0.15s ease',
      }"
    />

    <!-- Center shape -->
    <path
      d="M81.2706 72.9011C83.516 69.1418 84.8008 64.7522 84.8008 60.0647C84.8008 46.2169 73.6057 35 59.7996 35C45.9934 35 34.8008 46.2169 34.8008 60.0647C34.8008 65.0551 36.2611 69.7036 38.782 73.6144C39.0648 74.0541 39.3598 74.484 39.6694 74.9041C39.6694 74.9041 39.7108 74.9457 39.7669 75.0409C39.7693 75.0458 39.7742 75.0532 39.7791 75.058C39.9376 75.2754 40.1106 75.4928 40.2837 75.7078C40.3544 75.7933 40.4276 75.8935 40.4983 75.9936C40.4983 75.996 40.5032 75.9985 40.5056 76.0034C40.6592 76.1939 46.3616 83.2778 48.4533 92.5772C48.6606 93.5005 49.0433 94.3506 49.5602 95.0883C50.8035 96.8641 52.8319 98 55.1065 98H64.517C66.7916 98 68.82 96.8666 70.0633 95.0883C70.5802 94.3481 70.963 93.4981 71.1702 92.5723C73.1791 83.61 79.2886 75.7396 79.8712 74.9994L79.8761 74.9945C79.8761 74.9945 79.8761 74.9945 79.8786 74.9921C79.8859 74.9848 79.8907 74.9774 79.8956 74.9725C79.8932 74.9774 79.8907 74.9799 79.8859 74.9823C79.8859 74.9823 79.8883 74.9774 79.8907 74.975C80.3832 74.3081 80.8464 73.6144 81.2731 72.8987M53.3877 47.8487C48.7337 48.6059 45.7618 52.0062 45.9739 56.7988C46.1811 61.4546 38.9697 61.4277 38.7649 56.7988C38.4236 49.0896 43.8017 42.1303 51.4691 40.8845C56.0134 40.1468 57.9516 47.1061 53.3853 47.8487"
      :fill="centerColor"
      :opacity="centerOpacity"
      :style="{
        filter: centerGlow,
        transition: 'all 0.15s ease',
      }"
    />

    <path
      d="M51.3419 41.0513C43.7835 42.2684 38.4795 49.0672 38.8159 56.5985C39.0178 61.1207 46.1268 61.1469 45.9225 56.5985C45.7134 51.9189 48.643 48.5947 53.2309 47.8573C57.7323 47.1318 55.8217 40.3307 51.3419 41.0537"
      fill="white"
      :opacity="centerOpacity"
      style="transition: all 0.15s ease"
    />

    <!-- Bottom shapes -->
    <path
      d="M67.4879 114H52.1161C51.852 114 51.7069 114.338 51.8687 114.572C52.3088 115.211 52.8297 115.744 53.4078 116.148C54.1904 116.694 55.0801 117 56.0197 117H63.5843C64.5239 117 65.4136 116.694 66.1962 116.148C66.7742 115.744 67.2952 115.211 67.7329 114.572C67.8946 114.338 67.7495 114 67.4855 114"
      fill="#1B305B"
    />

    <path
      d="M70.0043 95H49.4126C48.5227 95 47.8008 95.7437 47.8008 96.6578V97.3422C47.8008 98.1476 48.3572 98.8172 49.0984 98.9679C49.1991 98.9876 49.3047 99 49.4126 99H70.1913C70.2993 99 70.4048 98.9901 70.5056 98.9679C71.2443 98.8172 71.8008 98.1451 71.8008 97.3422V96.853C71.8008 95.8301 70.9949 95.0025 70.0043 95.0025"
      fill="#1B305B"
    />

    <path
      d="M71.0474 100.279C70.7778 100.104 70.4578 100 70.1101 100H49.494C49.1463 100 48.8263 100.101 48.5567 100.279C48.214 100.502 47.957 100.845 47.8537 101.248C47.8209 101.379 47.8008 101.518 47.8008 101.659V102.341C47.8008 102.986 48.1787 103.548 48.728 103.822C48.7935 103.854 48.8641 103.884 48.9372 103.909C49.111 103.97 49.2975 104 49.494 104H70.1101C70.3041 104 70.4931 103.968 70.6669 103.909C70.7375 103.886 70.8055 103.857 70.871 103.824C71.4228 103.55 71.8008 102.989 71.8008 102.341V101.659C71.8008 101.53 71.7857 101.402 71.7579 101.283C71.6597 100.868 71.4002 100.509 71.0474 100.279Z"
      fill="#1B305B"
    />

    <path
      d="M69.6535 105H49.9481C48.7616 105 47.8008 105.897 47.8008 106.999C47.8008 108.101 48.7643 109 49.9481 109H69.6535C70.8399 109 71.8008 108.103 71.8008 106.999C71.8008 105.894 70.8373 105 69.6535 105Z"
      fill="#1B305B"
    />

    <path
      d="M70.1973 110.282C69.9128 110.106 69.5522 110 69.1548 110H51.4492C51.0444 110 50.674 110.111 50.387 110.293C50.3306 110.328 50.2791 110.365 50.2301 110.406C49.9627 110.628 49.8008 110.921 49.8008 111.243V111.757C49.8008 112.444 50.5391 113 51.4492 113H68.9635C69.979 113 70.8008 112.377 70.8008 111.61V111.243C70.8008 110.921 70.6389 110.628 70.3715 110.406C70.3175 110.361 70.2587 110.319 70.1973 110.282Z"
      fill="#1B305B"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  animationSpeed?: number;
  animate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  animationSpeed: 200,
  animate: true,
});

const activeIndex = ref(-1);
let interval: ReturnType<typeof setInterval> | null = null;

const incrementActiveIndex = () => {
  activeIndex.value = activeIndex.value + 1;
  if (activeIndex.value > 7) {
    activeIndex.value = 0;
  }
};

// Start animation
const startAnimation = () => {
  if (!props.animate) {
    activeIndex.value = -1;
    return;
  }

  // Clear existing interval
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  // Reset and start
  activeIndex.value = 0;
  interval = setInterval(incrementActiveIndex, props.animationSpeed);
};

// Cleanup on unmount
onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
});

// Start animation on mount
onMounted(() => {
  startAnimation();
});

// Watch for prop changes
watch(
  () => props.animate,
  () => {
    startAnimation();
  },
);

watch(
  () => props.animationSpeed,
  () => {
    startAnimation();
  },
);

// Helper functions
const getFill = (index: number): string => {
  if (!props.animate) return "#F69322";
  return activeIndex.value >= index ? "#FFB84D" : "#F69322";
};

const getOpacity = (index: number): number => {
  if (!props.animate) return 1;
  return activeIndex.value >= index ? 1 : 0.4;
};

const getFilter = (index: number): string => {
  if (activeIndex.value >= index) {
    return "drop-shadow(0 0 12px #F69320) drop-shadow(0 0 24px #F69320)";
  }
  return "none";
};

const centerColor = computed(() => "#F69322");

const centerOpacity = computed(() => {
  if (!props.animate) return 1;
  const progress = activeIndex.value / 7;
  return 0.3 + progress * 0.7;
});

const centerGlow = computed(() => {
  if (!props.animate) return "drop-shadow(0 0 8px #F69320)";
  const progress = activeIndex.value / 7;
  const intensity = 8 + progress * 40;
  return `drop-shadow(0 0 ${intensity}px #F69320)`;
});
</script>
