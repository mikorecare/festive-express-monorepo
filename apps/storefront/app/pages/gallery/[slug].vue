<template>
  <div class="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-gray-900">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center min-h-[60vh]">
      <div
        class="w-12 h-12 border-4 border-[#F49321] border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !project" class="text-center py-32 px-4">
      <h1 class="text-4xl font-bold text-[#1C2D5B] mb-4">Project Not Found</h1>
      <p class="text-gray-600 mb-8">
        The project you're looking for doesn't exist or has been removed.
      </p>
      <NuxtLink
        to="/gallery"
        class="inline-flex items-center text-[#F49321] font-bold hover:underline"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Gallery
      </NuxtLink>
    </div>

    <!-- Project Content -->
    <article v-else>
      <!-- 1. Full-Bleed Hero Header -->
      <header
        class="relative w-full h-[60vh] min-h-[500px] flex items-end justify-center pb-16 overflow-hidden bg-[#1C2D5B]"
      >
        <NuxtImg
          v-if="project.hero_image_url"
          :src="project.hero_image_url"
          :alt="project.hero_image_alt || project.title"
          class="absolute inset-0 w-full h-full object-cover z-0"
          format="webp"
          quality="90"
          loading="eager"
          fetchpriority="high"
          fit="cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#1C2D5B] via-[#1C2D5B]/60 to-transparent z-10"
        ></div>

        <div class="relative z-20 max-w-4xl mx-auto px-6 text-center w-full">
          <div class="mb-4 w-full text-left">
            <NuxtLink
              to="/gallery"
              class="inline-flex items-center text-sm font-semibold text-white/70 hover:text-[#F49321] transition-colors"
            >
              <i class="fas fa-chevron-left mr-2 text-xs"></i>
              Back to Gallery
            </NuxtLink>
          </div>

          <span
            v-if="project.category"
            class="inline-block bg-[#F49321] text-white px-4 py-1 text-xs font-extrabold uppercase tracking-widest rounded-full mb-6 shadow-lg border-2 border-[#1C2D5B]"
          >
            {{ project.category.name }}
          </span>

          <h1
            class="outlined outlined-line1 text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#1C2D5B] leading-tight mb-6 tracking-wide drop-shadow-md"
            :data-text="project.title"
          >
            {{ project.title }}
          </h1>
        </div>
      </header>

      <!-- 2. Main Content Area -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
          <!-- LEFT: Description & Image Gallery -->
          <div class="space-y-8">
            <!-- Description Card -->
            <div
              class="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 class="text-2xl font-bold text-[#1C2D5B] mb-6">
                Project Overview
              </h2>
              <div
                v-if="project.description"
                class="prose prose-lg max-w-none text-gray-600 prose-headings:text-[#1C2D5B] prose-a:text-[#F49321] prose-img:rounded-xl"
                v-html="project.description"
              ></div>
              <p v-else class="text-gray-500 italic">
                No detailed description provided.
              </p>
            </div>

            <!-- Image Gallery -->
            <div
              v-if="project.images?.length"
              class="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <div
                class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4"
              >
                <h2 class="text-2xl font-bold text-[#1C2D5B]">
                  Gallery Highlights
                </h2>
                <span class="text-sm text-gray-400"
                  >{{ project.images.length }} Photos</span
                >
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <figure
                  v-for="(img, index) in project.images"
                  :key="img.id"
                  @click="openLightbox(index)"
                  class="relative group rounded-xl overflow-hidden bg-gray-100 border border-gray-100 cursor-pointer"
                  :class="
                    index === 0
                      ? 'md:col-span-2 aspect-[21/9]'
                      : 'aspect-square'
                  "
                >
                  <NuxtImg
                    :src="img.image_url"
                    :alt="img.alt_text || project.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    format="webp"
                    quality="80"
                    loading="lazy"
                    fit="cover"
                  />

                  <!-- Simple Hover Indicator -->
                  <div
                    class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <div
                      class="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white"
                    >
                      <i class="fas fa-expand text-xl"></i>
                    </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>

          <!-- RIGHT: Sticky Sidebar Meta -->
          <aside class="space-y-6">
            <div
              class="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden"
            >
              <div class="p-6 md:p-8 space-y-6">
                <!-- Client -->
                <div v-if="project.client_name" class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-[#F49321]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5"
                    >
                      Client
                    </p>
                    <p class="font-bold text-[#1C2D5B] text-lg">
                      {{ project.client_name }}
                    </p>
                  </div>
                </div>

                <!-- Location -->
                <div
                  v-if="project.location_city || project.location_state"
                  class="flex items-start gap-4"
                >
                  <div
                    class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-[#F49321]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5"
                    >
                      Location
                    </p>
                    <p class="font-bold text-[#1C2D5B] text-lg">
                      {{ project.location_city
                      }}<template
                        v-if="project.location_city && project.location_state"
                        >, </template
                      >{{ project.location_state }}
                    </p>
                  </div>
                </div>

                <!-- Completion Date -->
                <div
                  v-if="project.completion_date"
                  class="flex items-start gap-4"
                >
                  <div
                    class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-[#F49321]"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5"
                    >
                      Completed
                    </p>
                    <p class="font-bold text-[#1C2D5B] text-lg">
                      {{ formatDate(project.completion_date) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Call to Action -->
              <div
                class="bg-slate-50 border-t border-gray-100 p-6 md:p-8 text-center"
              >
                <p class="text-sm font-medium text-gray-600 mb-4">
                  Want a space like this?
                </p>
                <NuxtLink
                  to="/packages"
                  class="btn-3d-glossy w-full justify-center px-6 py-3.5 font-bold uppercase tracking-wider text-sm shadow-md"
                >
                  Explore Packages
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- 3. Tags Section (Below Everything) -->
      <div
        v-if="project.tags?.length"
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
      >
        <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h3
            class="text-lg font-bold text-[#1C2D5B] uppercase tracking-wider mb-4"
          >
            Features & Elements
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag.id"
              class="bg-slate-50 text-[#1C2D5B] px-4 py-2 text-sm font-bold rounded-full border border-slate-200"
            >
              #{{ tag.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 4. More Projects Section (Sliding Window) -->
      <section
        v-if="recentProjects.length > 0"
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div class="flex items-end justify-between mb-8">
          <div>
            <p
              class="text-[#F49321] font-bold uppercase tracking-wider text-sm mb-1"
            >
              Keep Exploring
            </p>
            <h2 class="text-3xl font-extrabold text-[#1C2D5B]">
              More Projects
            </h2>
          </div>
          <NuxtLink
            to="/gallery"
            class="hidden sm:flex items-center gap-2 text-sm font-bold text-[#1C2D5B] hover:text-[#F49321] transition-colors"
          >
            View All Projects <i class="fas fa-arrow-right"></i>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="rp in recentProjects"
            :key="rp.id"
            :to="`/gallery/${rp.slug}`"
            class="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Image & Gradient Overlay -->
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                :src="rp.hero_image_url || ''"
                :alt="rp.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#1C2F5B]/90 via-[#1C2F5B]/20 to-transparent flex flex-col justify-end p-5"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span
                    v-if="rp.category"
                    class="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  >
                    {{ rp.category.name }}
                  </span>
                </div>
                <h3
                  class="text-white text-lg font-bold leading-tight line-clamp-2"
                >
                  {{ rp.title }}
                </h3>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </article>
    <GalleryLightBox
      :is-open="isLightboxOpen"
      :project="project ?? null"
      :initial-index="lightboxIndex"
      @close="closeLightbox"
    />
  </div>
</template>

<script setup lang="ts">
// --- Types ---
interface ProjectImage {
  id: string;
  image_url: string;
  alt_text: string;
  title?: string | null;
  caption: string | null;
  room_or_area?: string | null;
  description?: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  client_name: string | null;
  location_city: string | null;
  location_state: string | null;
  completion_date: string | null;
  published_at: string | null;
  category?: { id: number; name: string; slug: string } | null;
  tags?: { id: number; name: string; slug: string }[];
  images?: ProjectImage[];
}

// --- Fetch Current Project ---
const route = useRoute();
const {
  data: project,
  pending,
  error,
} = await useFetch<Project>(`/api/projects/${route.params.slug}`, {
  key: `project-${route.params.slug}`,
});

// --- Fetch All Projects for the "Sliding Window" ---
const { data: listData } = await useFetch<{ projects: Project[] }>(
  "/api/storefront/projects",
  {
    key: "projects-list-related",
  },
);

const isLightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  isLightboxOpen.value = true;
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

const recentProjects = computed(() => {
  if (!listData.value?.projects || !project.value) return [];

  const allProjects = listData.value.projects;
  const total = allProjects.length;

  // Find where the current project sits in the array
  const currentIndex = allProjects.findIndex(
    (p) => p.slug === route.params.slug,
  );

  // If it's not found or there are 4 or fewer total projects, just return the first 4 that aren't the current one
  if (currentIndex === -1 || total <= 4) {
    return allProjects.filter((p) => p.slug !== route.params.slug).slice(0, 4);
  }

  // Create a sliding window: Get the 4 projects immediately AFTER the current one
  const nextFour = allProjects.slice(currentIndex + 1, currentIndex + 5);

  // If we hit the end of the list, loop back to the beginning to fill the 4 slots
  const remaining = 4 - nextFour.length;
  if (remaining > 0) {
    const fromStart = allProjects
      .slice(0, remaining)
      .filter((p) => p.slug !== route.params.slug);
    return [...nextFour, ...fromStart];
  }

  return nextFour;
});

// --- SEO & Schema ---
const siteUrl = "https://festive.express";
const currentUrl = computed(() => `${siteUrl}/gallery/${route.params.slug}`);

useSeoMeta({
  title: project.value
    ? `${project.value.title} | Festive Express Gallery`
    : "Project Gallery",
  ogTitle: project.value?.title || "Project Gallery",
  description:
    project.value?.summary || "Explore our latest holiday lighting project.",
  ogDescription:
    project.value?.summary || "Explore our latest holiday lighting project.",
  ogImage:
    project.value?.hero_image_url || `${siteUrl}/Images/festive-express.png`,
  ogUrl: currentUrl.value,
  ogType: "article",
  twitterCard: "summary_large_image",
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: project.value?.title,
        description: project.value?.summary,
        image:
          project.value?.images?.map((img) => ({
            "@type": "ImageObject",
            contentUrl: img.image_url,
            name: img.title || project.value?.title,
            description: img.caption || img.alt_text,
            creator: { "@type": "Organization", name: "Festive Express" },
          })) || [],
      }),
    },
  ],
});

// --- Helpers ---
const formatDate = (isoString: string | null) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};
</script>

<style scoped>
/* Reuse the outlined text effect */
.outlined {
  position: relative;
  isolation: isolate;
  paint-order: stroke fill;
  -webkit-text-stroke-linejoin: round;
  stroke-linejoin: round;
}
.outlined::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  z-index: -1;
  paint-order: stroke fill;
  stroke-linejoin: round;
  pointer-events: none;
}
.outlined-line1 {
  -webkit-text-stroke: 1.5px #ffffff;
}
.outlined-line1::before {
  color: #f49321;
  -webkit-text-stroke: 4px #f49321;
}
@media (min-width: 768px) {
  .outlined-line1 {
    -webkit-text-stroke: 3px #ffffff;
  }
  .outlined-line1::before {
    -webkit-text-stroke: 8px #f49321;
  }
}
</style>
