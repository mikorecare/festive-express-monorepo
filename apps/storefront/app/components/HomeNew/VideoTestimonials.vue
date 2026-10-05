<template>
  <section
    ref="sectionRef"
    class="relative w-full overflow-hidden"
    aria-labelledby="video-testimonials-heading"
  >
    <!-- Top white area (heading) -->
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-[url('/Images/LV.webp')] bg-no-repeat bg-center bg-cover"
      aria-hidden="true"
    ></div>
    <div class="relative pt-10 bg-transparent sm:pt-14 lg:pt-20">
      <div class="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div v-fade class="max-w-[720px]">
          <h2
            id="video-testimonials-heading"
            class="text-[1.75rem] sm:text-4xl lg:text-5xl font-extrabold leading-[1.1]"
          >
            <span class="block text-[#1C2D5B]">Video testimonials</span>
            <span
              class="block text-[#F49321] [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
            >
              Hear it from our neighbors
            </span>
          </h2>
          <p class="text-black text-sm sm:text-base mt-2 sm:mt-3 font-medium">
            Real homeowners on renting the magic and enjoying the season from
            the couch.
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom section -->
    <div class="relative" @mouseleave="resumeAuto">
      <!-- Banded background -->
      <div class="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div class="absolute inset-x-0 top-0 h-1/2 bg-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-[#1C2D5B]"></div>
        <div
          class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 sm:h-5 lg:h-6 bg-[#F49321]"
        ></div>
      </div>

      <div
        class="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-16"
      >
        <!-- ================================== -->
        <!-- MOBILE: vertical 3D filmstrip      -->
        <!-- Shows max 4 cards                  -->
        <!-- ================================== -->
        <div
          class="flex flex-col items-stretch justify-center gap-2 h-[600px] md:hidden"
        >
          <button
            v-for="(video, i) in videos"
            :key="`m-${i}`"
            type="button"
            class="relative w-full shrink-0 rounded-2xl overflow-hidden transition-all duration-500 ease-out focus:outline-none focus:ring-4 focus:ring-[#F49321]/60"
            :class="[
              activeIndex === i
                ? 'grayscale-0'
                : 'grayscale cursor-pointer hover:grayscale-0',
              isVisibleInMobile(i)
                ? 'opacity-100 mb-2'
                : 'opacity-0 pointer-events-none mb-0',
            ]"
            :style="{ height: mobileHeight(i) }"
            :aria-label="`Show video testimonial from ${video.name}`"
            @click="onCardClick(i)"
          >
            <img
              :src="video.thumbnail"
              :alt="`Video testimonial thumbnail — ${video.name}`"
              class="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />

            <div
              class="absolute inset-0 transition-colors"
              :class="activeIndex === i ? 'bg-[#F49321]/10' : 'bg-[#1C2D5B]/55'"
              aria-hidden="true"
            ></div>

            <div
              v-if="activeIndex === i"
              class="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div
                class="w-14 h-14 rounded-full bg-[#F49321]/80 backdrop-blur-md flex items-center justify-center ring-[3px] ring-white"
              >
                <i class="fa-solid fa-play text-[#1C2D5B] text-xl ml-1"></i>
              </div>
            </div>

            <template v-if="activeIndex === i">
              <div
                class="absolute bottom-0 left-0 right-0 p-4 text-left bg-[#1C2D5B]/60 backdrop-blur-sm border-t border-white/15 rounded-b-2xl"
              >
                <p
                  class="text-white font-bold text-sm tracking-wide uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                >
                  {{ video.name }}
                </p>
                <p
                  v-if="video.role"
                  class="text-white/85 text-xs mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
                >
                  {{ video.role }}
                </p>
              </div>
            </template>
            <template v-else>
              <div
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span
                  class="text-white font-bold text-xs tracking-[0.2em] uppercase"
                >
                  {{ video.name }}
                </span>
              </div>
            </template>
          </button>
        </div>

        <!-- ================================== -->
        <!-- DESKTOP: horizontal 3D filmstrip   -->
        <!-- ================================== -->
        <div
          ref="desktopStripRef"
          class="hidden md:flex flex-row items-center justify-center h-[520px] overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            v-for="(video, i) in videos"
            :key="`d-${i}`"
            type="button"
            class="relative shrink-0 snap-center rounded-2xl overflow-hidden transition-all duration-500 ease-out focus:outline-none focus:ring-4 focus:ring-[#F49321]/60"
            :class="[
              activeIndex === i
                ? 'grayscale-0'
                : 'grayscale cursor-pointer hover:grayscale-0',
              isVisibleInStrip(i)
                ? 'opacity-100 mx-1.5 lg:mx-2'
                : 'opacity-0 pointer-events-none mx-0',
            ]"
            :style="{ width: desktopWidth(i), height: desktopHeight(i) }"
            :aria-label="`Show video testimonial from ${video.name}`"
            @click="onCardClick(i)"
          >
            <img
              :src="video.thumbnail"
              :alt="`Video testimonial thumbnail — ${video.name}`"
              class="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />

            <div
              class="absolute inset-0 transition-colors"
              :class="activeIndex === i ? 'bg-[#F49321]/10' : 'bg-[#1C2D5B]/55'"
              aria-hidden="true"
            ></div>

            <div
              v-if="activeIndex === i"
              class="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div
                class="w-16 h-16 rounded-full bg-[#F49321]/80 backdrop-blur-md flex items-center justify-center ring-4 ring-white"
              >
                <i class="fa-solid fa-play text-[#1C2D5B] text-2xl ml-1"></i>
              </div>
            </div>

            <template v-if="activeIndex === i">
              <div
                class="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left bg-[#1C2D5B]/60 backdrop-blur-sm border-t border-white/15 rounded-b-2xl"
              >
                <p
                  class="text-white font-bold text-base tracking-wide uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                >
                  {{ video.name }}
                </p>
                <p
                  v-if="video.role"
                  class="text-white/85 text-sm mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
                >
                  {{ video.role }}
                </p>
              </div>
            </template>
            <template v-else>
              <div
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span
                  class="text-white font-bold text-sm font-raleway tracking-[0.2em] uppercase [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180"
                >
                  {{ video.name }}
                </span>
              </div>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="activeVideo"
          class="modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-[#1C2D5B]/95 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          :aria-label="`Playing video testimonial from ${activeVideo.name}`"
          @click.self="closeVideo"
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/90 hover:text-white text-2xl sm:text-3xl leading-none p-2 z-30 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Close video"
            @click="closeVideo"
          >
            <i class="fas fa-times"></i>
          </button>

          <div class="w-full max-w-4xl flex flex-col items-center gap-3">
            <!-- Video with arrows INSIDE the frame -->
            <div
              class="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-[#1C2D5B]"
            >
              <iframe
                :src="activeVideo.embedUrl"
                title="Video testimonial"
                class="absolute inset-0 w-full h-full"
                frameborder="0"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                  web-share;
                "
                allowfullscreen
                credentialless
              ></iframe>

              <!-- Prev -->
              <button
                type="button"
                class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/65 active:scale-95 text-white text-base sm:text-lg backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#F49321]/70"
                aria-label="Previous testimonial"
                @click="prevVideo"
              >
                <i class="fas fa-chevron-left"></i>
              </button>

              <!-- Next -->
              <button
                type="button"
                class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/65 active:scale-95 text-white text-base sm:text-lg backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#F49321]/70"
                aria-label="Next testimonial"
                @click="nextVideo"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <!-- Info + pager -->
            <div class="w-full text-center px-1">
              <p
                class="text-white font-bold text-sm sm:text-base tracking-wide uppercase truncate"
              >
                {{ activeVideo.name }}
              </p>
              <p
                v-if="activeVideo.role"
                class="text-white/70 text-xs mt-0.5 truncate"
              >
                {{ activeVideo.role }}
              </p>

              <!-- Pager -->
              <div
                class="flex items-center justify-center gap-1.5 mt-2"
                role="tablist"
                aria-label="Testimonial pagination"
              >
                <button
                  v-for="(v, i) in videos"
                  :key="`pager-${i}`"
                  type="button"
                  role="tab"
                  :aria-selected="i === activeVideoIndex"
                  :aria-label="`Go to testimonial ${i + 1} of ${videos.length}`"
                  class="transition-all duration-300 ease-out rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F49321]/60"
                  :class="
                    i === activeVideoIndex
                      ? 'w-5 h-1.5 bg-[#F49321]'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                  "
                  @click="goToVideo(i)"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
