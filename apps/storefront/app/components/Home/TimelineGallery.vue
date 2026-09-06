<template>
  <section
    ref="sectionRef"
    class="w-full bg-navy text-white py-20 relative overflow-hidden bg-[url('/Images/LV.webp')] bg-no-repeat bg-[position:50%] bg-cover"
  >
    <!-- Timeline Header -->
    <div class="text-center px-5 sm:pb-5 relative z-[2] sm:mb-10">
      <h2
        v-fade
        class="text-center font-black text-white tracking-wide sm:tracking-wider uppercase text-[1.05rem] sm:text-3xl lg:text-4xl leading-tight"
      >
        Our Wonderful <span class="text-brand-orange">HOLIDAY</span> Stories
      </h2>
      <p
        v-fade
        class="text-center text-white font-bold tracking-[0.4px] text-[0.72rem] sm:text-[1.15rem] leading-tight mt-2 mb-1 max-w-[80%] mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
      >
        Journey through our favorite seasonal moments and cherished memories
        captured over the years.
      </p>
    </div>

    <!-- Horizontal Scroll Track with Mouse Drag & Touch Support -->
    <div
      ref="trackRef"
      class="flex items-center gap-[60px] overflow-x-auto py-5 px-[80px] select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      :class="{
        'cursor-grabbing !scroll-auto': isTrackDragging,
        'cursor-grab': !isTrackDragging,
      }"
      @scroll="onTrackScroll"
      @mousedown="startTrackDrag"
      @mouseleave="stopTrackDrag"
      @mouseup="stopTrackDrag"
      @mousemove="onTrackDrag"
      @touchstart="startTrackDrag"
      @touchend="stopTrackDrag"
      @touchmove="onTrackDrag"
    >
      <template v-for="(item, index) in timelineItems" :key="item.id || index">
        <!-- Timeline Card -->
        <div class="flex items-center gap-6 shrink-0">
          <!-- Image Left Layout -->
          <template v-if="item.imagePosition === 'left'">
            <div
              v-if="item.image"
              class="shrink-0 w-full relative overflow-hidden cursor-pointer aspect-[16/10] rounded-2xl bg-[#1C2D5B] outline outline-2 outline-[rgba(255,122,0,0.2)] -outline-offset-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:outline-brand-orange hover:outline-offset-4 hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:scale-[1.02] hover:brightness-[1.05]"
              @click="openLightbox(item.image)"
            >
              <NuxtImg
                :src="item.image"
                :alt="
                  item.description
                    ? `${item.year || ''} ${item.description}`.trim()
                    : item.year
                      ? `Holiday lighting ${item.year}`
                      : 'Festive Express holiday lighting'
                "
                format="webp"
                quality="85"
                width="400"
                height="280"
                fit="cover"
                loading="lazy"
                draggable="false"
                class="w-full h-[280px] max-w-[400px] max-md:h-[200px] max-md:max-w-[280px] max-sm:h-[160px] max-sm:max-w-[220px] object-cover pointer-events-none block"
              />
            </div>
            <div v-if="item.year || item.description">
              <span
                v-if="item.year"
                class="text-[3.5rem] font-extrabold text-[#d18d45] leading-none block mb-3"
                >{{ item.year }}</span
              >
              <p
                v-if="item.description"
                class="text-[0.92rem] leading-relaxed text-[#cfd8e8]"
              >
                {{ item.description }}
              </p>
            </div>
          </template>

          <!-- Image Right Layout -->
          <template v-else>
            <div
              v-if="item.image"
              class="gallery-shine shrink-0 w-full relative overflow-hidden cursor-pointer aspect-[16/10] rounded-2xl bg-[#1C2D5B] outline outline-2 outline-[rgba(255,122,0,0.2)] -outline-offset-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:outline-brand-orange hover:outline-offset-4 hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:scale-[1.02] hover:brightness-[1.05]"
              @click="openLightbox(item.image)"
            >
              <NuxtImg
                :src="item.image"
                :alt="item.year || 'Gallery Image'"
                format="webp"
                quality="85"
                width="400"
                height="280"
                fit="cover"
                loading="lazy"
                draggable="false"
                class="w-full h-[280px] max-w-[400px] max-md:h-[200px] max-md:max-w-[280px] max-sm:h-[160px] max-sm:max-w-[220px] object-cover pointer-events-none block"
              />
            </div>
          </template>
        </div>

        <!-- Optional Centerpiece/Divider between cards -->
        <div v-if="item.dividerImage">
          <NuxtImg
            :src="item.dividerImage"
            alt=""
            format="webp"
            quality="80"
            width="100"
            height="320"
            fit="contain"
            loading="lazy"
            draggable="false"
            class="h-[320px] shrink-0 pointer-events-none"
          />
        </div>
      </template>
    </div>

    <!-- Bottom Ornament Navigation Bar -->
    <div
      ref="navBarRef"
      class="relative w-[85%] max-w-[1100px] h-[60px] mx-auto mt-[20px] flex items-center"
    >
      <div
        class="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#ff7a00] via-[#ff9e43] to-[#ff7a00] -translate-y-1/2 rounded-[2px]"
      ></div>

      <!-- Draggable Spinner Indicator -->
      <div
        class="absolute top-1/2 w-[70px] h-[70px] -mt-[35px] -translate-x-1/2 select-none touch-none z-[5] transition-none will-change-[left]"
        :class="{
          'cursor-grabbing': isSpinnerDragging,
          'cursor-grab': !isSpinnerDragging,
        }"
        :style="{ left: scrollProgress + '%' }"
        @mousedown="startSpinnerDrag"
        @touchstart="startSpinnerDrag"
      >
        <img
          :src="currentSpinnerImage"
          alt=""
          draggable="false"
          class="w-full h-full object-contain pointer-events-none"
          :class="{ '-scale-x-100': isFlipped }"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";

