<template>
  <div>
    <section
      aria-label="About Us hero banner"
      role="region"
      class="page-hero snow-bg"
    >
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade>
              About <span class="text-brand-orange">Festive Express</span>
            </h1>
            <p v-fade class="breadcrumb" aria-label="Page subtitle">
              {{ pending ? "Loading..." : data?.data?.subtitle || "" }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Content Section -->
    <section
      aria-label="About us content"
      role="region"
      class="bg-white text-slate-800 py-20"
    >
      <div
        class="container flex flex-col lg:flex-row items-center gap-10 lg:gap-12"
      >
        <!-- Content Left -->
        <div class="flex-1">
          <h2 class="sr-only">Who we are</h2>

          <!-- Handle Error State -->
          <div v-if="error" class="text-red-500" role="alert">
            Failed to load about us content.
          </div>

          <!-- Handle Data State -->
          <div
            v-else-if="data?.data?.description"
            class="about-body"
            v-html="data.data.description"
          />
        </div>

        <!-- Image Right -->
        <div
          class="flex-1 flex justify-center w-full"
          aria-label="Festive Express team image"
        >
          <div
            v-if="data?.data?.description_image_url || sideImage"
            class="about-image relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full -rotate-12 border-[10px] border-brand-orange shadow-[0_15px_25px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.1)] overflow-hidden will-change-transform"
          >
            <NuxtImg
              :src="data?.data?.description_image_url || sideImage"
              alt="Festive Express team creating holiday lighting displays"
              format="webp"
              quality="85"
              width="400"
              height="400"
              fit="cover"
              loading="lazy"
              placeholder
              placeholder-blur="10"
              class="w-full h-full object-cover rotate-12 scale-110 origin-center pointer-events-none"
              @error="handleImageError"
            />
            <div
              class="absolute -top-[50%] -left-[150%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-[25deg] pointer-events-none animate-shine"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>

    <HomeFeaturedPackage2 />
  </div>
</template>

<script setup lang="ts">
type AboutUsContent = {
  id?: string;
  banner_image_url?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  description_image_url?: string | null;
};

type ApiResponse = {
  success: boolean;
  data: AboutUsContent | null;
};

const { data, pending, error } = await useFetch<ApiResponse>("/api/about-us");

useHead({
  title: computed(() => {
    const t = data.value?.data?.title?.trim();
    return t ? `${t}` : "About Festive Express";
  }),
});

const sideImage = "/Images/Gallery/Festive-Images-14.webp";

const handleImageError = (error: string | Event) => {
  console.error("About page image failed to load:", error);
};
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.about-body :deep(p) {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1rem;
}

.about-body :deep(p strong),
.about-body :deep(.intro-orange) {
  color: #f49321;
  font-size: 1.25rem;
  font-weight: 600;
}

.about-body :deep(blockquote),
.about-body :deep(.about-quote) {
  border-left: 4px solid #f49321;
  padding-left: 1rem;
  margin-top: 1.5rem;
  color: #1c2d5b;
  font-weight: 600;
  font-size: 1.05rem;
  line-height: 1.7;
}

.about-image {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  transform: rotate(-15deg);
  border: 10px solid #ff7a00;
  box-shadow:
    0 15px 25px rgba(0, 0, 0, 0.2),
    0 5px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  will-change: transform;
}

.about-image img,
.about-image :deep(img) {
  width: 100%;
  height: 100%;
  transform: rotate(15deg) scale(1.1);
  transform-origin: center center;
  object-fit: cover;
  pointer-events: none;
}

.animate-shine {
  animation: glossyShineContinuous 3s linear infinite;
}

@keyframes glossyShineContinuous {
  0% {
    transform: translateX(-100%) rotate(25deg);
  }
  100% {
    transform: translateX(200%) rotate(25deg);
  }
}
</style>