interface VideoTestimonial {
  name: string;
  role?: string;
  youtubeUrl: string;
  thumbnail: string;
  embedUrl: string;
}

const videos: VideoTestimonial[] = [
  {
    name: "Matt Nemeth",
    role: "1842 Baywood Drive, Sarasota, FL 34231",
    youtubeUrl: "https://youtu.be/TfgCQ-PUX9g",
    thumbnail: "https://img.youtube.com/vi/TfgCQ-PUX9g/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/TfgCQ-PUX9g?autoplay=1",
  },
  {
    name: "Wendi Morisson",
    role: "2715 Coconut Bay Lane, Sarasota, FL 34237",
    youtubeUrl: "https://youtu.be/lkSDylU5ctk",
    thumbnail: "https://img.youtube.com/vi/lkSDylU5ctk/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/lkSDylU5ctk?autoplay=1",
  },
  {
    name: "Grant Gutierrez",
    role: "4261 Hanging Moss Circle, Sarasota, FL 34238",
    youtubeUrl: "https://youtu.be/spUcxajt87k",
    thumbnail: "https://img.youtube.com/vi/spUcxajt87k/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/spUcxajt87k?autoplay=1",
  },
  {
    name: "Mica Siazon",
    role: "1308 Pine Needle Road, Sarasota, FL 34242",
    youtubeUrl: "https://youtu.be/9diDzfZQig0",
    thumbnail: "https://img.youtube.com/vi/9diDzfZQig0/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/9diDzfZQig0?autoplay=1",
  },
  {
    name: "Brian Tutil",
    role: "3427 Siesta Drive, Sarasota, FL 34239",
    youtubeUrl: "https://youtu.be/Tadf0TQJTvc",
    thumbnail: "https://img.youtube.com/vi/Tadf0TQJTvc/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Tadf0TQJTvc?autoplay=1",
  },
  {
    name: "Kelly Johnson",
    role: "1509 Ringling Boulevard, Sarasota, FL 34236",
    youtubeUrl: "https://youtu.be/oM9RpuFXP1k",
    thumbnail: "https://img.youtube.com/vi/oM9RpuFXP1k/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/oM9RpuFXP1k?autoplay=1",
  },
  {
    name: "Angel Locsin",
    role: "5620 Midnight Pass Road, Sarasota, FL 34242",
    youtubeUrl: "https://youtu.be/J2bUoGeCBC0",
    thumbnail: "https://img.youtube.com/vi/J2bUoGeCBC0/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/J2bUoGeCBC0?autoplay=1",
  },
  {
    name: "Lisa Eilers",
    role: "2745 Bee Ridge Road, Sarasota, FL 34239",
    youtubeUrl: "https://youtu.be/8IW9MSVwTI4",
    thumbnail: "https://img.youtube.com/vi/8IW9MSVwTI4/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/8IW9MSVwTI4?autoplay=1",
  },
];