const sectionRef = ref(null);
const isSectionVisible = ref(false);
let intersectionObserver = null;

const currentSpinnerImage = ref("/Images/Festivo/timeline/open.png");
const isFlipped = ref(false);
let blinkTimeout = null;
let dragAnimationInterval = null;
let dragAnimationFrame = 1;
let isDragging = ref(false);
let lastDragX = 0;
let currentDragDirection = 1;
let winkTimeout = null;
let isFirstFrame = ref(true);
let isDragRunning = ref(false);
let lastScrollLeft = 0;

const isGesturing = ref(false);

const timelineItems = ref([]);
const loadingGallery = ref(true);

const { data, pending, error } = useFetch("/api/gallery");

const processGalleryData = (items) => {
  timelineItems.value = (items || []).map((row) => ({
    id: row.id,
    year: row.year || "",
    description: row.description || "",
    image: row.image_url,
    imagePosition: row.image_position || "right",
    dividerImage: row.divider_image_url || null,
  }));
};

// Watch for data changes
watch(
  data,
  (newData) => {
    if (newData?.success && newData.data) {
      processGalleryData(newData.data);
    }
    loadingGallery.value = false;
  },
  { immediate: true },
);

// If error
watch(error, (err) => {
  if (err) {
    console.error("Failed to load gallery:", err);
    loadingGallery.value = false;
    timelineItems.value = [];
  }
});

const preloadSpinnerImages = async () => {
  const imageUrls = [];
  for (let i = 1; i <= 9; i++) {
    imageUrls.push(`/Images/Festivo/timeline/${i}.png`);
  }
  imageUrls.push("/Images/Festivo/timeline/open.png");
  imageUrls.push("/Images/Festivo/timeline/close.png");
  imageUrls.push("/Images/Festivo/timeline/wink.png");

  for (const src of imageUrls) {
    await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });
  }
};

const trackRef = ref(null);
const navBarRef = ref(null);
const scrollProgress = ref(0);
const isTrackDragging = ref(false);
const isSpinnerDragging = ref(false);

let trackStartX = 0;
let trackScrollLeft = 0;
let animationFrameId = null;

const blinkPattern = [
  { state: "close", duration: 500 },
  { state: "open", duration: 500 },
  { state: "close", duration: 200 },
  { state: "open", duration: 200 },
  { state: "open", duration: 2000 },
];

let currentBlinkStep = 0;

