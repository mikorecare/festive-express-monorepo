<template>
  <section
    class="relative w-full overflow-hidden"
    aria-labelledby="video-testimonials-heading"
  >
    <!-- Top white area -->
    <div class="bg-white pt-10 sm:pt-14 lg:pt-20">
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
          <p
            class="text-[#1C2D5B] text-sm sm:text-base mt-2 sm:mt-3 font-medium"
          >
            Real homeowners on renting the magic and enjoying the season from
            the couch.
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom section: white top / navy bottom, orange band in between -->
    <div class="relative">
      <div class="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div class="absolute inset-x-0 top-0 h-1/2 bg-white"></div>
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-[#1C2D5B]"></div>
        <div
          class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 sm:h-5 lg:h-6 bg-[#F49321]"
        ></div>
      </div>

      <!-- Videos sit on top of the banded background -->
      <div
        class="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10"
      >
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        >
          <article
            v-for="(video, i) in videos"
            :key="i"
            v-fade
            class="flex flex-col"
            :style="{ transitionDelay: `${i * 120}ms` }"
          >
            <button
              type="button"
              class="group relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-4 focus:ring-[#F49321]/60"
              :aria-label="`Play video testimonial from ${video.name}`"
              @click="openVideo(video)"
            >
              <img
                :src="video.thumbnail"
                :alt="`Video testimonial thumbnail — ${video.name}`"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                width="480"
                height="360"
              />

              <div
                class="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors"
                aria-hidden="true"
              ></div>

              <div
                class="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110"
                >
                  <svg
                    class="w-6 h-6 sm:w-7 sm:h-7 text-[#1C2D5B] ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>

            <p
              class="mt-2 sm:mt-3 text-xs sm:text-sm font-bold tracking-wide uppercase text-[#1C2D5B]"
            >
              {{ video.name }}
            </p>
          </article>
        </div>
      </div>
    </div>

    <!-- Lightbox modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="activeVideo"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          :aria-label="`Playing video testimonial from ${activeVideo.name}`"
          @click.self="closeVideo"
        >
          <button
            type="button"
            class="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none p-2 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close video"
            @click="closeVideo"
          >
            <i class="fas fa-times"></i>
          </button>

          <div
            class="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
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
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
interface VideoTestimonial {
  name: string;
  youtubeUrl: string;
  thumbnail: string;
  embedUrl: string;
}

const videos: VideoTestimonial[] = [
  {
    name: "Sample Address",
    youtubeUrl: "https://youtu.be/TfgCQ-PUX9g?si=7wCdTym4jOOcNFD9",
    thumbnail: "https://img.youtube.com/vi/TfgCQ-PUX9g/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/TfgCQ-PUX9g?autoplay=1",
  },
  {
    name: "Sample Address",
    youtubeUrl: "https://youtu.be/lkSDylU5ctk?si=nNuLSVi0fM6C4x_g",
    thumbnail: "https://img.youtube.com/vi/lkSDylU5ctk/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/lkSDylU5ctk?autoplay=1",
  },
  {
    name: "Sample Address",
    youtubeUrl: "https://youtu.be/spUcxajt87k?si=WHXYnw-zSC-kkMuf",
    thumbnail: "https://img.youtube.com/vi/spUcxajt87k/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/spUcxajt87k?autoplay=1",
  },
  {
    name: "Sample Address",
    youtubeUrl: "https://youtu.be/9diDzfZQig0?si=xx23fMMB9x41qUWM",
    thumbnail: "https://img.youtube.com/vi/9diDzfZQig0/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/9diDzfZQig0?autoplay=1",
  },
];

const activeVideo = ref<VideoTestimonial | null>(null);

const openVideo = (video: VideoTestimonial) => {
  activeVideo.value = video;
};

const closeVideo = () => {
  activeVideo.value = null;
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && activeVideo.value) {
    closeVideo();
  }
};

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
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
</style>
