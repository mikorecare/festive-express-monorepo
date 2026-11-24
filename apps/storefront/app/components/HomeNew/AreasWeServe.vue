<template>
  <section
    id="service-areas"
    aria-labelledby="service-areas-heading"
    class="relative overflow-hidden border-t-8 border-brand-orange bg-white bg-[url('/Images/LV.webp')] bg-cover bg-center py-6 md:px-6 md:py-16"
  >
    <div class="mx-auto max-w-[1280px]">
      <!-- Heading -->
      <div v-fade class="mx-auto mb-6 max-w-4xl px-4 text-center md:mb-10">
        <p
          class="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-orange md:text-sm"
        >
          Proudly Serving Southwest Florida
        </p>

        <h2
          id="service-areas-heading"
          class="text-3xl font-extrabold leading-tight tracking-wide text-[#1C2D5B] md:text-5xl lg:text-6xl"
        >
          Holiday Lighting
          <span
            class="mt-1.5 block text-brand-orange [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_6px_rgba(28,45,91,0.35)] lg:[text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
          >
            Near You
          </span>
        </h2>

        <p
          class="mx-auto mt-3 max-w-3xl text-sm font-medium leading-relaxed text-[#3b4a6b] md:mt-5 md:text-lg"
        >
          From Sarasota and Bradenton to surrounding Gulf Coast communities,
          Festive Express brings professional holiday lighting rentals and
          installation to your neighborhood.
        </p>
      </div>
      <!-- Collection Header -->
      <div class="mb-3 flex items-center justify-between px-4 md:px-0">
        <h3
          class="border-l-4 border-brand-orange pl-2 text-sm font-extrabold text-[#1C2D5B] md:text-xl"
        >
          Explore Our Service Areas
        </h3>

        <span class="text-xs font-bold text-[#1C2D5B]/60 md:hidden">
          {{ activeIndex + 1 }} / {{ serviceAreas.length }}
        </span>
      </div>

      <!-- Mobile Carousel / Desktop Grid -->
      <div
        ref="rail"
        @scroll.passive="updateActive"
        class="flex w-full snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-[13%] pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:p-0 xl:grid-cols-4"
      >
        <article
          v-for="(area, index) in serviceAreas"
          :key="area.county"
          data-area
          class="group flex min-w-0 shrink-0 basis-full snap-center flex-col overflow-hidden rounded-xl border border-[#1C2D5B]/10 bg-white shadow-[0_4px_16px_rgba(28,45,91,0.08)] transition-shadow hover:shadow-lg"
        >
          <!-- Editorial Regional Header -->
          <div
            class="relative isolate flex min-h-[120px] flex-col justify-between overflow-hidden bg-[#1C2D5B] p-4 text-white md:min-h-[150px] md:p-5"
          >
            <!-- Geographic Pattern -->
            <div
              aria-hidden="true"
              class="absolute inset-0 -z-10 opacity-10 bg-[repeating-radial-gradient(ellipse_at_100%_0%,transparent_0px,transparent_13px,white_14px,transparent_15px)]"
            />

            <!-- Oversized Index -->
            <span
              aria-hidden="true"
              class="absolute -bottom-7 right-0 -z-10 text-[130px] font-black leading-none text-white/[0.07]"
            >
              0{{ index + 1 }}
            </span>

            <div class="flex items-center justify-between">
              <span
                class="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-orange"
              >
                <i class="fas fa-map-marker-alt mr-1" />
                {{ area.region }}
              </span>

              <span class="text-xs font-semibold text-white/50">
                FL / 0{{ index + 1 }}
              </span>
            </div>

            <h3
              class="my-3 text-2xl font-extrabold uppercase leading-none tracking-tight"
            >
              {{ area.title }}
              <span
                class="mt-1 block text-xs font-bold tracking-[0.25em] text-white/80"
              >
                {{ area.suffix }}
              </span>
            </h3>

            <p
              class="flex items-center gap-1.5 text-[10px] font-semibold text-white/90"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              {{ area.subtitle }}
            </p>
          </div>

          <!-- City Directory -->
          <div
            class="flex flex-1 flex-col border-t-4 border-brand-orange p-3 md:p-4"
          >
            <div class="mb-3 flex items-center gap-2">
              <h4
                class="shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-[#1C2D5B]"
              >
                Communities We Serve
              </h4>
              <span class="h-px flex-1 bg-[#1C2D5B]/10" />
            </div>

            <ul class="mb-4 grid grid-cols-2 content-start gap-x-2 gap-y-2.5">
              <li
                v-for="city in area.cities"
                :key="city"
                class="flex items-start gap-1.5 text-[11px] font-semibold leading-snug text-[#1C2D5B] md:text-xs"
              >
                <i
                  class="fas fa-check mt-0.5 shrink-0 text-[9px] text-brand-orange"
                />
                {{ city }}
              </li>
            </ul>

            <!-- Aligned Footer -->
            <div
              class="mt-auto flex items-center justify-between gap-2 border-t border-[#1C2D5B]/10 pt-3"
            >
              <div class="flex items-baseline gap-1">
                <strong class="text-xl font-extrabold text-[#1C2D5B]">
                  {{ area.cities.length }}
                </strong>
                <span class="text-[10px] font-semibold text-slate-500">
                  Communities
                </span>
              </div>

              <a
                href="#service-areas-form"
                class="flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-[#1C2D5B] hover:text-brand-orange"
              >
                Check address
                <i class="fas fa-arrow-right text-brand-orange" />
              </a>
            </div>
          </div>
        </article>
      </div>

      <!-- Mobile Pagination -->
      <div class="flex items-center justify-center gap-1 md:hidden">
        <button
          v-for="(area, index) in serviceAreas"
          :key="area.county"
          type="button"
          :aria-label="`Show ${area.county}`"
          :aria-current="activeIndex === index ? 'true' : undefined"
          class="flex h-7 items-center px-1"
          @click="goTo(index)"
        >
          <span
            class="h-1.5 rounded-full transition-all"
            :class="
              activeIndex === index
                ? 'w-6 bg-brand-orange'
                : 'w-1.5 bg-[#1C2D5B]/20'
            "
          />
        </button>
      </div>

      <!-- Coverage Information -->
      <div
        v-fade
        class="relative isolate mx-4 mt-5 overflow-hidden rounded-2xl border-b-4 border-brand-orange bg-[#1C2D5B] px-4 py-5 shadow-[0_8px_24px_rgba(28,45,91,0.2)] md:mx-0 md:mt-8 md:px-10 md:py-8"
      >
        <!-- Subtle Geographic Background -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-[repeating-radial-gradient(circle_at_0%_50%,transparent_0px,transparent_28px,white_29px,transparent_30px)]"
        />

        <div
          aria-hidden="true"
          class="absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-brand-orange/10 blur-[80px]"
        />

        <div class="flex items-center gap-4 md:gap-10">
          <!-- Service Radius Graphic -->
          <div
            class="relative flex aspect-square w-[105px] shrink-0 items-center justify-center md:w-[170px]"
          >
            <div
              class="absolute inset-0 rounded-full border border-dashed border-brand-orange/30"
            />

            <div
              class="absolute inset-[7%] rounded-full border-2 border-brand-orange/70 bg-brand-orange/5"
            />

            <div
              class="absolute inset-[16%] rounded-full border border-dashed border-brand-orange/25"
            />

            <div
              class="absolute inset-[25%] rounded-full border border-white/10"
            />

            <!-- Radius Points -->
            <span
              class="absolute right-[15%] top-[15%] h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_10px_#F49321]"
            />

            <span
              class="absolute bottom-[15%] left-[15%] h-1.5 w-1.5 rounded-full bg-brand-orange"
            />

            <!-- Radius Value -->
            <div class="relative text-center">
              <strong
                class="block text-[2.8rem] font-black leading-none tracking-tighter text-brand-orange md:text-7xl"
              >
                45
              </strong>

              <span
                class="block text-[9px] font-extrabold tracking-[0.2em] text-white md:text-xs"
              >
                MINUTES
              </span>
            </div>
          </div>

          <!-- Coverage Heading -->
          <div class="min-w-0 flex-1">
            <p
              class="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-brand-orange md:text-xs md:tracking-[0.2em]"
            >
              Locally Based. Widely Connected.
            </p>

            <h3
              class="mb-2 text-xl font-extrabold leading-tight text-white md:mb-3 md:text-4xl lg:text-5xl"
            >
              From Sarasota,
              <span class="block text-brand-orange"> to your doorstep. </span>
            </h3>

            <p
              class="max-w-2xl text-[11px] font-medium leading-relaxed text-white/80 md:text-base"
            >
              Our primary service area extends approximately
              <strong class="font-extrabold text-white">
                45 minutes from our Sarasota location.
              </strong>
              Bringing professional holiday lighting closer to home.
            </p>
          </div>

          <!-- Desktop Decorative Truck -->
          <i
            class="fas fa-truck hidden shrink-0 -rotate-12 text-[100px] text-white/[0.06] lg:block"
            aria-hidden="true"
          />
        </div>

        <!-- Extended Coverage -->
        <div
          class="mt-4 flex items-center gap-3 border-t border-white/15 pt-3 md:mt-6 md:pt-5"
        >
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange md:h-10 md:w-10"
          >
            <i class="fas fa-map-marker-alt" aria-hidden="true" />
          </div>

          <p
            class="flex-1 text-[11px] font-medium leading-relaxed text-white/75 md:text-sm"
          >
            <strong class="font-bold text-white">
              Beyond our primary service area?
            </strong>
            Select extended areas may also be available depending on your
            property location, travel conditions, and scheduling.
          </p>

          <a
            href="#service-areas-form"
            class="hidden shrink-0 items-center gap-2 rounded-full border border-brand-orange px-5 py-2.5 text-sm font-bold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white md:inline-flex"
          >
            Check Coverage
            <i class="fas fa-arrow-right" aria-hidden="true" />
          </a>
        </div>
      </div>

      <!-- Address Checker -->
      <!-- Address Checker -->
      <div
        id="service-areas-form"
        v-fade
        class="relative mx-auto mt-8 w-[calc(100%-2rem)] max-w-3xl scroll-mt-24 rounded-2xl border border-[#1C2D5B]/10 border-t-4 border-t-brand-orange bg-white p-4 text-center shadow-[0_8px_30px_rgba(28,45,91,0.1)] md:mt-12 md:w-full md:p-8 lg:p-10"
      >
        <!-- Location Graphic -->
        <!-- Location Graphic -->
        <div class="mx-auto mb-3 w-[120px] md:mb-5 md:w-[160px]">
          <svg
            viewBox="0 0 120 85"
            class="h-auto w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <!-- Folded Map -->
            <path
              d="M5 28 L40 16 L80 28 L115 16 V68 L80 80 L40 68 L5 80Z"
              fill="#EDF0F6"
              stroke="#1C2D5B"
              stroke-opacity=".15"
            />

            <!-- Map Lines -->
            <path
              d="M40 16 V68 M80 28 V80 M5 50 L40 37 L80 51 L115 39"
              stroke="#1C2D5B"
              stroke-opacity=".12"
            />

            <!-- Location Radius -->
            <ellipse
              cx="61"
              cy="55"
              rx="24"
              ry="12"
              fill="#F49321"
              opacity=".15"
            />

            <ellipse
              cx="61"
              cy="55"
              rx="17"
              ry="8"
              stroke="#F49321"
              stroke-dasharray="3 3"
            />

            <!-- Orange Location Pin -->
            <path
              d="M61 3 C45 3 36 15 36 28 C36 44 61 60 61 60 C61 60 86 44 86 28 C86 15 77 3 61 3Z"
              fill="#F49321"
              class="drop-shadow-[0_3px_4px_rgba(244,147,33,0.25)]"
            />

            <!-- White Center -->
            <circle cx="61" cy="27" r="12" fill="white" />

            <!-- Navy House -->
            <path
              d="M52 27 L61 19 L70 27 M55 25 V34 H67 V25"
              stroke="#1C2D5B"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <!-- Heading -->
        <p
          class="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-orange md:text-xs"
        >
          Let's Find Your Location
        </p>

        <h3
          class="text-2xl font-extrabold leading-tight tracking-wide text-[#1C2D5B] md:text-4xl lg:text-5xl"
        >
          Are We in
          <span
            class="block text-brand-orange [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_6px_rgba(28,45,91,0.35)] lg:[text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.35)]"
          >
            Your Neighborhood?
          </span>
        </h3>

        <p
          class="mx-auto mt-3 max-w-lg text-xs font-medium leading-relaxed text-[#3b4a6b] md:text-base"
        >
          Your festive holiday starts with an address. Find out if Festive
          Express serves your location.
        </p>

        <!-- Address Search Panel -->
        <div
          class="relative mx-auto mt-5 w-full max-w-xl rounded-xl border border-[#1C2D5B]/10 bg-[#F5F7FB] p-3 text-left md:mt-7 md:p-5"
        >
          <div class="mb-3 flex items-center gap-2">
            <span class="h-5 w-1 rounded-full bg-brand-orange" />

            <h4
              class="text-[11px] font-extrabold uppercase tracking-wider text-[#1C2D5B] md:text-sm"
            >
              Check Service Availability
            </h4>
          </div>

          <div class="relative rounded-lg bg-white p-3 shadow-sm md:p-4">
            <PackageDetailsPackageAddressInput
              v-model:address="address"
              :suggestions="suggestions"
              :suggestions-open="suggestionsOpen"
              :errors="errors"
              :address-error="addressError"
              :validating="validating"
              @input="debouncedSearch"
              @focus="suggestionsOpen = true"
              @select="onSelectAddress"
              @close="suggestionsOpen = false"
            />
          </div>

          <!-- Success State -->
          <div
            v-if="serviceable && placeId && !validating"
            role="status"
            class="mt-3 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3"
          >
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white"
            >
              <i class="fas fa-check" aria-hidden="true" />
            </div>

            <div>
              <p class="text-xs font-extrabold text-green-800 md:text-sm">
                Great news!
              </p>

              <p class="text-[11px] font-medium text-green-700 md:text-xs">
                Your address is within our service area!
              </p>
            </div>
          </div>

          <!-- Supporting Label -->
          <div
            class="mt-3 flex items-center justify-center gap-2 text-[10px] font-semibold text-[#1C2D5B]/70 md:text-xs"
          >
            <i
              class="fas fa-check-circle text-brand-orange"
              aria-hidden="true"
            />
            Quick Coverage Verification
          </div>
        </div>

        <!-- Extended Coverage CTA -->
        <NuxtLink
          to="#contact"
          class="group mx-auto mt-5 flex w-full max-w-xl items-center gap-3 border-t border-[#1C2D5B]/10 pt-4 text-left md:mt-7"
        >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition-colors group-hover:bg-brand-orange group-hover:text-white md:h-12 md:w-12"
          >
            <i class="fas fa-headset md:text-xl" aria-hidden="true" />
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-xs font-extrabold text-[#1C2D5B] md:text-sm">
              Outside our standard service area?
            </p>

            <p class="mt-0.5 text-[11px] font-medium text-[#3b4a6b] md:text-xs">
              Contact us to check extended coverage.
            </p>
          </div>

          <i
            class="fas fa-arrow-right shrink-0 text-sm text-brand-orange transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useServiceableAddress } from "~/composables/useServiceableAddress";
import { usePackagePage } from "~/composables/usePackagePage";

const { setOverage } = usePackagePage();

const {
  address,
  placeId,
  suggestions,
  suggestionsOpen,
  errors,
  debouncedSearch,
  addressError,
  serviceable,
  validating,
  onSelectAddress,
} = useServiceableAddress({
  packageSlug: () => "joy",
  onEstimator: (data) => setOverage(data),
});

const rail = ref<HTMLElement | null>(null);
const activeIndex = ref(0);

const goTo = (index: number) => {
  const el = rail.value;
  const card = el?.querySelectorAll<HTMLElement>("[data-area]")[index];

  if (!el || !card) return;

  const left =
    el.scrollLeft +
    card.getBoundingClientRect().left -
    el.getBoundingClientRect().left -
    (el.clientWidth - card.clientWidth) / 2;

  el.scrollTo({ left, behavior: "smooth" });
};

const updateActive = () => {
  const el = rail.value;
  if (!el || window.innerWidth >= 768) return;

  const center = el.getBoundingClientRect().left + el.clientWidth / 2;
  let closest = Infinity;

  el.querySelectorAll<HTMLElement>("[data-area]").forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - center);

    if (distance < closest) {
      closest = distance;
      activeIndex.value = index;
    }
  });
};

