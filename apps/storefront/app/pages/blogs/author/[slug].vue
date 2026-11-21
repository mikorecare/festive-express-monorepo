<template>
  <div
    class="min-h-screen bg-[#F8F9FA] pb-12 md:pb-16 font-sans text-gray-900 bg-[url('/Images/LV.webp')] bg-no-repeat bg-[position:50%] bg-cover"
  >
    <div class="max-w-[1440px] mx-auto px-4 pt-8">
      <!-- Breadcrumbs / Back Link -->
      <div class="mb-6">
        <NuxtLink
          to="/blogs"
          class="text-sm font-semibold text-gray-500 hover:text-[#F49321] transition-colors inline-flex items-center"
        >
          <i class="fas fa-chevron-left mr-2 text-xs" aria-hidden="true"></i>
          Back to Insights
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-32">
        <div
          class="w-12 h-12 border-4 border-[#F49321] border-t-transparent rounded-full animate-spin"
          aria-label="Loading"
        ></div>
      </div>

      <!-- Error / Not Found State -->
      <div
        v-else-if="error || !payload?.author"
        class="text-center py-24 px-4 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <h1 class="text-3xl md:text-4xl font-bold text-[#1C2D5B] mb-3">
          Author Not Found
        </h1>
        <p class="text-gray-600 mb-6">
          We couldn't find that author profile or there are no published posts
          yet.
        </p>
        <NuxtLink
          to="/blogs"
          class="inline-flex items-center text-[#F49321] font-bold hover:underline"
        >
          <i class="fas fa-arrow-left mr-2" aria-hidden="true"></i>
          Back to Blog
        </NuxtLink>
      </div>

      <!-- Author Profile + Articles -->
      <div v-else class="space-y-8 md:space-y-10">
        <!-- Profile Header Card -->
        <section
          class="bg-white rounded-2xl p-6 md:p-8 lg:p-8 shadow-sm border border-gray-100"
        >
          <div
            class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8"
          >
            <!-- Avatar -->
           <div class="shrink-0 w-full flex justify-center md:w-auto md:justify-start">
              <img
                v-if="author?.display_photo_url"
                :src="author?.display_photo_url"
                :alt="author?.full_name"
                class="w-24 h-24 md:w-32 md:h-full md:w-full rounded-full md:rounded-none md:rounded-l-xl object-cover border-4 border-[#1C2D5B] shadow-sm"
              />
              <div
                v-else
                class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#1C2D5B] text-white text-3xl md:text-4xl font-extrabold flex items-center justify-center border-4 border-[#F49321] shadow-sm"
              >
                {{ (author?.full_name || "F").charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Bio & Metadata -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2.5 mb-2">
                <span
                  v-if="author?.job_title"
                  class="btn-gloss inline-block bg-[#F49321] text-white px-3 py-1 text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest rounded-full border-2 border-[#1C2D5B] shadow-sm"
                >
                  {{ author?.job_title }}
                </span>
                <span
                  class="text-xs font-bold uppercase tracking-wider text-gray-500"
                >
                  {{ posts.length }}
                  {{ posts.length === 1 ? "Article" : "Articles" }}
                </span>
              </div>

              <h1
                class="outlined outlined-line1 block text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1C2D5B] leading-tight mb-3 tracking-wider"
                :data-text="author?.full_name"
              >
                {{ author?.full_name }}
              </h1>

              <!-- Rich-text Bio -->
              <div
                v-if="author?.bio"
                class="prose prose-lg md:prose-xl max-w-none text-gray-700 prose-headings:text-[#1C2D5B] prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-lg prose-h4:font-bold prose-h4:mt-4 prose-h4:mb-2 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-[#F49321] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1C2D5B] prose-strong:font-bold prose-img:rounded-xl prose-img:shadow-sm prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1 prose-li:marker:text-[#F49321] prose-blockquote:border-l-4 prose-blockquote:border-[#F49321] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg"
                v-html="author.bio"
              />

              <!-- Social Links -->
              <div
                v-if="socialEntries.length"
                class="flex flex-wrap items-center gap-2 pt-1"
              >
                <span
                  class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mr-1"
                >
                  Connect:
                </span>
                <a
                  v-for="item in socialEntries"
                  :key="item.key"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="`${author?.full_name} on ${item.label}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-[#1C2D5B] hover:bg-[#F49321] hover:text-white transition-colors text-xs font-bold capitalize"
                >
                  <i :class="item.icon" aria-hidden="true"></i>
                  <span>{{ item.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Articles by Author -->
        <section class="space-y-4 md:space-y-6">
          <div
            class="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-2 md:pb-3 gap-1"
          >
            <div>
              <span
                class="text-[#F49321] text-[10px] md:text-xs font-bold uppercase tracking-wider block mb-0.5"
              >
                Published Insights
              </span>
              <h2 class="text-xl md:text-2xl font-bold text-[#1C2D5B]">
                Articles by {{ author?.full_name }}
              </h2>
            </div>
            <p v-if="posts.length" class="text-xs text-gray-500">
              Showing {{ posts.length }}
              {{ posts.length === 1 ? "post" : "posts" }}
            </p>
          </div>

          <div
            v-if="posts.length"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            <article
              v-for="post in posts"
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
                  <div class="flex flex-wrap gap-1.5 mb-2">
                    <span
                      v-if="post.category"
                      class="bg-[#1C2D5B] text-white px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm"
                    >
                      {{ post.category.name }}
                    </span>
                    <span
                      v-for="tag in post.tags.slice(0, 2)"
                      :key="tag.id"
                      class="bg-slate-100 text-[#1C2D5B] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm"
                    >
                      {{ tag.name }}
                    </span>
                  </div>

                  <span
                    class="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    {{ formatDate(post.published_at) }}
                  </span>

                  <h3
                    class="blog-card-title text-[#1C2D5B] font-extrabold text-base tracking-wide mb-1.5 text-left sm:text-lg line-clamp-2"
                  >
                    {{ post.title }}
                  </h3>

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

          <div
            v-else
            class="text-center py-16 bg-white rounded-2xl border border-gray-100"
          >
            <p class="text-gray-500">
              No published articles from {{ author?.full_name }} yet.
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
  AuthorPostItem,
  AuthorProfile,
} from "~~/server/api/blogs/author/[slug].get";

interface AuthorPageResponse {
  author: AuthorProfile;
  posts: AuthorPostItem[];
}

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const {
  data: payload,
  pending,
  error,
} = await useFetch<AuthorPageResponse>(
  () => `/api/blogs/author/${encodeURIComponent(slug.value)}`,
  {
    key: () => `blog-author-${slug.value}`,
  },
);

const author = computed(() => payload.value?.author ?? null);
const posts = computed(() => payload.value?.posts ?? []);

const stripHtmlToText = (html?: string | null): string | undefined => {
  if (!html) return undefined;
  const cleaned = html
    .replace(/<[^>]*>/g, " ")
    .replace(/ /gi, " ")
    .replace(/&/gi, "&")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/"/gi, '"')
    .replace(/'|'/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length ? cleaned : undefined;
};

const bioPlainText = computed(() => stripHtmlToText(author.value?.bio));

const socialEntries = computed(() => {
  const links = author.value?.social_links;
  if (!links || typeof links !== "object") return [];

  const iconMap: Record<string, string> = {
    facebook: "fab fa-facebook-f",
    instagram: "fab fa-instagram",
    linkedin: "fab fa-linkedin-in",
    twitter: "fab fa-x-twitter",
    x: "fab fa-x-twitter",
    youtube: "fab fa-youtube",
    website: "fas fa-globe",
  };

  return Object.entries(links)
    .filter(([, url]) => typeof url === "string" && url.trim().length > 0)
    .map(([key, url]) => {
      const normalized = key.toLowerCase();
      return {
        key,
        label: normalized === "x" || normalized === "twitter" ? "X" : key,
        url: String(url).trim(),
        icon: iconMap[normalized] || "fas fa-link",
      };
    });
});

const siteUrl = "https://festive.express";
const authorUrl = computed(
  () => `${siteUrl}/blogs/author/${encodeURIComponent(slug.value)}`,
);
const personId = computed(() => `${authorUrl.value}#person`);

const pageTitle = computed(() =>
  author.value?.full_name
    ? `${author.value.full_name}${author.value.job_title ? ` — ${author.value.job_title}` : ""} | Festive Express`
    : "Author | Festive Express",
);

const pageDescription = computed(
  () =>
    bioPlainText.value ||
    (author.value?.full_name
      ? `Read articles and insights by ${author.value.full_name} at Festive Express.`
      : "Explore articles and insights from Festive Express."),
);

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription,
  ogImage: () =>
    author.value?.display_photo_url || `${siteUrl}/Images/festive-express.png`,
  ogUrl: authorUrl,
  ogType: "profile",
  twitterCard: "summary_large_image",
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: () =>
    author.value?.display_photo_url || `${siteUrl}/Images/festive-express.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": authorUrl.value,
          url: authorUrl.value,
          name: pageTitle.value,
          mainEntity: {
            "@type": "Person",
            "@id": personId.value,
            name: author.value?.full_name,
            url: authorUrl.value,
            ...(author.value?.job_title
              ? { jobTitle: author.value.job_title }
              : {}),
            ...(bioPlainText.value ? { description: bioPlainText.value } : {}),
            ...(author.value?.display_photo_url
              ? { image: author.value.display_photo_url }
              : {}),
            ...(socialEntries.value.length
              ? { sameAs: socialEntries.value.map((s) => s.url) }
              : {}),
            worksFor: {
              "@type": "Organization",
              name: "Festive Express",
              url: siteUrl,
            },
          },
        }),
      ),
    },
  ],
});

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
.blog-card-title {
  text-shadow:
    -1px -1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff,
    0 2px 6px rgba(28, 45, 91, 0.35);
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
