<template>
  <section
    class="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden bg-[#1C2F5B] px-4 py-16 font-sans text-white sm:px-6 lg:py-24"
  >
    <!-- Background Image with Dark Overlay -->
    <div v-if="bgImage" class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${bgImage})` }"
      ></div>
      <!-- Dark blue overlay to match Figma -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#1C2F5B]/90 via-[#1C2F5B]/20 to-transparent"
      ></div>
    </div>

    <!-- Main Container -->
    <div
      class="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
    >
      <!-- Left: Text & Actions (Aligned Left, matching Figma) -->
      <div class="flex flex-col items-start text-left">
        <span
          v-if="subtitle"
          class="mb-3 text-sm font-bold uppercase tracking-widest text-white"
        >
          {{ subtitle }}
        </span>

        <h1
          class="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]"
        >
          <span class="block text-white">{{ title }}</span>
          <span class="block text-[#f49321]">{{ titleHighlight }}</span>
        </h1>

        <p
          v-if="description"
          class="mb-8 max-w-md text-base leading-relaxed text-slate-200 sm:text-lg"
        >
          {{ description }}
        </p>

        <div class="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <NuxtLink
            v-if="primaryBtn"
            :to="primaryBtn.link"
            class="btn-3d-glossy btn-3d-glossy-orange inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#1c2d58] shadow-[0_4px_6px_rgba(244,147,33,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#ff9e2c] hover:shadow-[0_6px_12px_rgba(244,147,33,0.3)]"
          >
            {{ primaryBtn.text }}
          </NuxtLink>

          <NuxtLink
            v-if="secondaryBtn"
            :to="secondaryBtn.link"
            class="btn-3d-glossy btn-3d-glossy-transparent inline-flex items-center justify-center rounded-full border-2 border-white  px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#1c2d58]"
          >
            {{ secondaryBtn.text }}
          </NuxtLink>
        </div>
      </div>

      <!-- Right: Featured Image Showcase -->
      <div
        v-if="featuredImage"
        class="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
      >
        <div
          class="flex w-full flex-col overflow-hidden rounded-2xl border-[3px] border-[#f49321] bg-[#0f172a]"
        >
          <img
            :src="featuredImage.image"
            :alt="featuredImage.imageAlt || featuredImage.title"
            class="aspect-[4/3] w-full object-cover sm:aspect-video"
            loading="eager"
          />

          <!-- Orange Featured Badge -->
          <div
            class="flex w-full flex-col gap-1.5 bg-[#f49321] px-4 py-2 text-sm font-semibold text-[#1c2d58] sm:flex-row sm:items-center"
          >
            <span
              class="text-xs font-extrabold uppercase tracking-wider whitespace-nowrap"
            >
              Featured Project:
            </span>

            <span class="flex flex-wrap items-center gap-2 text-sm text-white">
              <span>{{ featuredImage.title }}</span>

              <span
                v-if="featuredImage.category"
                aria-hidden="true"
                class="text-[#1c2d58]/50"
                >|</span
              >

              <span
                v-if="featuredImage.category"
                class="inline-flex items-center rounded bg-[#1c2d58] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
              >
                {{ featuredImage.category }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useHead } from "#imports";

const props = defineProps({
  bgImage: { type: String, default: "/New/Banner/bg-gallery.png" },
  subtitle: { type: String, default: "Project Gallery" },
  title: { type: String, default: "A Little Light." },
  titleHighlight: { type: String, default: "A Lasting Impression." },
  description: {
    type: String,
    default:
      "Explore lighting installations designed to make homes, businesses, and celebrations shine.",
  },
  primaryBtn: {
    type: Object,
    default: () => ({ text: "View Packages", link: "/packages" }),
  },
  secondaryBtn: {
    type: Object,
    default: () => ({ text: "Preview Your Home", link: "/preview-your-home" }),
  },
  featuredImage: {
    type: Object,
    required: true,
  },
});

// Auto-generate ImageObject Schema for SEO based on the featured image
const imageSchema = computed(() => {
  const p = props.featuredImage;
  if (!p || !p.image) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: p.image.startsWith("http")
      ? p.image
      : `https://festive.express${p.image}`,
    name: p.title,
    description: p.imageAlt || p.title,
    creator: {
      "@type": "Organization",
      name: p.seo?.creator || "Festive Express",
    },
    creditText: p.seo?.creator || "Festive Express",
    copyrightNotice: p.seo?.copyrightNotice || "© 2026 Festive Express",
    license: p.seo?.license || "https://festive.express/terms",
    acquireLicensePage:
      p.seo?.acquireLicensePage || "https://festive.express/contact",
    datePublished: p.seo?.datePublished,
  };
});

useHead({
  script: computed(() =>
    [
      imageSchema.value
        ? {
            type: "application/ld+json",
            innerHTML: JSON.stringify(imageSchema.value),
          }
        : {},
    ].filter(Boolean),
  ),
});
</script>