const activeIndex = ref(Math.floor(videos.length / 2));
const activeVideo = ref<VideoTestimonial | null>(null);
const activeVideoIndex = ref<number>(-1);

const desktopStripRef = ref<HTMLElement | null>(null);
const sectionRef = ref<HTMLElement | null>(null);

let autoTimer: ReturnType<typeof setInterval> | null = null;
let isSectionVisible = false;
let bodyOverflowBefore: string | null = null;

const visibleRadius = 2;
const mobileVisibleCount = 4;

const isVisibleInStrip = (i: number): boolean => {
  return Math.abs(i - activeIndex.value) <= visibleRadius;
};

const isVisibleInMobile = (i: number): boolean => {
  const half = Math.floor(mobileVisibleCount / 2);
  let start = activeIndex.value - half;
  let end = start + mobileVisibleCount - 1;

  if (start < 0) {
    start = 0;
    end = mobileVisibleCount - 1;
  }
  if (end > videos.length - 1) {
    end = videos.length - 1;
    start = Math.max(0, end - mobileVisibleCount + 1);
  }

  return i >= start && i <= end;
};

const mobileHeight = (i: number): string => {
  if (!isVisibleInMobile(i)) return "0px";
  return activeIndex.value === i ? "300px" : "70px";
};

const desktopWidth = (i: number): string => {
  const d = Math.abs(i - activeIndex.value);
  if (d > visibleRadius) return "0px";
  if (d === 0) return "520px";
  if (d === 1) return "90px";
  if (d === 2) return "80px";
  return "70px";
};

