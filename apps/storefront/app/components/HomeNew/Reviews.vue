<template>
  <section
    class="relative w-full py-12 sm:py-16 lg:py-20 overflow-hidden"
    aria-labelledby="reviews-heading"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-[url('/New/Reviews/reviews-bg.webp')] bg-cover bg-center bg-no-repeat"
      aria-hidden="true"
    ></div>

    <div class="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div v-fade class="text-start lg:text-left mb-8 lg:mb-10">
        <p
          class="text-[#F49321] font-extrabold text-lg sm:text-xl lg:text-2xl tracking-wide mb-2 [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
        >
          What Customers Say
        </p>
        <h2
          id="reviews-heading"
          class="text-[1.5rem] sm:text-4xl lg:text-5xl font-extrabold text-[#1C2D5B] leading-[1.15] mb-3 [text-shadow:_0_4px_10px_rgba(28,45,91,0.45)]"
        >
          Five-Star Service Across Every Lighting Project
        </h2>
        <p
          class="text-[#1C2D5B] font-semibold tracking-wide text-sm sm:text-base lg:text-lg"
        >
          See why homeowners and businesses trust
          <strong class="font-extrabold text-lg tracking-wide">
            Festive Express
          </strong>
          for professional holiday lighting services.
        </p>
      </div>

      <!-- Reviews carousel -->
      <div class="relative py-1">
        <div
          ref="scrollRef"
          class="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide scroll-px-4 px-4 sm:mx-0 sm:px-0 sm:scroll-px-0"
          style="scrollbar-width: none; -ms-overflow-style: none"
          @mouseenter="pauseAutoScroll"
          @mouseleave="resumeAutoScroll"
          @touchstart.passive="pauseAutoScroll"
          @touchend.passive="resumeAutoScroll"
          @focusin="pauseAutoScroll"
          @focusout="resumeAutoScroll"
        >
          <article
            v-for="(review, i) in reviews"
            :key="i"
            v-fade
            class="snap-center sm:snap-start shrink-0 w-[85vw] max-w-[460px] sm:w-[340px] lg:w-[calc((100%-2rem)/3)] bg-[#1C2D5B] rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none shadow-[0_6px_24px_rgba(28,45,91,0.12)] overflow-hidden h-[300px] flex flex-row transition-shadow duration-200 hover:shadow-[0_12px_28px_rgba(28,45,91,0.18)]"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <!-- LEFT COLUMN — 45% -->
            <div class="w-[50%] shrink-0 flex flex-col bg-white">
              <!-- Square photo, flush to top-left -->
              <div class="w-full aspect-square bg-gray-100 overflow-hidden">
                <img
                  v-if="review.image"
                  :src="review.image"
                  :alt="`Review by ${review.name}`"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <span
                  v-else
                  class="w-full h-full flex items-center justify-center text-3xl font-bold text-[#1C2D5B]"
                >
                  {{ review.name.charAt(0) }}
                </span>
              </div>

              <!-- Name + location below photo -->
              <div class="px-3 pt-2">
                <p
                  class="font-bold text-[#1C2D5B] text-sm leading-tight truncate"
                  :title="review.name"
                >
                  {{ review.name }}
                </p>
                <p
                  class="text-[10px] font-semibold text-black opacity-80 mt-0.5 leading-snug break-words"
                >
                  {{ review.location }}
                </p>
              </div>

              <!-- Stars + Google icon — pinned to bottom -->
              <div
                class="mt-auto px-3 pt-2 pb-3 flex flex-row items-center gap-2 flex-wrap"
              >
                <div
                  class="clay-stars w-fit shrink-0"
                  role="img"
                  :aria-label="`5 out of 5 stars`"
                >
                  <i
                    v-for="s in 5"
                    :key="s"
                    class="fa-solid fa-star w-4 h-4 star-clay"
                    aria-hidden="true"
                  ></i>
                </div>
                <svg
                  class="w-4 h-4 shrink-0"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>
              </div>
            </div>

            <!-- SEPARATOR — vertical, orange then white -->
            <div class="shrink-0 flex flex-row">
              <div class="w-[5px] h-full bg-white shadow shadow-l-xl"></div>
              <div class="w-[5px] h-full bg-[#F49321]"></div>
            </div>

            <!-- RIGHT COLUMN — verbatim only -->
            <div class="p-3 flex-1 min-w-0 flex flex-col">
              <p class="text-sm text-white/90 leading-relaxed line-clamp-9">
                {{ review.text }}
              </p>

              <button
                type="button"
                class="mt-auto pt-3 self-start text-[#F49321] hover:text-[#ffb347] font-bold text-xs transition-colors min-h-[36px] flex items-center gap-1 tracking-wide"
                :aria-label="`Read full review for ${review.name}`"
                @click="openReview(review)"
              >
                Read more
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </article>
        </div>

        <!-- Left arrow -->
        <button
          type="button"
          class="hidden lg:flex absolute top-1/2 -left-5 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Previous reviews"
          @click="scrollByCard(-1)"
        >
          <svg
            class="w-4 h-4 text-[#1C2D5B]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <!-- Right arrow -->
        <button
          type="button"
          class="hidden lg:flex absolute top-1/2 -right-5 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Next reviews"
          @click="scrollByCard(1)"
        >
          <svg
            class="w-4 h-4 text-[#1C2D5B]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  </section>

  <!-- REVIEW MODAL -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
        >
          <div
            class="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-5 py-4 flex items-center justify-between z-10 shrink-0"
          >
            <div>
              <p
                class="text-[#F49321] font-extrabold text-sm tracking-wide mb-0.5"
              >
                What Customers Say
              </p>
              <h3
                id="modal-heading"
                class="text-lg sm:text-xl lg:text-2xl font-bold text-[#1C2D5B]"
              >
                Customer Reviews
              </h3>
            </div>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-700 text-2xl leading-none p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close reviews"
              @click="closeModal"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div ref="modalBodyRef" class="overflow-y-auto px-4 sm:px-5 py-4">
            <div class="space-y-3 sm:space-y-4">
              <article
                v-for="(review, i) in reviews"
                :key="i"
                :ref="(el) => registerModalCard(el, i)"
                class="bg-white rounded-xl border border-gray-100 p-4 shadow-[0_2px_10px_rgba(28,45,91,0.05)]"
              >
                <div class="flex items-start justify-between gap-2 mb-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      class="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center"
                    >
                      <img
                        v-if="review.image"
                        :src="review.image"
                        :alt="`Review by ${review.name}`"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        width="40"
                        height="40"
                      />
                      <span
                        v-else
                        class="w-full h-full flex items-center justify-center text-3xl font-bold text-[#1C2D5B]"
                      >
                        {{ review.name?.charAt(0) ?? "?" }}
                      </span>
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-[#1C2D5B] text-sm truncate">
                        {{ review.name }}
                      </p>
                      <p class="text-xs text-gray-500 truncate">
                        {{ review.location }}
                      </p>
                    </div>
                  </div>
                  <svg
                    class="w-5 h-5 shrink-0 mt-1"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                </div>

                <div
                  class="clay-stars w-fit mb-2"
                  :aria-label="`5 out of 5 stars`"
                  role="img"
                >
                  <svg
                    v-for="s in 5"
                    :key="s"
                    class="w-4 h-4 star-clay"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                    <circle cx="8" cy="7" r="1" fill="white" opacity="0.7" />
                  </svg>
                </div>

                <p
                  class="text-sm text-gray-700 leading-relaxed whitespace-pre-line"
                >
                  {{ review.text }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from "vue";

interface Review {
  name: string;
  location: string;
  text: string;
  image?: string;
}

const reviews: Review[] = [
  {
    name: "Tom Leonard",
    location: "St. Armand Circle, Long Boat Key, FL",
    text: "We gave Festive Lighting Pros a unique challenge when we started this and we had over 100 trees in a park to light plus we wanted to create a ceiling over the park. They came up with an ingenious idea to stream cables across the bar and hung over one hundred spheres from these cables. It turned out magical. Everybody loves it. And it's been a pleasure to work with someone that can actually think outside the box.",
    image: "/New/Reviews/Tom-Leonard.R9aNuc-q.webp",
  },
  {
    name: "Austin York",
    location: "Sun Outdoors, Sarasota, FL",
    text: "Hi my name is Austin from Sun Outdoors Sarasota and we use Festive Lighting Pros for our holiday lighting needs. From the very beginning, Matt and his team are professional, timely, and courteous.",
    image: "/New/Reviews/Austin-York.paittgJr.webp",
  },
  {
    name: "Mitch Good",
    location: "El Melvin Cocina Mexicana, Downtown Sarasota, FL",
    text: "I just want to give a quick shout out to Festive Lighting Pros. They've been with us for about a year now. They take care of all your maintenance. Our customers love it. We love it.",
    image: "/New/Reviews/Mitch-Good.CUnh5dH7.webp",
  },
  {
    name: "Kelly Johnson",
    location: "Kia of Port Charlotte",
    text: "They (Festive Lighting Pros) were professional. They were quick, they installed everything with safety in mind, and you can see how beautiful the results are.",
    image: "/New/Reviews/Kelly-Johnson.D7E2qk98.webp",
  },
  {
    name: "Jonnie and Tim Dwyer",
    location: "Lakewood Ranch, FL",
    text: "Festive Lighting Pros took away such tremendous stress by making our home look so beautiful for our grandchildren. The enchantment that they experienced was worth every penny. It gave us more time and more opportunities to enjoy the holidays rather than making it all work and Matt's installers, they were so professional.",
    image: "/New/Reviews/Dwyers.Fhz14vyW.webp",
  },
  {
    name: "Brad Gucciardo",
    location: "Bella Sole, Bradenton, FL",
    text: "They did an amazing job decorating my home to say that Festive Lighting Pros changed my entire attitude about Christmas specially this year is an understatement. This is incredible to come home to this every day is amazing. You will have a smile on your face, every morning every night when you come home.",
    image: "/New/Reviews/Brad-Gucciardo.UcbiY9kA.webp",
  },
  {
    name: "Dennis and Kathy Lasota",
    location: "Lakewood National Golf Course, Bradenton, FL",
    text: "This is our first year having our home completely decorated and had Festival Lighting Pros take care of it for us. We were very pleased with the end results and it saved my back and perhaps a spill on the ladder. And we are excited to show off our house.",
    image: "/New/Reviews/Lasotas.D48-FVY2.webp",
  },
  {
    name: "Neil Newsham",
    location: "Bradenton, FL",
    text: "I couldn't be more happy with the services provided by Festive Lighting Pros. They were very, very efficient, very, very professional, easy to deal with. We really liked the way our house turned out.",
    image: "/New/Reviews/Niel-Newshams.D9nvFpN1.webp",
  },
  {
    name: "Liz Hazeltine",
    location: "Sarasota, FL",
    text: "Hi, my name is Liz and we live in Sarasota. This was a new house and our first Christmas in it and we wanted it to look spectacular. So we hired Festive Lighting Pros and we got beyond our wildest dreams. They were easy to work with. And the house looks great and you can see for yourself.",
    image: "/New/Reviews/Liz-Hazeltine.x-axJl76.webp",
  },
  {
    name: "Darren and Amanda Arrington",
    location: "Miromar Lakes, Ft. Myers, FL",
    text: "We've been working with Festival Lighting Pros the last two years to come put up lights at our house. They suggest new things that we can add every year. We're a little bit biased, but we think we've got the best house in the neighborhood with lights and all the neighbors come by.",
    image: "/New/Reviews/Arringtons.FrDOaoRb.webp",
  },
];

const scrollRef = ref<HTMLElement | null>(null);
const modalBodyRef = ref<HTMLElement | null>(null);
const modalCardRefs = ref<Record<number, HTMLElement | null>>({});
const showModal = ref(false);

/* ---------- AUTO SCROLL ---------- */
const AUTO_SCROLL_INTERVAL = 4000; // ms between advances
let autoScrollTimer: ReturnType<typeof setInterval> | null = null;
const isPaused = ref(false);

const startAutoScroll = () => {
  stopAutoScroll();
  autoScrollTimer = setInterval(() => {
    if (isPaused.value) return;
    if (!scrollRef.value) return;

    const el = scrollRef.value;
    const card = el.querySelector("article") as HTMLElement | null;
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width + 16; // gap-4 = 16px
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    // If we're at (or past) the end, loop back to start
    if (el.scrollLeft >= maxScrollLeft - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  }, AUTO_SCROLL_INTERVAL);
};

const stopAutoScroll = () => {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  }
};

const pauseAutoScroll = () => {
  isPaused.value = true;
};

const resumeAutoScroll = () => {
  isPaused.value = false;
};

/* ---------- EXISTING LOGIC ---------- */

const registerModalCard = (el: any, i: number) => {
  if (el) modalCardRefs.value[i] = el as HTMLElement;
};

const scrollByCard = (direction: number) => {
  if (!scrollRef.value) return;
  const card = scrollRef.value.querySelector("article");
  if (!card) return;
  const cardWidth = card.getBoundingClientRect().width + 16;
  scrollRef.value.scrollBy({
    left: direction * cardWidth,
    behavior: "smooth",
  });
};

const isLongReview = (text: string) => {
  return text.length > 180;
};

const openReview = (review: Review) => {
  const index = reviews.findIndex(
    (r) => r.name === review.name && r.text === review.text,
  );
  showModal.value = true;

  nextTick(() => {
    const card = modalCardRefs.value[index];
    if (card && modalBodyRef.value) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
};

const closeModal = () => {
  showModal.value = false;
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && showModal.value) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  startAutoScroll();
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
  stopAutoScroll();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Claymorphic star effect */
.star-clay {
  display: inline-block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))
    drop-shadow(0 1px 0 rgba(255, 255, 255, 0.7));
  transition: transform 0.1s ease;
  color: #f49321;
  fill: #f49321;
  stroke: rgba(255, 255, 255, 0.4);
  stroke-width: 0.3;
}

.star-clay:hover {
  transform: scale(1.05);
}

.clay-stars {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px 4px 6px;
  border-radius: 40px;
  background: #f8f2e7;
  box-shadow:
    inset 0 2px 6px rgba(255, 255, 255, 0.8),
    inset 0 -3px 6px rgba(0, 0, 0, 0.05),
    0 6px 12px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.03);
}

.line-clamp-7,
.line-clamp-8,
.line-clamp-9,
.line-clamp-10,
.line-clamp-11,
.line-clamp-12 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-7 {
  -webkit-line-clamp: 7;
}
.line-clamp-8 {
  -webkit-line-clamp: 8;
}
.line-clamp-9 {
  -webkit-line-clamp: 9;
}
.line-clamp-10 {
  -webkit-line-clamp: 10;
}
.line-clamp-11 {
  -webkit-line-clamp: 11;
}
.line-clamp-12 {
  -webkit-line-clamp: 12;
}
</style>
