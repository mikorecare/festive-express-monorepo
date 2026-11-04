<template>
  <div class="min-h-screen bg-[#F8F9FA] pb-12 md:pb-16 font-sans text-gray-900">
    <!-- Hero Banner / Top Spacing -->
    <div class="w-full bg-white border-b border-gray-200">
      <div
        class="max-w-[1440px] mx-auto px-4 py-6 md:py-12 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8"
      >
        <!-- Text Content -->
        <div class="flex-1 text-center md:text-left">
          <h1
            class="text-2xl md:text-5xl font-bold text-[#1C2D5B] mb-2 md:mb-4"
          >
            Lighting Insights & Ideas
          </h1>
          <p class="text-gray-600 text-center text-sm md:text-lg max-w-full">
            Explore expert advice, seasonal inspiration, and the latest news
            from Festive Express.
          </p>
        </div>

        <!-- Mascot Image -->
        <div class="flex-shrink-0">
          <NuxtImg
            src="/New/mascot.png"
            alt="Festive Express Mascot"
            format="webp"
            quality="85"
            width="200"
            height="200"
            fit="contain"
            loading="eager"
            class="h-24 md:h-40 w-auto object-contain drop-shadow-md"
          />
        </div>
      </div>
    </div>

    <div class="max-w-[1440px] mx-auto px-4 mt-6 md:mt-8">
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-32">
        <div
          class="w-12 h-12 border-4 border-[#F49321] border-t-transparent rounded-full animate-spin"
          aria-label="Loading"
        ></div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <p class="text-lg text-red-500">Failed to load blog posts.</p>
        <button
          @click="retry"
          class="mt-4 text-[#F49321] font-semibold hover:underline"
        >
          Try Again
        </button>
      </div>

      <!-- Content Layout: Mobile First (Stacked), Desktop (Grid 2 cols) -->
      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-10"
      >
        <!-- LEFT COLUMN: Main Content -->
        <div class="space-y-6 md:space-y-8">
          <!-- Featured Post (First Item) -->
          <article
            v-if="featuredPost"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
          >
            <NuxtLink :to="`/blogs/${featuredPost.slug}`" class="block">
              <div
                class="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden bg-gray-100"
              >
                <NuxtImg
                  v-if="featuredPost.featured_image"
                  :src="featuredPost.featured_image"
                  :alt="featuredPost.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  format="webp"
                  quality="85"
                  loading="eager"
                  fetchpriority="high"
                  width="1200"
                  height="630"
                  fit="cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-300"
                >
                  <i class="fas fa-image text-6xl" aria-hidden="true"></i>
                </div>
              </div>

              <div class="p-4 md:p-8">
                <!-- Category & Meta -->
                <div
                  class="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3"
                >
                  <span
                    v-if="featuredPost.category"
                    class="bg-[#1C2D5B] text-white px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs font-bold uppercase tracking-wider rounded-sm"
                  >
                    {{ featuredPost.category.name }}
                  </span>
                  <span
                    class="text-gray-500 text-[10px] md:text-sm uppercase tracking-wider"
                  >
                    {{ formatDate(featuredPost.published_at) }}
                  </span>
                  <span class="text-gray-300 hidden md:inline">|</span>
                  <span
                    class="text-gray-500 text-[10px] md:text-sm uppercase tracking-wider"
                  >
                    By Admin
                  </span>
                </div>

                <h2
                  class="text-xl md:text-3xl lg:text-4xl font-extrabold text-[#1C2D5B] leading-tight mb-2 md:mb-3 group-hover:text-[#F49321] transition-colors"
                >
                  {{ featuredPost.title }}
                </h2>

                <p
                  class="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-3 md:mb-5"
                >
                  {{ featuredPost.summary }}
                </p>

                <span
                  class="inline-flex items-center text-[10px] md:text-sm font-bold text-[#1C2D5B] uppercase tracking-wide group-hover:text-[#F49321] transition-colors"
                >
                  Continue Reading
                  <i
                    class="fas fa-chevron-right ml-1 md:ml-2 text-[8px] md:text-[10px]"
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
            </NuxtLink>
          </article>

          <!-- Sub-header for Grid -->
          <div
            class="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-2 md:pb-3 gap-1 md:gap-2"
          >
            <div>
              <span
                class="text-[#F49321] text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-0.5"
              >
                More From The Blog
              </span>
              <h3 class="text-xl md:text-2xl font-bold text-[#1C2D5B]">
                Latest Insights
              </h3>
            </div>
            <p class="text-xs text-gray-500" v-if="remainingPosts.length > 0">
              Showing 1–{{ remainingPosts.length }} of
              {{ remainingPosts.length }}
            </p>
          </div>

          <!-- Grid of Remaining Posts -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <article
              v-for="post in remainingPosts"
              :key="post.id"
              class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow"
            >
              <NuxtLink
                :to="`/blogs/${post.slug}`"
                class="flex flex-col h-full"
              >
                <div class="aspect-video relative overflow-hidden bg-gray-100">
                  <NuxtImg
                    v-if="post.featured_image"
                    :src="post.featured_image"
                    :alt="post.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    format="webp"
                    quality="80"
                    loading="lazy"
                    width="600"
                    height="338"
                    fit="cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-300"
                  >
                    <i class="fas fa-image text-4xl" aria-hidden="true"></i>
                  </div>
                </div>

                <div class="p-4 flex flex-col flex-1">
                  <!-- Tags -->
                  <div class="flex flex-wrap gap-1.5 mb-2">
                    <span
                      v-for="tag in post.tags.slice(0, 2)"
                      :key="tag.id"
                      class="bg-[#1C2D5B] text-white px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm"
                    >
                      {{ tag.name }}
                    </span>
                    <span
                      v-if="!post.tags.length && post.category"
                      class="bg-[#1C2D5B] text-white px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm"
                    >
                      {{ post.category.name }}
                    </span>
                  </div>

                  <!-- Meta -->
                  <div
                    class="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase tracking-wider mb-2"
                  >
                    <span>{{ formatDate(post.published_at) }}</span>
                    <span class="text-gray-300">•</span>
                    <span>By Admin</span>
                  </div>

                  <h4
                    class="text-base md:text-lg font-bold text-[#1C2D5B] leading-snug mb-1.5 group-hover:text-[#F49321] transition-colors line-clamp-2"
                  >
                    {{ post.title }}
                  </h4>

                  <p
                    class="text-gray-600 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-3 flex-1"
                  >
                    {{ post.summary }}
                  </p>

                  <span
                    class="inline-flex items-center text-[10px] font-bold text-[#1C2D5B] uppercase tracking-wide group-hover:text-[#F49321] transition-colors mt-auto"
                  >
                    Continue Reading
                    <i
                      class="fas fa-chevron-right ml-1 text-[8px]"
                      aria-hidden="true"
                    ></i>
                  </span>
                </div>
              </NuxtLink>
            </article>
          </div>

          <!-- Empty State -->
          <div
            v-if="!featuredPost"
            class="text-center py-20 bg-white rounded-2xl border border-gray-100"
          >
            <i
              class="fas fa-newspaper text-4xl text-gray-300 mb-4"
              aria-hidden="true"
            ></i>
            <p class="text-gray-500">
              No posts published yet. Check back soon!
            </p>
          </div>
        </div>

        <!-- RIGHT COLUMN: Sidebar -->
        <aside class="space-y-4 md:space-y-6">
          <!-- Search Widget -->
          <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div class="relative">
              <label for="blog-search" class="sr-only">Search blog</label>
              <input
                id="blog-search"
                type="text"
                placeholder="Search ..."
                class="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F49321] focus:ring-1 focus:ring-[#F49321] text-sm"
                v-model="searchQuery"
              />
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1C2D5B]"
                aria-label="Search"
              >
                <i class="fas fa-search text-xs" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <!-- Categories Widget -->
          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3
              class="text-base font-bold text-[#1C2D5B] uppercase tracking-wide mb-2"
            >
              Categories
            </h3>
            <div class="relative">
              <label for="category-filter" class="sr-only"
                >Filter by category</label
              >
              <select
                id="category-filter"
                class="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-[#F49321] text-sm"
              >
                <option>All Categories ({{ posts.length }})</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <i
                  class="fas fa-chevron-down text-[10px]"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>

          <!-- Recent Posts Widget -->
          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3
              class="text-base font-bold text-[#1C2D5B] uppercase tracking-wide mb-3"
            >
              Recent Posts
            </h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="post in recentPosts"
                :key="post.id"
                :to="`/blogs/${post.slug}`"
                class="flex gap-2 group items-center"
              >
                <div
                  class="w-16 h-12 shrink-0 rounded overflow-hidden bg-gray-100"
                >
                  <NuxtImg
                    v-if="post.featured_image"
                    :src="post.featured_image"
                    :alt="post.title"
                    class="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    format="webp"
                    quality="75"
                    loading="lazy"
                    width="160"
                    height="128"
                    fit="cover"
                  />
                </div>
                <div class="flex flex-col justify-center min-w-0">
                  <span
                    class="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5"
                  >
                    {{ formatDate(post.published_at) }}
                  </span>
                  <h4
                    class="text-[11px] font-bold text-[#1C2D5B] leading-tight group-hover:text-[#F49321] transition-colors line-clamp-2"
                  >
                    {{ post.title }}
                  </h4>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Newsletter Widget -->
          <div class="bg-[#1C2D5B] p-5 rounded-lg shadow-sm text-white">
            <span
              class="text-[#F49321] text-[10px] font-bold uppercase tracking-wider block mb-1"
            >
              Stay Inspired
            </span>
            <h3 class="text-lg font-bold leading-tight mb-2">
              New Lighting Ideas, By Email
            </h3>
            <p class="text-xs text-gray-300 mb-3 leading-snug">
              Get an email when we publish a new article. Confirm through the
              link we send, then you're in.
            </p>
            <form @submit.prevent="subscribe" class="space-y-2">
              <label for="newsletter-email" class="sr-only"
                >Email address</label
              >
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email address"
                required
                class="w-full px-3 py-2 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321]"
              />
              <button
                type="submit"
                class="w-full bg-[#F49321] hover:bg-[#e07e0e] text-white font-bold py-2 px-3 rounded-md transition-colors text-[11px] uppercase tracking-wide"
              >
                Subscribe To The Blog
              </button>
            </form>
            <p class="text-[9px] text-gray-400 mt-2 leading-tight">
              Unsubscribe anytime. We'll only use your email for new blog
              notifications.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