const runBlinkStep = () => {
  if (isSpinnerDragging.value || isDragging.value || isDragRunning.value) {
    blinkTimeout = setTimeout(runBlinkStep, 100);
    return;
  }

  const step = blinkPattern[currentBlinkStep];
  currentSpinnerImage.value =
    step.state === "open"
      ? "/Images/Festivo/timeline/open.png"
      : "/Images/Festivo/timeline/close.png";

  currentBlinkStep = (currentBlinkStep + 1) % blinkPattern.length;

  blinkTimeout = setTimeout(runBlinkStep, step.duration);
};

const startBlinking = () => {
  stopBlinking();
  currentBlinkStep = 0;
  currentSpinnerImage.value = "/Images/Festivo/timeline/open.png";
  blinkTimeout = setTimeout(runBlinkStep, 100);
};

const stopBlinking = () => {
  if (blinkTimeout) {
    clearTimeout(blinkTimeout);
    blinkTimeout = null;
  }
};

const showWinkAndStartBlinking = () => {
  if (winkTimeout) {
    clearTimeout(winkTimeout);
    winkTimeout = null;
  }

  if (dragAnimationInterval) {
    clearInterval(dragAnimationInterval);
    dragAnimationInterval = null;
  }
  isDragging.value = false;
  isDragRunning.value = false;
  isFirstFrame.value = true;
  isFlipped.value = false;

  currentSpinnerImage.value = "/Images/Festivo/timeline/wink.png";

  winkTimeout = setTimeout(() => {
    isFlipped.value = false;
    startBlinking();
    winkTimeout = null;
  }, 800);
};

const startDragAnimation = (direction) => {
  stopDragAnimation();
  dragAnimationFrame = 1;
  currentDragDirection = direction;
  isDragging.value = true;
  isDragRunning.value = true;
  isFirstFrame.value = true;

  isFlipped.value = direction === -1;
  currentSpinnerImage.value = `/Images/Festivo/timeline/1.png`;

  dragAnimationInterval = setInterval(() => {
    let imagePath;

    if (isFirstFrame.value) {
      isFirstFrame.value = false;
      return;
    } else {
      const frameNumber = dragAnimationFrame + 1;
      imagePath = `/Images/Festivo/timeline/${frameNumber}.png`;
      currentSpinnerImage.value = imagePath;

      dragAnimationFrame++;
      if (dragAnimationFrame > 8) {
        dragAnimationFrame = 1;
      }
    }
  }, 80);
};

const stopDragAnimation = () => {
  if (dragAnimationInterval) {
    clearInterval(dragAnimationInterval);
    dragAnimationInterval = null;
  }
  isDragging.value = false;
  isDragRunning.value = false;
  isFirstFrame.value = true;
  isFlipped.value = false;
  showWinkAndStartBlinking();
};

// Setup Intersection Observer
onMounted(() => {
  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isSectionVisible.value = true;
            if (intersectionObserver) {
              intersectionObserver.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (sectionRef.value) {
      intersectionObserver.observe(sectionRef.value);
    }
  } else {
    isSectionVisible.value = true;
  }

  window.addEventListener("mousemove", onSpinnerDrag);
  window.addEventListener("mouseup", stopSpinnerDrag);
  window.addEventListener("touchmove", onSpinnerDrag);
  window.addEventListener("touchend", stopSpinnerDrag);

  window.addEventListener("keydown", handleKeyDown);

  startBlinking();

  nextTick(() => {
    syncSpinnerWithTrack();
    if (trackRef.value) {
      lastScrollLeft = trackRef.value.scrollLeft;
    }
  });
});

onUnmounted(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  stopBlinking();

  if (winkTimeout) {
    clearTimeout(winkTimeout);
    winkTimeout = null;
  }

  stopDragAnimation();

  window.removeEventListener("mousemove", onSpinnerDrag);
  window.removeEventListener("mouseup", stopSpinnerDrag);
  window.removeEventListener("touchmove", onSpinnerDrag);
  window.removeEventListener("touchend", stopSpinnerDrag);

  window.removeEventListener("keydown", handleKeyDown);
});

