<script setup lang="ts">
import { computed, ref, onUnmounted } from "vue";

type ProjectImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

type ProjectListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  hero_image_url: string;
  hero_image_alt: string;
  location_city: string | null;
  location_state: string | null;
  published_at: string;
  category: { id: number; name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
  project_images: ProjectImage[];
};

// Fetch Data
const { data, pending, error } = await useFetch<{
  projects: ProjectListItem[];
}>("/api/projects", { key: "projects-list" });

const projects = computed(() => data.value?.projects ?? []);

// Map out the thumbnails natively so Vue reactivity tracks it perfectly
const projectThumbnails = computed(() => {
  const map: Record<string, string[]> = {};
  projects.value.forEach((p) => {
    // Only take the first 4 images
    map[p.id] = (p.project_images || [])
      .map((img) => img.image_url)
      .slice(0, 4);
  });
  return map;
});

// ── Hero Data ──────────────────────────────────────────────
const heroData = computed(() => {
  const featured = projects.value[0];
  return {
    title: "A Little Light.",
    titleHighlight: "A Lasting Impression.",
    subtitle: "Project Gallery",
    description:
      "Explore lighting installations designed to make homes, businesses, and celebrations shine.",
    bgImage: "/New/Banner/bg-gallery.png",
    featuredImage: featured
      ? {
          image: featured.hero_image_url,
          imageAlt: featured.hero_image_alt || featured.title,
          title: featured.title,
          category: featured.category?.name || "Residential",
          seo: { datePublished: featured.published_at },
        }
      : {
          image:
            "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1200",
          imageAlt: "Beautifully lit residential home",
          title: "Holiday Lighting",
          category: "Residential",
        },
  };
});

// ── Filtering & Pagination ─────────────────────────────────
const activeCategory = ref<string>("All");
const categories = computed(() => {
  const cats = new Set<string>();
  projects.value.forEach((p) => {
    if (p.category?.name) cats.add(p.category.name);
  });
  return ["All", ...Array.from(cats)];
});

const filteredProjects = computed(() => {
  if (activeCategory.value === "All") return projects.value;
  return projects.value.filter(
    (p) => p.category?.name === activeCategory.value,
  );
});

const visibleCount = ref(9);
const visibleProjects = computed(() =>
  filteredProjects.value.slice(0, visibleCount.value),
);
const hasMore = computed(
  () => visibleCount.value < filteredProjects.value.length,
);
const loadMore = () => (visibleCount.value += 9);

// ── Hover Carousel Logic ───────────────────────────────────
const hoveredProjectId = ref<string | null>(null);
const activeImageIndices = ref<Record<string, number>>({});
let hoverInterval: ReturnType<typeof setInterval> | null = null;

const startHoverPreview = (project: ProjectListItem) => {
  const thumbs = projectThumbnails.value[project.id] || [];
  if (thumbs.length === 0) return; // No thumbnails? Do nothing.

  hoveredProjectId.value = project.id;
  activeImageIndices.value[project.id] = 0; // Start at t1

  // Cycle every 1.5 seconds
  hoverInterval = setInterval(() => {
    const currentIdx = activeImageIndices.value[project.id] ?? 0;
    const nextIdx = (currentIdx + 1) % thumbs.length;
    activeImageIndices.value[project.id] = nextIdx;
  }, 1500);
};

const stopHoverPreview = (projectId: string) => {
  hoveredProjectId.value = null;
  if (hoverInterval) {
    clearInterval(hoverInterval);
    hoverInterval = null;
  }
  // Reset back to undefined so it shows the main hero again
  delete activeImageIndices.value[projectId];
};

// If user manually clicks a thumbnail
const setImageIndex = (projectId: string, index: number) => {
  activeImageIndices.value[projectId] = index;
};

// Determine what image to show
const getCurrentImage = (project: ProjectListItem) => {
  const idx = activeImageIndices.value[project.id];
  const thumbs = projectThumbnails.value[project.id] || [];

  // If hovering and there's a thumbnail, show the thumbnail
  if (
    hoveredProjectId.value === project.id &&
    idx !== undefined &&
    thumbs[idx]
  ) {
    return thumbs[idx];
  }

  // Otherwise, return the hero
  return project.hero_image_url;
};

// Cleanup interval if the user navigates away while hovering
onUnmounted(() => {
  if (hoverInterval) clearInterval(hoverInterval);
});

// ── SEO ────────────────────────────────────────────────────
useSeoMeta({
  title: "Project Gallery | Festive Express",
  description:
    "Explore our portfolio of stunning holiday and architectural lighting projects.",
  ogImage: "https://festive.express/Images/festive-express.png",
});
</script>