// --- Types ---
type Category = { id: number; name: string; slug: string };
type Tag = { id: number; name: string; slug: string };
type Post = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category: Category | null;
  tags: Tag[];
};

// --- Fetching Data ---
const { data, pending, error, refresh } = await useFetch<{
  posts: Post[];
}>("/api/blogs", {
  key: "blog-list",
});

const posts = computed(() => data.value?.posts ?? []);
const featuredPost = computed(() => posts.value[0]);
const remainingPosts = computed(() => posts.value?.slice(1) ?? []);
const recentPosts = computed(() => posts.value?.slice(0, 4) ?? []);

const searchQuery = ref("");

// --- SEO Meta ---
useSeoMeta({
  title: "Latest Insights & Blog | Festive Express",
  ogTitle: "Latest Insights & Blog | Festive Express",
  description:
    "Explore expert advice, seasonal inspiration, and the latest news from Festive Express. Discover holiday lighting tips, installation guides, and more.",
  ogDescription:
    "Explore expert advice, seasonal inspiration, and the latest news from Festive Express. Discover holiday lighting tips, installation guides, and more.",
  ogImage: "https://festive.express/Images/festive-express.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Latest Insights & Blog | Festive Express",
  twitterDescription:
    "Explore expert advice, seasonal inspiration, and the latest news from Festive Express.",
  robots: "index, follow",
});

// --- Helpers ---
const formatDate = (isoString: string | null) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const retry = () => {
  refresh();
};

const subscribe = () => {
  alert("Subscription feature coming soon!");
};
</script>
