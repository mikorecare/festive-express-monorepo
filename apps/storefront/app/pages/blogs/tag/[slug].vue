<template>
  <div class="min-h-screen bg-[#F8F9FA] pb-12 md:pb-16 font-sans text-gray-900">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center min-h-[60vh]">
      <div
        class="w-12 h-12 border-4 border-[#F49321] border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !data" class="text-center py-32 px-4">
      <h1 class="text-4xl font-bold text-[#1C2D5B] mb-4">Tag Not Found</h1>
      <p class="text-gray-600 mb-8">
        The topic you're looking for doesn't exist or has been removed.
      </p>
      <NuxtLink
        to="/blogs"
        class="inline-flex items-center text-[#F49321] font-bold hover:underline"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Blog
      </NuxtLink>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Hero Header -->
      <div class="w-full bg-white border-b border-gray-200">
        <div class="max-w-[1440px] mx-auto px-4 py-8 md:py-12">
          <NuxtLink
            to="/blogs"
            class="text-sm font-semibold text-gray-500 hover:text-[#F49321] transition-colors inline-flex items-center mb-4"
          >
            <i class="fas fa-chevron-left mr-2 text-xs"></i> Back to all
            Insights
          </NuxtLink>
          <h1 class="text-3xl md:text-5xl font-bold text-[#1C2D5B] mb-2">
            Tagged: <span class="text-[#F49321]">#{{ data.tag.name }}</span>
          </h1>
          <p class="text-gray-600 text-sm md:text-lg max-w-2xl">
            Explore all articles related to this topic.
          </p>
        </div>
      </div>

      <!-- Post Grid -->
      <div class="max-w-[1440px] mx-auto px-4 mt-8">
        <div
          v-if="data.posts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <article
            v-for="post in data.posts"
            :key="post.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-shadow"
          >
            <NuxtLink :to="`/blogs/${post.slug}`" class="flex flex-col h-full">
              <div class="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  v-if="post.featured_image"
                  :src="post.featured_image"
                  :alt="post.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="p-5 flex flex-col flex-1">
                <span
                  v-if="post.category"
                  class="bg-[#1C2D5B] text-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm w-fit mb-3"
                >
                  {{ post.category.name }}
                </span>
                <h4
                  class="text-lg md:text-xl font-bold text-[#1C2D5B] leading-snug mb-2 group-hover:text-[#F49321] transition-colors line-clamp-2"
                >
                  {{ post.title }}
                </h4>
                <p
                  class="text-gray-600 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 flex-1"
                >
                  {{ post.summary }}
                </p>
                <span
                  class="inline-flex items-center text-xs font-bold text-[#1C2D5B] uppercase tracking-wide group-hover:text-[#F49321] transition-colors mt-auto"
                >
                  Continue Reading
                  <i class="fas fa-chevron-right ml-2 text-[8px]"></i>
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>
        <div
          v-else
          class="text-center py-20 bg-white rounded-2xl border border-gray-100"
        >
          <p class="text-gray-500">No posts found for this tag.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const tagSlug = route.params.slug;

const { data, pending, error } = await useFetch<{
  tag: { name: string; slug: string };
  posts: any[];
}>(`/api/blogs/tag/${tagSlug}`, {
  key: `tag-${tagSlug}`,
});

useSeoMeta({
  title: () =>
    data.value?.tag
      ? `#${data.value.tag.name} Articles | Festive Express`
      : "Blog Tag",
  description: () =>
    data.value?.tag
      ? `Read all our latest insights about ${data.value.tag.name}.`
      : "Read our latest insights.",
});
</script>