const serviceAreas = [
  {
    county: "Sarasota County",
    title: "Sarasota",
    suffix: "County",
    region: "Gulf Coast",
    subtitle: "Primary & Extended Coverage",
    cities: [
      "Sarasota",
      "Venice",
      "Siesta Key",
      "Osprey",
      "Nokomis",
      "North Port",
      "South Venice",
      "Gulf Gate Estates",
      "Southgate",
      "Fruitville",
      "The Meadows",
    ],
  },
  {
    county: "Manatee County",
    title: "Manatee",
    suffix: "County",
    region: "Gulf Coast",
    subtitle: "Primary & Extended Coverage",
    cities: [
      "Bradenton",
      "Lakewood Ranch",
      "Palmetto",
      "Ellenton",
      "Parrish",
      "Longboat Key",
      "Anna Maria",
      "Holmes Beach",
      "University Park",
      "Whitfield",
      "Bayshore Gardens",
    ],
  },
  {
    county: "Southern Hillsborough",
    title: "Southern",
    suffix: "Hillsborough",
    region: "Tampa Bay",
    subtitle: "Select Communities",
    cities: ["Ruskin", "Sun City Center", "Apollo Beach"],
  },
  {
    county: "Northern Charlotte",
    title: "Northern",
    suffix: "Charlotte",
    region: "Southwest Florida",
    subtitle: "Select Communities",
    cities: ["Port Charlotte", "Englewood", "Surrounding Communities"],
  },
];
</script>
