<template>
  <section
    ref="sectionRef"
    class="w-full bg-[#0c1a35] text-white py-20 relative overflow-hidden bg-[url('/Images/LV.png')] bg-no-repeat bg-[position:50%] bg-cover"
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
              class="shrink-0 w-full relative overflow-hidden cursor-pointer aspect-[16/10] rounded-2xl bg-[#0c1a35] outline outline-2 outline-[rgba(255,122,0,0.2)] -outline-offset-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:outline-brand-orange hover:outline-offset-4 hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:scale-[1.02] hover:brightness-[1.05]"
              @click="openLightbox(item.image)"
            >
              <img
                :src="item.image"
                :alt="item.year || 'Gallery Image'"
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
            <!-- <div v-if="item.year || item.description">
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
            </div> -->
            <div
              v-if="item.image"
              class="gallery-shine shrink-0 w-full relative overflow-hidden cursor-pointer aspect-[16/10] rounded-2xl bg-[#0c1a35] outline outline-2 outline-[rgba(255,122,0,0.2)] -outline-offset-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:outline-brand-orange hover:outline-offset-4 hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:scale-[1.02] hover:brightness-[1.05]"
              @click="openLightbox(item.image)"
            >
              <img
                :src="item.image"
                :alt="item.year || 'Gallery Image'"
                draggable="false"
                class="w-full h-[280px] max-w-[400px] max-md:h-[200px] max-md:max-w-[280px] max-sm:h-[160px] max-sm:max-w-[220px] object-cover pointer-events-none block"
              />
            </div>
          </template>
        </div>

        <!-- Lightbox Modal -->
        <Transition name="fade">
          <div
            v-if="activeImage"
            class="fixed inset-0 w-screen h-screen bg-black/85 flex items-center justify-center z-[9999] p-5"
            @click.self="closeLightbox"
          >
            <button
              class="absolute top-5 right-[25px] bg-transparent border-none text-white text-[2.5rem] leading-none cursor-pointer z-[10000] transition-transform duration-200 hover:text-brand-orange hover:scale-[1.15]"
              @click="closeLightbox"
              aria-label="Close modal"
            >
              &times;
            </button>

            <div
              class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-sm"
            >
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg bg-white/15 text-white text-sm hover:bg-white/25"
                @click.stop="zoomOut"
              >
                −
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg bg-white/15 text-white text-sm hover:bg-white/25"
                @click.stop="zoomIn"
              >
                +
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg bg-white/15 text-white text-sm hover:bg-white/25"
                @click.stop="resetZoom"
              >
                Reset
              </button>
            </div>

            <div
              class="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              @wheel.prevent="onWheel"
            >
              <img
                :src="activeImage"
                alt="Enlarged view"
                class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-200"
                :style="{
                  transform: `scale(${zoom})`,
                  cursor: zoom > 1 ? 'zoom-out' : 'zoom-in',
                  width: 'min(90vw, 1000px)',
                }"
                @click.stop="toggleZoom"
              />
            </div>
          </div>
        </Transition>

        <!-- Optional Centerpiece/Divider between cards -->
        <div v-if="item.dividerImage">
          <img
            :src="item.dividerImage"
            alt="Timeline Divider"
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
          alt="Timeline Ornament"
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

const config = useRuntimeConfig();
const supabase = useSupabaseClient();

const timelineItems = ref([]);
const loadingGallery = ref(true);

const fetchGallery = async () => {
  loadingGallery.value = true;
  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    timelineItems.value = (data || []).map((row) => ({
      id: row.id,
      year: row.year || "",
      description: row.description || "",
      image: getImageUrl(row.image_url),
      imagePosition: row.image_position || "right",
      dividerImage: row.divider_image_url
        ? getImageUrl(row.divider_image_url)
        : null,
    }));
  } catch (e) {
    console.error(e);
    timelineItems.value = [];
  } finally {
    loadingGallery.value = false;
  }
};

const getImageUrl = (url) => {
  if (!url) return "/Images/placeholder.png";
  if (url.startsWith("http") || url.startsWith("/Images/")) return url;
  const path = String(url).replace(/^\/+/, "");
  const supabaseUrl =
    config.public.supabaseUrl || config.public.supabase?.url || "";
  const bucket = config.public.storageBucket || "Gallery";
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

// const timelineItems = ref([
//   {
//     id: 7,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-7.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 13,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-13.webp",
//     imagePosition: "left",
//     dividerImage: null,
//   },
//   {
//     id: 1,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-1.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 19,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-19.webp",
//     imagePosition: "left",
//     dividerImage: null,
//   },
//   {
//     id: 17,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-17.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 14,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-14.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 10,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-10.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 9,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-9.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 4,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-4.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 15,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-15.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 20,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-20.webp",
//     imagePosition: "left",
//     dividerImage: null,
//   },
//   {
//     id: 8,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-8.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 18,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-18.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 2,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-2.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 16,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-16.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 11,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-11.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 3,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-3.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 12,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-12.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 5,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-5.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
//   {
//     id: 6,
//     year: "",
//     description: "",
//     image: "/Images/Gallery/Festive-Images-6.webp",
//     imagePosition: "right",
//     dividerImage: null,
//   },
// ]);

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
      const frameNumber = dragAnimationFrame + 1; // 2-9
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

const openLightbox = (imageSrc) => {
  activeImage.value = imageSrc;
  zoom.value = 1;
};

const closeLightbox = () => {
  activeImage.value = null;
  zoom.value = 1;
};

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.25, 4);
};

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.25, 1);
};

const resetZoom = () => {
  zoom.value = 1;
};

const toggleZoom = () => {
  zoom.value = zoom.value > 1 ? 1 : 2;
};

const onWheel = (e) => {
  if (e.deltaY < 0) zoomIn();
  else zoomOut();
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

// ESC to close
onMounted(() => {
  fetchGallery();

  if (!import.meta.client) return;
  const onKey = (e) => {
    if (e.key === "Escape") closeLightbox();
  };
  window.addEventListener("keydown", onKey);
  onUnmounted(() => window.removeEventListener("keydown", onKey));
});
</script>

<style scoped>
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
</style>
