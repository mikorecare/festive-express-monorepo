<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen && project"
        class="fixed inset-0 z-[99999] flex flex-col bg-[#1C2D5B] md:bg-[#1C2D5B]/95 md:backdrop-blur-md"
        @click.self="$emit('close')"
      >
        <!-- Top Header (Always visible) -->
        <div
          class="flex items-start justify-between p-4 md:p-6 md:max-w-6xl md:mx-auto w-full z-50 shrink-0"
        >
          <div class="text-white pr-4">
            <h2
              class="text-xl md:text-3xl font-extrabold tracking-wide line-clamp-1"
            >
              {{ project.title }}
            </h2>
            <div
              class="flex flex-wrap items-center gap-2 text-xs md:text-base font-bold text-[#F49321] mt-1"
            >
              <span v-if="project.category">{{ project.category.name }}</span>
              <span
                v-if="project.location_city || project.location_state"
                class="text-white/60"
                >•</span
              >
              <span class="text-white/80">
                {{ project.location_city
                }}<template
                  v-if="project.location_city && project.location_state"
                  >, </template
                >{{ project.location_state }}
              </span>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors shrink-0"
          >
            <i class="fas fa-times text-lg md:text-xl"></i>
          </button>
        </div>

        <!-- Image Area (Grows to fill space) -->
        <div
          class="relative flex-1 w-full flex items-center justify-center overflow-hidden group md:max-w-6xl md:mx-auto md:rounded-xl md:shadow-2xl bg-black/40 md:bg-black"
        >
          <Transition :name="slideDirection" mode="out-in">
            <img
              :key="activeImage.id || currentIndex"
              :src="activeImage.image_url"
              :alt="activeImage.alt_text || project.title"
              class="absolute inset-0 w-full h-full object-contain md:object-cover"
            />
          </Transition>

          <!-- Navigation Arrows (Desktop Only) -->
          <template v-if="project.images && project.images.length > 1">
            <button
              @click.stop="prevImage"
              class="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/50 hover:bg-[#F49321] text-white rounded-full items-center justify-center backdrop-blur-md transition-all z-20"
            >
              <i class="fas fa-chevron-left text-xl"></i>
            </button>
            <button
              @click.stop="nextImage"
              class="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/50 hover:bg-[#F49321] text-white rounded-full items-center justify-center backdrop-blur-md transition-all z-20"
            >
              <i class="fas fa-chevron-right text-xl"></i>
            </button>
          </template>

          <!-- Meta Details Overlay (Bottom) -->
          <div
            class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-24 pointer-events-none z-10"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-if="activeImage.room_or_area"
                class="bg-[#F49321] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              >
                {{ activeImage.room_or_area }}
              </span>
              <span
                v-if="project.tags && project.tags.length > 0"
                v-for="tag in project.tags.slice(0, 3)"
                :key="tag.id"
                class="bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              >
                {{ tag.name }}
              </span>
            </div>

            <h3
              v-if="activeImage.title || activeImage.caption"
              class="text-white text-lg md:text-2xl font-bold mt-2 md:mt-3"
            >
              {{ activeImage.title || activeImage.caption }}
            </h3>
            <p
              v-if="activeImage.description"
              class="text-white/70 text-sm mt-1 line-clamp-2"
            >
              {{ activeImage.description }}
            </p>
          </div>
        </div>

        <!-- Bottom Controls -->
        <div
          class="shrink-0 flex flex-col items-center gap-4 p-4 md:p-6 pb-8 md:max-w-6xl md:mx-auto w-full z-50"
        >
          <!-- Mobile Arrows / Dots -->
          <div
            v-if="project.images && project.images.length > 1"
            class="flex md:hidden items-center justify-center gap-6 w-full"
          >
            <button
              @click.stop="prevImage"
              class="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="text-white/60 text-sm font-medium">
              {{ currentIndex + 1 }} / {{ project.images.length }}
            </span>
            <button
              @click.stop="nextImage"
              class="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <!-- Call to Action Button -->
          <NuxtLink
            to="/packages"
            class="w-full btn-3d-glossy btn-3d-glossy-orange md:w-auto inline-flex items-center justify-center gap-2 text-white font-bold text-base md:text-lg px-8 py-3.5 md:py-4 rounded-full shadow-[0_0_20px_rgba(244,147,33,0.4)] transition-all md:hover:scale-105"
          >
            I want something like this <i class="fas fa-arrow-right"></i>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

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
  category?: { id: number; name: string; slug: string } | null;
  location_city: string | null;
  location_state: string | null;
  tags?: { id: number; name: string; slug: string }[];
  images?: ProjectImage[];
}

const props = defineProps<{
  isOpen: boolean;
  project: Project | null;
  initialIndex: number;
}>();

const emit = defineEmits(["close"]);

const currentIndex = ref(props.initialIndex);
const slideDirection = ref("slide-left");

const activeImage = computed(() => {
  const fallback = {
    id: "",
    image_url: "",
    alt_text: "Project Image",
    title: null,
    caption: null,
    room_or_area: null,
    description: null,
  };

  if (
    !props.project ||
    !props.project.images ||
    props.project.images.length === 0
  ) {
    return fallback;
  }

  return (
    props.project.images[currentIndex.value] ||
    props.project.images[0] ||
    fallback
  );
});

watch(
  () => props.initialIndex,
  (newVal) => {
    currentIndex.value = newVal;
  },
);

const nextImage = () => {
  if (!props.project?.images || props.project.images.length === 0) return;
  slideDirection.value = "slide-left";
  currentIndex.value = (currentIndex.value + 1) % props.project.images.length;
};

const prevImage = () => {
  if (!props.project?.images || props.project.images.length === 0) return;
  slideDirection.value = "slide-right";
  currentIndex.value =
    (currentIndex.value - 1 + props.project.images.length) %
    props.project.images.length;
};
</script>

<style scoped>
/* Fade Modal Background */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Left (Next) */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Entering from the right (Next) */
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Entering from the left (Prev) */
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
