<template>
  <div
    class="min-h-full bg-[#F8F9FA] pb-16 font-sans text-gray-900 bg-[url('/Images/LV.webp')] bg-no-repeat bg-[position:50%] bg-cover"
  >
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center min-h-[60vh]">
      <div
        class="w-12 h-12 border-4 border-[#F49321] border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !post" class="text-center py-32 px-4">
      <h1 class="text-4xl font-bold text-[#1C2D5B] mb-4">Post Not Found</h1>
      <p class="text-gray-600 mb-8">
        The article you're looking for doesn't exist or has been removed.
      </p>
      <NuxtLink
        to="/blogs"
        class="inline-flex items-center text-[#F49321] font-bold hover:underline"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Blog
      </NuxtLink>
    </div>

    <!-- Article Content -->
    <article v-else class="max-w-[1440px] mx-auto px-4 pt-8">
      <!-- Breadcrumbs / Back Link -->
      <div class="mb-6">
        <NuxtLink
          to="/blogs"
          class="text-sm font-semibold text-gray-500 hover:text-[#F49321] transition-colors inline-flex items-center"
        >
          <i class="fas fa-chevron-left mr-2 text-xs"></i> Back to Insights
        </NuxtLink>
      </div>

      <!-- Hero Header -->
      <header
        class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8"
      >
        <div class="aspect-video md:aspect-[21/9] relative bg-gray-100">
          <NuxtImg
            v-if="post.featured_image"
            :src="post.featured_image"
            :alt="post.title"
            class="w-full h-full object-cover"
            format="webp"
            quality="90"
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
            <i class="fas fa-image text-6xl"></i>
          </div>
        </div>

        <div class="p-6 md:p-10 lg:p-16">
          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span
              v-if="post.category"
              class="inline-block bg-[#F49321] text-white px-3 py-1 text-[10px] md:text-xs font-extrabold uppercase tracking-wider rounded-t-md border-b-4 border-[#1C2D5B] shadow-sm"
            >
              {{ post.category.name }}
            </span>
            <span
              class="text-gray-500 text-xs md:text-sm uppercase tracking-wider"
            >
              {{ formatDate(post.published_at) }}
            </span>
            <span class="text-gray-300">|</span>
            <span
              class="text-gray-500 text-xs md:text-sm uppercase tracking-wider"
            >
              By {{ post.author?.full_name || "Festive Express Team" }}
            </span>
          </div>

          <!-- Title (Outlined) -->
          <h1
            class="outlined outlined-line1 block text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#1C2D5B] leading-tight mb-6 tracking-wide"
            :data-text="post.title"
          >
            {{ post.title }}
          </h1>

          <!-- Summary -->
          <p
            v-if="post.summary"
            class="text-lg md:text-xl text-gray-600 leading-relaxed tracking-wide italic border-l-4 border-[#F49321] pl-4"
          >
            {{ post.summary }}
          </p>
        </div>
      </header>

      <!-- Main Content + Sidebar Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
        <!-- LEFT: Rich Text Content -->
        <div
          class="bg-white rounded-2xl p-6 md:p-10 lg:p-12 shadow-sm border border-gray-100"
        >
          <ClientOnly>
            <div
              class="prose prose-lg md:prose-xl max-w-none text-gray-700 prose-headings:text-[#1C2D5B] prose-a:text-[#F49321] prose-img:rounded-xl"
              v-html="post.content"
            />
            <template #fallback>
              <div class="prose ...">
                <p>Loading content...</p>
              </div>
            </template>
          </ClientOnly>

          <!-- Tags Footer -->
          <div
            v-if="post.tags?.length"
            class="mt-12 pt-8 border-t border-gray-200"
          >
            <h3
              class="text-sm font-bold text-[#1C2D5B] uppercase tracking-wider mb-4"
            >
              Related Topics
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag.id"
                class="bg-gray-100 text-gray-700 hover:bg-[#F49321] hover:text-white transition-colors px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer"
              >
                #{{ tag.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT: Sidebar -->
        <aside class="space-y-8">
          <!-- Recent Posts Widget -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3
              class="text-lg font-bold text-[#1C2D5B] uppercase tracking-wide mb-4"
            >
              Recent Posts
            </h3>
            <div class="space-y-4">
              <NuxtLink
                v-for="recent in recentPosts"
                :key="recent.id"
                :to="`/blogs/${recent.slug}`"
                class="flex gap-3 group"
              >
                <div
                  class="w-20 h-16 shrink-0 rounded overflow-hidden bg-gray-100"
                >
                  <NuxtImg
                    v-if="recent.featured_image"
                    :src="recent.featured_image"
                    :alt="recent.title"
                    class="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    format="webp"
                    quality="75"
                    loading="lazy"
                    width="160"
                    height="128"
                    fit="cover"
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <span
                    class="text-[10px] text-gray-500 uppercase tracking-wider mb-1"
                  >
                    {{ formatDate(recent.published_at) }}
                  </span>
                  <h4
                    class="text-xs font-bold text-[#1C2D5B] leading-tight group-hover:text-[#F49321] transition-colors line-clamp-2"
                  >
                    {{ recent.title }}
                  </h4>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Newsletter Widget -->
          <div class="bg-[#1C2D5B] p-8 rounded-xl shadow-sm text-white">
            <span
              class="text-[#F49321] text-xs font-bold uppercase tracking-wider block mb-2"
            >
              Stay Inspired
            </span>
            <h3 class="text-2xl font-bold leading-tight mb-3">
              New Lighting Ideas, By Email
            </h3>
            <p class="text-sm text-gray-300 mb-5 leading-relaxed">
              Get an email when we publish a new article.
            </p>
            <form @submit.prevent="subscribe" class="space-y-3">
              <label for="newsletter-email" class="sr-only"
                >Email address</label
              >
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email address"
                required
                class="w-full px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F49321]"
              />
              <button
                type="submit"
                class="w-full bg-[#F49321] hover:bg-[#e07e0e] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm uppercase tracking-wide"
              >
                Subscribe
              </button>
            </form>
          </div>

          <!-- Related Articles Widget -->
          <div
            v-if="relatedPosts.length > 0"
            class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <h3
              class="text-lg font-bold text-[#1C2D5B] uppercase tracking-wide mb-4"
            >
              Related Articles
            </h3>
            <div class="space-y-4">
              <NuxtLink
                v-for="related in relatedPosts"
                :key="related.id"
                :to="`/blogs/${related.slug}`"
                class="flex gap-3 group"
              >
                <div
                  class="w-20 h-16 shrink-0 rounded overflow-hidden bg-gray-100"
                >
                  <NuxtImg
                    v-if="related.featured_image"
                    :src="related.featured_image"
                    :alt="related.title"
                    class="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    format="webp"
                    quality="75"
                    loading="lazy"
                    width="160"
                    height="128"
                    fit="cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-300"
                  >
                    <i class="fas fa-image text-xl"></i>
                  </div>
                </div>
                <div class="flex flex-col justify-center">
                  <span
                    class="text-[10px] text-gray-500 uppercase tracking-wider mb-1"
                  >
                    {{ formatDate(related.published_at) }}
                  </span>
                  <h4
                    class="text-xs font-bold text-[#1C2D5B] leading-tight group-hover:text-[#F49321] transition-colors line-clamp-2"
                  >
                    {{ related.title }}
                  </h4>
                </div>
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
// --- Types ---
interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featured_image: string | null;
  published_at: string | null;
  author?: { full_name?: string } | null;
  category?: { id: number; name: string; slug: string } | null;
  tags?: { id: number; name: string; slug: string }[];
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featured_image: string | null;
  published_at: string | null;
}