const syncSpinnerWithTrack = () => {
  if (!trackRef.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = trackRef.value;
  const maxScroll = scrollWidth - clientWidth;
  if (maxScroll > 0) {
    scrollProgress.value = (scrollLeft / maxScroll) * 100;
  }
};

const onTrackScroll = () => {
  if (!trackRef.value || isSpinnerDragging.value) return;
  if (isTrackDragging.value) return;

  const currentScrollLeft = trackRef.value.scrollLeft;
  if (currentScrollLeft > lastScrollLeft) {
    isFlipped.value = false;
    currentDragDirection = 1;
  } else if (currentScrollLeft < lastScrollLeft) {
    isFlipped.value = true;
    currentDragDirection = -1;
  }
  lastScrollLeft = currentScrollLeft;

  syncSpinnerWithTrack();
};

/* --- TRACK DRAGGING LOGIC --- */
const startTrackDrag = (e) => {
  if (!trackRef.value) return;
  isTrackDragging.value = true;
  const pageX = e.touches ? e.touches[0].pageX : e.pageX;
  trackStartX = pageX - trackRef.value.offsetLeft;
  trackScrollLeft = trackRef.value.scrollLeft;
  lastScrollLeft = trackRef.value.scrollLeft;
  stopBlinking();
  startDragAnimation(1);
};

const stopTrackDrag = () => {
  isTrackDragging.value = false;
  stopDragAnimation();
};

const onTrackDrag = (e) => {
  if (!isTrackDragging.value || !trackRef.value) return;
  e.preventDefault();
  const pageX = e.touches ? e.touches[0].pageX : e.pageX;
  const x = pageX - trackRef.value.offsetLeft;
  const walk = (x - trackStartX) * 1.8;
  trackRef.value.scrollLeft = trackScrollLeft - walk;

  const maxScroll = trackRef.value.scrollWidth - trackRef.value.clientWidth;
  if (maxScroll > 0) {
    scrollProgress.value = (trackRef.value.scrollLeft / maxScroll) * 100;
  }

  const currentScrollLeft = trackRef.value.scrollLeft;
  if (currentScrollLeft > lastScrollLeft) {
    isFlipped.value = false;
    currentDragDirection = 1;
  } else if (currentScrollLeft < lastScrollLeft) {
    isFlipped.value = true;
    currentDragDirection = -1;
  }
  lastScrollLeft = currentScrollLeft;
};

/* --- SPINNER DRAGGING LOGIC --- */
const startSpinnerDrag = (e) => {
  isSpinnerDragging.value = true;
  lastDragX = e.touches ? e.touches[0].clientX : e.clientX;
  stopBlinking();
  startDragAnimation(1);
  onSpinnerDrag(e);
};

const stopSpinnerDrag = () => {
  isSpinnerDragging.value = false;
  stopDragAnimation();
};

const onSpinnerDrag = (e) => {
  if (!isSpinnerDragging.value || !navBarRef.value || !trackRef.value) return;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(() => {
    const rect = navBarRef.value.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let offsetX = clientX - rect.left;

    let percent = (offsetX / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));

    scrollProgress.value = percent;

    const maxScroll = trackRef.value.scrollWidth - trackRef.value.clientWidth;
    trackRef.value.scrollLeft = (percent / 100) * maxScroll;

    if (clientX > lastDragX) {
      isFlipped.value = false;
      currentDragDirection = 1;
    } else if (clientX < lastDragX) {
      isFlipped.value = true;
      currentDragDirection = -1;
    }
    lastDragX = clientX;
    if (trackRef.value) {
      lastScrollLeft = trackRef.value.scrollLeft;
    }
  });
};

const activeImage = ref(null);
const zoom = ref(1);
const panX = ref(0);
const panY = ref(0);

const lightboxViewport = ref(null);

// pointer drag
const isPanning = ref(false);
const lastX = ref(0);
const lastY = ref(0);

// pinch
const pinchStartDist = ref(0);
const pinchStartZoom = ref(1);

const imageStyle = computed(() => ({
  transform: `translate3d(${panX.value}px, ${panY.value}px, 0) scale(${zoom.value})`,
  transformOrigin: "center center",
  transition: isGesturing.value ? "none" : "transform 0.15s ease",
  willChange: "transform",
}));

let raf = 0;

const clampZoom = (z) => Math.min(3.5, Math.max(1, Math.round(z * 100) / 100));

