<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade>
              About <span class="text-brand-orange">Festive Express</span>
            </h1>
            <p v-fade class="breadcrumb">
              {{ data?.subtitle || "" }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Content Section -->
    <section class="bg-white text-slate-800 py-20">
      <div
        class="container flex flex-col lg:flex-row items-center gap-10 lg:gap-12"
      >
        <!-- Content Left -->
        <div class="flex-1">
          <div
            v-if="descriptionHtml"
            class="about-body"
            v-html="descriptionHtml"
          />
        </div>

        <!-- Image Right -->
        <div class="flex-1 flex justify-center w-full">
          <div
            v-if="sideImage"
            class="about-image relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full -rotate-12 border-[10px] border-brand-orange shadow-[0_15px_25px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.1)] overflow-hidden will-change-transform"
          >
            <img
              :src="sideImage"
              alt="Festive Express Holiday Lighting"
              class="w-full h-full object-cover rotate-12 scale-110 origin-center pointer-events-none"
            />
            <div
              class="absolute -top-[50%] -left-[150%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-[25deg] pointer-events-none animate-shine"
            />
          </div>
        </div>
      </div>
    </section>

    <HomeFeaturedPackage2 />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "About Festive Express",
});

type AboutUsContent = {
  id?: string;
  banner_image_url?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  description_image_url?: string | null;
};

const supabase = useSupabaseClient();
const data = ref<AboutUsContent | null>(null);

const descriptionHtml = computed(() => data.value?.description || "");
const sideImage = computed(
  () =>
    data.value?.description_image_url ||
    "/Images/Gallery/Festive-Images-14.webp",
);

// Optional: use CMS title for hero instead — comment above and use:
// const heroParts = computed(() => {
//   const t = (data.value?.title || 'About Festive Express').trim().split(/\s+/)
//   if (t.length < 2) return { rest: '', last: t[0] || 'About' }
//   return { rest: t.slice(0, -1).join(' '), last: t[t.length - 1] }
// })

const load = async () => {
  try {
    const { data: row, error } = await supabase
      .from("about_us")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    data.value = (row ?? null) as AboutUsContent | null;
  } catch (e) {
    console.error(e);
    data.value = null;
  }
};

onMounted(load);
</script>

<style scoped>
.about-body :deep(p) {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1rem;
}

.about-body :deep(p strong),
.about-body :deep(.intro-orange) {
  color: #f49322;
  font-size: 1.25rem;
  font-weight: 600;
}

.about-body :deep(blockquote),
.about-body :deep(.about-quote) {
  border-left: 4px solid #f49322;
  padding-left: 1rem;
  margin-top: 1.5rem;
  color: #0c2340;
  font-weight: 600;
  font-size: 1.05rem;
  line-height: 1.7;
}
.about-image {
  flex: 1;
  display: flex;
  justify-content: center;

  position: relative;

  /* Set your desired size for the total circular container */
  width: 400px;
  height: 400px;

  /* 1. Make it perfectly circular and angled (rotated) */
  border-radius: 50%;
  transform: rotate(-15deg); /* Recreates the specific angle in the image */

  /* 2. Apply the solid orange border */
  border: 10px solid #ff7a00; /* Matching your primary orange */

  /* 3. Recreates the double-shadow effect for depth */
  box-shadow:
    0 15px 25px rgba(0, 0, 0, 0.2),
    /* Soft deep shadow */ 0 5px 10px rgba(0, 0, 0, 0.1); /* Sharper near shadow */

  /* 4. Ensure everything inside (the image) stays within the circle */
  overflow: hidden;

  /* Required for smooth rendering during animations or scrolling */
  will-change: transform;

  position: relative;
  overflow: hidden;
}

.about-image img {
  width: 100%;
  /* max-width: 550px; */

  height: 100%;

  /* Re-align the image, but un-rotate it slightly so the image content 
     (the people) appears upright while the container circle is angled. 
     Adjust the rotation and translate values slightly if needed. */
  transform: rotate(15deg) scale(1.1); /* Un-rotates the content; slightly zooms to cover edges */

  transform-origin: center center;
  object-fit: cover; /* Ensures the image covers the entire circular area */
  pointer-events: none; /* Recommended if you have complex interactions */
}

.about-image::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -150%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    60deg,
    rgba(255, 255, 255, 0) 20%,
    rgba(255, 255, 255, 0.08) 40%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0.08) 60%,
    rgba(255, 255, 255, 0) 80%
  );
  transform: rotate(25deg);
  pointer-events: none;
  animation: glossyShineContinuous 3s linear infinite;
}

.animate-shine {
  animation: glossyShineContinuous 3s linear infinite;
}
</style>