// --- Fetch Data (SSR for SEO) ---
const route = useRoute();
const {
  data: post,
  pending,
  error,
} = await useFetch<Post>(`/api/blogs/${route.params.slug}`, {
  key: `post-${route.params.slug}`,
});

// --- Fetch Recent Posts for Sidebar ---
const { data: blogList } = await useFetch<{ posts: Post[] }>(
  "/api/blogs/posts",
  {
    key: "blog-list-sidebar",
    lazy: true,
  },
);

const recentPosts = computed(() => {
  if (!blogList.value?.posts || !post.value) return [];
  return blogList.value.posts
    .filter((p) => p.id !== post.value?.id)
    .slice(0, 4);
});

// --- Related Posts (server-side, tag-matched) ---
const { data: relatedData } = await useFetch<{ posts: RelatedPost[] }>(
  () => `/api/blogs/${route.params.slug}/related`,
  {
    key: `related-${route.params.slug}`,
    lazy: true,
  },
);

const relatedPosts = computed(() => relatedData.value?.posts ?? []);

// --- SEO & Social Sharing Meta ---
const siteUrl = "https://festive.express";
const currentUrl = computed(() => `${siteUrl}/blogs/${route.params.slug}`);

useSeoMeta({
  title: post.value?.title || "Blog Post",
  ogTitle: post.value?.title || "Blog Post",
  description:
    post.value?.summary || "Read the latest insights from Festive Express.",
  ogDescription:
    post.value?.summary || "Read the latest insights from Festive Express.",
  ogImage:
    post.value?.featured_image || `${siteUrl}/Images/festive-express.png`,
  ogUrl: currentUrl.value,
  ogType: "article",
  articlePublishedTime: post.value?.published_at || undefined,
  twitterCard: "summary_large_image",
  twitterTitle: post.value?.title || "Blog Post",
  twitterDescription:
    post.value?.summary || "Read the latest insights from Festive Express.",
  twitterImage:
    post.value?.featured_image || `${siteUrl}/Images/festive-express.png`,
});

// --- JSON-LD Structured Data for Google ---
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.value?.title,
        image: post.value?.featured_image
          ? [post.value.featured_image]
          : undefined,
        datePublished: post.value?.published_at,
        author: {
          "@type": "Organization",
          name: "Festive Express",
          url: siteUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "Festive Express",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/Images/festive-express.png`,
          },
        },
        description: post.value?.summary,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": currentUrl.value,
        },
      }),
    },
  ],
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

const subscribe = () => {
  alert("Subscription feature coming soon!");
};
</script>

<style scoped>
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

/* --- Mobile (Default) --- */
/* Navy text, white inner outline, orange outer outline */
.outlined-line1 {
  -webkit-text-stroke: 1.5px #ffffff;
}

.outlined-line1::before {
  color: #f49321;
  -webkit-text-stroke: 4px #f49321;
}

/* --- Desktop (md breakpoint and up) --- */
@media (min-width: 768px) {
  .outlined-line1 {
    -webkit-text-stroke: 3px #ffffff;
  }

  .outlined-line1::before {
    -webkit-text-stroke: 8px #f49321;
  }
}
</style>