const openLightbox = (src) => {
  activeImage.value = src;
  resetZoom();
};

const closeLightbox = () => {
  activeImage.value = null;
  resetZoom();
};

const zoomIn = () => {
  zoom.value = clampZoom(zoom.value + 0.35);
};

const zoomOut = () => {
  zoom.value = clampZoom(zoom.value - 0.35);
  if (zoom.value === 1) {
    panX.value = 0;
    panY.value = 0;
  }
};

const resetZoom = () => {
  zoom.value = 1;
  panX.value = 0;
  panY.value = 0;
};

const onWheel = (e) => {
  if (e.deltaY < 0) zoomIn();
  else zoomOut();
  if (zoom.value === 1) {
    panX.value = 0;
    panY.value = 0;
  }
};

const getDistance = (t1, t2) => {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.hypot(dx, dy);
};

const onPointerDown = (e) => {
  if (zoom.value <= 1) return;

  isPanning.value = true;
  lastX.value = e.clientX;
  lastY.value = e.clientY;
  e.currentTarget?.setPointerCapture?.(e.pointerId);
};

const onPointerMove = (e) => {
  if (!isPanning.value || zoom.value <= 1) return;
  const dx = e.clientX - lastX.value;
  const dy = e.clientY - lastY.value;
  panX.value += dx;
  panY.value += dy;
  lastX.value = e.clientX;
  lastY.value = e.clientY;
};

const onPointerUp = (e) => {
  isPanning.value = false;
  try {
    e.currentTarget?.releasePointerCapture?.(e.pointerId);
  } catch (_) {}
};

// Native touch for reliable pinch on iOS
const onTouchStart = (e) => {
  if (e.touches.length === 2) {
    pinchStartDist.value = getDistance(e.touches[0], e.touches[1]);
    pinchStartZoom.value = zoom.value;
    isPanning.value = false;
  } else if (e.touches.length === 1 && zoom.value > 1) {
    isPanning.value = true;
    lastX.value = e.touches[0].clientX;
    lastY.value = e.touches[0].clientY;
  }
};

const onTouchMove = (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dist = getDistance(e.touches[0], e.touches[1]);
    if (pinchStartDist.value > 0) {
      const ratio = dist / pinchStartDist.value;
      zoom.value = clampZoom(pinchStartZoom.value * ratio);
      if (zoom.value === 1) {
        panX.value = 0;
        panY.value = 0;
      }
    }
  } else if (e.touches.length === 1 && isPanning.value && zoom.value > 1) {
    e.preventDefault();
    const t = e.touches[0];
    panX.value += t.clientX - lastX.value;
    panY.value += t.clientY - lastY.value;
    lastX.value = t.clientX;
    lastY.value = t.clientY;
  }
};

const onTouchEnd = () => {
  if (!lightboxViewport.value) return;
  pinchStartDist.value = 0;
  isPanning.value = false;
};

const handleKeyDown = (e) => {
  if (e.key === "Escape" && activeImage.value) {
    closeLightbox();
  }
};

watch(isSpinnerDragging, (newVal) => {
  if (newVal) {
    stopBlinking();
  }
});

onMounted(() => {
  preloadSpinnerImages();

  if (!import.meta.client) return;
  const onKey = (e) => {
    if (e.key === "Escape") closeLightbox();
  };
  window.addEventListener("keydown", onKey);
  onUnmounted(() => window.removeEventListener("keydown", onKey));
});
</script>

<style scoped>
.lb-btn {
  @apply min-w-[44px] min-h-[44px] px-3 rounded-lg bg-white/15 text-white text-lg hover:bg-white/25;
}

@keyframes slide-hand {
  0%,
  100% {
    transform: translateX(-25px);
  }
  50% {
    transform: translateX(25px);
  }
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.gallery-shine::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 60%
  );
  transform: translateX(-120%);
  pointer-events: none;
}

.gallery-shine:hover::after {
  animation: galleryShine 2s ease-out forwards;
}

@keyframes galleryShine {
  to {
    transform: translateX(120%);
  }
}
.lightbox-img {
  touch-action: none;
  user-select: none;
  -webkit-user-drag: none;
  backface-visibility: hidden;
}
</style>