<template>
  <div class="bg-slate-50 min-h-screen font-sans">
    <GalleryHero
      :bg-image="heroData.bgImage"
      :title="heroData.title"
      :title-highlight="heroData.titleHighlight"
      :subtitle="heroData.subtitle"
      :description="heroData.description"
      :featured-image="heroData.featuredImage"
    />

    <section class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <!-- Header & Filters (same as before) -->
      <div
        class="flex flex-col md:flex-row justify-between md:items-start mb-10 gap-6 md:gap-12"
      >
        <div class="flex flex-col flex-shrink-0">
          <p
            class="text-brand-orange font-bold uppercase tracking-wider text-xs md:text-sm mb-1"
          >
            Explore the possibilities
          </p>
          <h2
            class="text-4xl md:text-5xl font-extrabold text-navy tracking-tight"
          >
            Projects That <span class="text-brand-orange">Glow.</span>
          </h2>
        </div>
        <p
          class="text-slate-500 text-sm md:text-[15px] leading-relaxed md:text-left max-w-[420px] md:mt-2"
        >
          From welcoming front yards to standout commercial spaces, discover the
          details that make every installation unique.
        </p>
      </div>

      <div
        class="flex flex-col md:flex-row justify-between items-center py-4 border-y border-slate-200 mb-10 gap-4"
      >
        <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            :class="
              activeCategory === cat
                ? 'bg-navy text-white'
                : 'bg-transparent text-slate-600 hover:bg-slate-200'
            "
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading/Empty states (same as before) -->
      <div
        v-if="pending"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="aspect-[4/3] bg-slate-200 animate-pulse rounded-2xl"
        ></div>
      </div>
      <div
        v-else-if="filteredProjects.length === 0"
        class="text-center py-20 text-slate-500"
      >
        No projects found for this category.
      </div>

      <!-- Project Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in visibleProjects"
          :key="project.id"
          class="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
          @mouseenter="startHoverPreview(project)"
          @mouseleave="stopHoverPreview(project.id)"
        >
          <!-- Main Image (Hero + Hover Preview) -->
          <NuxtLink
            :to="`/gallery/${project.slug}`"
            class="block relative aspect-[4/3] overflow-hidden w-full"
          >
            <img
              :src="getCurrentImage(project)"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-700"
              :class="{ 'scale-105': hoveredProjectId === project.id }"
              loading="lazy"
            />
            <!-- Gradient Overlay & Text -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#1C2F5B]/90 via-[#1C2F5B]/20 to-transparent flex flex-col justify-end p-5"
            >
              <div class="flex items-center gap-2 mb-1">
                <span
                  v-if="project.category"
                  class="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                >
                  {{ project.category.name }}
                </span>
                <span
                  class="text-white/80 text-[10px] font-medium uppercase tracking-wider"
                >
                  {{ project.location_city
                  }}{{
                    project.location_city && project.location_state ? ", " : ""
                  }}{{ project.location_state }}
                </span>
              </div>
              <h3
                class="text-white text-lg font-bold leading-tight line-clamp-2"
              >
                {{ project.title }}
              </h3>
            </div>
          </NuxtLink>

          <!-- Thumbnails Row (Full Width, No Padding, Grid of 4) -->
          <div
            v-if="(projectThumbnails[project.id]?.length || 0) > 0"
            class="grid grid-cols-4 w-full bg-white mt-auto"
          >
            <button
              v-for="(img, idx) in projectThumbnails[project.id]"
              :key="idx"
              @click="setImageIndex(project.id, idx)"
              @mouseenter="setImageIndex(project.id, idx)"
              class="relative aspect-[4/3] overflow-hidden transition-all duration-200 cursor-pointer border-t-2"
              :class="
                hoveredProjectId === project.id &&
                activeImageIndices[project.id] === idx
                  ? 'border-brand-orange opacity-100 z-10 scale-105 shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-100'
              "
            >
              <img
                :src="img"
                class="w-full h-full object-cover"
                alt="Thumbnail preview"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div
        v-if="hasMore"
        class="mt-12 flex flex-col items-center justify-center"
      >
        <div class="w-16 h-0.5 bg-brand-orange/30 mb-4"></div>
        <p class="text-xs text-slate-400 mb-4">
          Showing {{ Math.min(visibleCount, filteredProjects.length) }} of
          {{ filteredProjects.length }} projects
        </p>
        <button
          @click="loadMore"
          class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 font-medium hover:border-navy hover:text-navy transition-colors"
        >
          Load more Projects
        </button>
      </div>
    </section>

    <GalleryTestimonialsSection />
    <GalleryCta />
  </div>
</template>
