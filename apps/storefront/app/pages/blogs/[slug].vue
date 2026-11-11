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
          <!-- Meta Row -->
          <div
            v-fade
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <!-- LEFT: Category, Date, Author -->
            <div class="flex flex-wrap items-center gap-3">
              <span
                v-if="post.category"
                class="btn-gloss inline-block bg-[#F49321] text-white px-3 py-1 text-[8px] md:text-[9px] font-extrabold uppercase tracking-widest rounded-full border-2 border-[#1C2D5B] shadow-sm"
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

            <!-- RIGHT: Share Buttons -->
            <div class="flex items-center gap-2">
              <span
                class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mr-1 hidden sm:inline"
              >
                Share:
              </span>

              <!-- Facebook -->
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-colors"
              >
                <i class="fab fa-facebook-f text-sm"></i>
              </a>

              <!-- X / Twitter -->
              <a
                :href="`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X"
                class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-black hover:text-white transition-colors"
              >
                <i class="fab fa-x-twitter text-sm"></i>
              </a>

              <!-- LinkedIn -->
              <a
                :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0A66C2] hover:text-white transition-colors"
              >
                <i class="fab fa-linkedin-in text-sm"></i>
              </a>

              <!-- WhatsApp -->
              <a
                :href="`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <i class="fab fa-whatsapp text-sm"></i>
              </a>

              <!-- Copy Link -->
              <button
                type="button"
                :title="copied ? 'Copied!' : 'Copy Link'"
                class="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                :class="
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-[#F49321] hover:text-white'
                "
                @click="copyShareLink"
              >
                <i
                  :class="
                    copied ? 'fas fa-check text-sm' : 'fas fa-link text-sm'
                  "
                ></i>
              </button>
            </div>
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
          <!-- Changed from v-html to ref="contentRef" -->
          <div
            ref="contentRef"
            spellcheck="false"
            contenteditable="false"
            class="prose prose-lg md:prose-xl max-w-none text-gray-700 prose-headings:text-[#1C2D5B] prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-lg prose-h4:font-bold prose-h4:mt-4 prose-h4:mb-2 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-[#F49321] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1C2D5B] prose-strong:font-bold prose-img:rounded-xl prose-img:shadow-sm prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1 prose-li:marker:text-[#F49321] prose-blockquote:border-l-4 prose-blockquote:border-[#F49321] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg"
          />

          <!-- Tags Footer -->
          <div
            v-fade
            v-if="post?.tags?.length"
            class="mt-12 pt-8 border-t border-gray-200"
          >
            <h3
              class="text-sm font-bold text-[#1C2D5B] uppercase tracking-wider mb-4"
            >
              Related Topics
            </h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="tag in post.tags"
                :key="tag.id"
                :to="`/blogs/tag/${tag.slug}`"
                class="btn-3d-glossy px-3 py-1.5 text-xs font-semibold rounded-full"
              >
                #{{ tag.name }}
              </NuxtLink>
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
          <NewsLetterForm />

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
import { h, ref, onMounted, nextTick, render } from "vue";
import BrandedVideoPlayer from "../../components/Blogs/BrandVideoPlayer.vue";
import NewsLetterForm from "~/components/Blogs/NewsLetterForm.vue";

// --- Types ---
interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featured_image: string | null;
  published_at: string | null;
  updated_at: string | null;
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

// --- Fetch Data ---
const route = useRoute();
const {
  data: post,
  pending,
  error,
} = await useFetch<Post>(`/api/blogs/${route.params.slug}`, {
  key: `post-${route.params.slug}`,
});

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

const { data: relatedData } = await useFetch<{ posts: RelatedPost[] }>(
  () => `/api/blogs/${route.params.slug}/related`,
  {
    key: `related-${route.params.slug}`,
    lazy: true,
  },
);

const relatedPosts = computed(() => relatedData.value?.posts ?? []);

// --- SEO ---
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
        dateModified: post.value?.updated_at || post.value?.published_at,
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
        keywords: post.value?.tags?.map((t) => t.name).join(", ") || undefined,
        mainEntityOfPage: { "@type": "WebPage", "@id": currentUrl.value },
      }),
    },
  ],
});
// --- The Fix: Video Mounting ---
const contentRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!post.value?.content || !contentRef.value) return;

  // 1. Parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = post.value.content;

  // 2. Find placeholders and replace with empty divs
  const placeholders = temp.querySelectorAll(".post-video");
  placeholders.forEach((el) => {
    const url = el.getAttribute("data-video-url");
    if (!url) return;

    const mountPoint = document.createElement("div");
    mountPoint.className = "vue-video-mount";
    mountPoint.setAttribute("data-src", url);
    el.replaceWith(mountPoint);
  });

  // 3. Inject into DOM
  contentRef.value.innerHTML = temp.innerHTML;
  await nextTick();

  // 4. THE FIX: Force disable spellcheck on EVERY element inside the content
  if (contentRef.value) {
    const allElements = contentRef.value.querySelectorAll("*");
    allElements.forEach((el) => {
      el.setAttribute("spellcheck", "false");
      el.setAttribute("autocorrect", "off");
      el.setAttribute("autocapitalize", "off");
    });

    // Also set it on the container itself
    contentRef.value.setAttribute("spellcheck", "false");
  }

  // 5. Mount components natively
  if (!contentRef.value) return;

  const mountPoints = contentRef.value.querySelectorAll(".vue-video-mount");
  mountPoints.forEach((mountPoint) => {
    const url = mountPoint.getAttribute("data-src");
    if (url) {
      render(h(BrandedVideoPlayer, { src: url }), mountPoint as HTMLElement);
    }
  });
});

const config = useRuntimeConfig();
const shareUrl = computed(() => {
  // For the public page, use the actual site URL.
  // For the admin preview, we can still generate the live URL so sharing works.
  const base = "https://festive.express";
  return `${base}/blogs/${post.value?.slug || ""}`;
});

const copied = ref(false);

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
};

// --- Helpers ---
const formatDate = (isoString: string | null) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<style scoped>
.prose :deep(.SpellingErrorV2Themed),
.prose :deep(.SpellingError) {
  background-image: none !important;
  border-bottom: none !important;
}

.prose :deep([class*="SpellingError"]),
.prose :deep([class*="GrammarError"]),
.prose :deep([class*="ContextualSpelling"]),
.prose :deep(.NormalTextRun) {
  background-image: none !important;
  background: none !important;
  border-bottom: none !important;
  text-decoration: none !important;
}

.prose :deep(.TextRun) {
  background: none !important;
  border: none !important;
}

/* If the mark is a font-character, this will hide it */
.prose :deep(br[type="page"]),
.prose :deep(span[style*="cursor"]) {
  display: none !important;
}

.prose :deep(ul),
.rte-content :deep(ul) {
  list-style-type: disc !important;
  padding-left: 1.5rem !important;
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
}

.prose :deep(ol),
.rte-content :deep(ol) {
  list-style-type: decimal !important;
  padding-left: 1.5rem !important;
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
}

.prose :deep(li),
.rte-content :deep(li) {
  display: list-item !important;
  margin-bottom: 0.25rem !important;
}

/* Nested lists */
.prose :deep(ul ul),
.rte-content :deep(ul ul) {
  list-style-type: circle !important;
}
.prose :deep(ol ol),
.rte-content :deep(ol ol) {
  list-style-type: lower-alpha !important;
}

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