const desktopHeight = (i: number): string => {
  const d = Math.abs(i - activeIndex.value);
  if (d > visibleRadius) return "0px";
  if (d === 0) return "100%";
  if (d === 1) return "78%";
  if (d === 2) return "62%";
  return "48%";
};

const scrollActiveIntoView = () => {
  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches;
  if (!isDesktop) return;

  const strip = desktopStripRef.value;
  if (!strip) return;

  const active = strip.children[activeIndex.value] as HTMLElement | undefined;
  if (!active) return;

  const target =
    active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2;
  strip.scrollTo({ left: target, behavior: "smooth" });
};

const startAuto = () => {
  if (typeof window === "undefined") return;
  if (autoTimer) return;
  if (!isSectionVisible) return;
  if (activeVideo.value) return;

  autoTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % videos.length;
    scrollActiveIntoView();
  }, 2500);
};

const pauseAuto = () => {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
};

const resumeAuto = () => {
  startAuto();
};

const onCardClick = (i: number) => {
  const video = videos[i];
  if (!video) return;
  if (i === activeIndex.value) {
    openVideo(video, i);
  } else {
    activeIndex.value = i;
    scrollActiveIntoView();
  }
};

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;
  bodyOverflowBefore = document.body.style.overflow;
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = bodyOverflowBefore ?? "";
  bodyOverflowBefore = null;
};

const openVideo = (video: VideoTestimonial, index: number) => {
  activeVideo.value = video;
  activeVideoIndex.value = index;
  pauseAuto();
  lockBodyScroll();
};

const closeVideo = () => {
  activeVideo.value = null;
  activeVideoIndex.value = -1;
  unlockBodyScroll();
  if (isSectionVisible) startAuto();
};

const prevVideo = () => {
  if (!activeVideo.value) return;
  const next = (activeVideoIndex.value - 1 + videos.length) % videos.length;
  const nextVid = videos[next];
  if (!nextVid) return;
  activeVideo.value = nextVid;
  activeVideoIndex.value = next;
  activeIndex.value = next;
};

const nextVideo = () => {
  if (!activeVideo.value) return;
  const next = (activeVideoIndex.value + 1) % videos.length;
  const nextVid = videos[next];
  if (!nextVid) return;
  activeVideo.value = nextVid;
  activeVideoIndex.value = next;
  activeIndex.value = next;
};

const goToVideo = (i: number) => {
  if (!activeVideo.value) return;
  const nextVid = videos[i];
  if (!nextVid) return;
  activeVideo.value = nextVid;
  activeVideoIndex.value = i;
  activeIndex.value = i;
};

const onKeydown = (e: KeyboardEvent) => {
  if (!activeVideo.value) return;
  if (e.key === "Escape") closeVideo();
  else if (e.key === "ArrowLeft") prevVideo();
  else if (e.key === "ArrowRight") nextVideo();
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  document.addEventListener("keydown", onKeydown);

  if (sectionRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isSectionVisible = !!entry?.isIntersecting;
        if (isSectionVisible) startAuto();
        else pauseAuto();
      },
      { threshold: 0.25 },
    );
    observer.observe(sectionRef.value);
  }

  scrollActiveIntoView();
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
  pauseAuto();
  unlockBodyScroll();
  observer?.disconnect();
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Customer Video Testimonials",
        itemListElement: videos.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "VideoObject",
            name: `Video testimonial from ${v.name}`,
            thumbnailUrl: v.thumbnail,
            contentUrl: v.youtubeUrl,
            embedUrl: v.embedUrl.replace("?autoplay=1", ""),
            uploadDate: new Date().toISOString().split("T")[0],
          },
        })),
      }),
    },
  ],
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-backdrop {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  z-index: 9999 !important;
}
</style>
