<template>
  <section
    id="service-areas"
    aria-labelledby="service-areas-heading"
    class="relative w-full overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-14 lg:py-20 border-t-8 border-t-brand-orange bg-[url('/Images/LV.webp')] bg-no-repeat bg-[position:50%] bg-cover"
  >
    <!-- Subtle background accents -->
    <div
      class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F49321]/5 blur-3xl pointer-events-none"
      aria-hidden="true"
    ></div>

    <div
      class="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#1C2D5B]/5 blur-3xl pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="relative z-10 mx-auto w-full max-w-[1280px]">
      <!-- Section Heading -->
      <div v-fade class="mx-auto mb-8 max-w-4xl text-center sm:mb-12">
        <p
          class="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#F49321] sm:text-sm"
        >
          Proudly Serving Southwest Florida
        </p>

        <h2
          id="service-areas-heading"
          class="mb-4 text-3xl font-extrabold leading-tight tracking-wide text-[#1C2D5B] sm:text-4xl md:text-5xl lg:mb-6 lg:text-6xl"
        >
          Holiday Lighting
          <span
            class="block mt-1.5 text-[#F49321] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_6px_rgba(28,45,91,0.35)] lg:[text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_0_4px_10px_rgba(28,45,91,0.45)]"
          >
            Near You
          </span>
        </h2>

        <p
          class="mx-auto max-w-3xl text-sm font-medium leading-relaxed text-[#3b4a6b] sm:text-base lg:text-xl"
        >
          From Sarasota and Bradenton to surrounding Gulf Coast communities,
          Festive Express brings professional holiday lighting rentals and
          installation to your neighborhood.
        </p>
      </div>

      <!-- Service Area Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        <div
          v-for="area in serviceAreas"
          :key="area.county"
          v-fade
          class="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#1C2D5B]/10 bg-white p-5 shadow-[0_6px_24px_rgba(28,45,91,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#F49321]/60 hover:shadow-[0_12px_30px_rgba(28,45,91,0.12)] sm:p-6 lg:p-7"
        >
          <!-- Orange top accent -->
          <div
            class="absolute inset-x-0 top-0 h-1 bg-[#F49321]"
            aria-hidden="true"
          ></div>

          <!-- County Heading -->
          <div class="mb-4 flex items-center gap-3">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F49321]/15 sm:h-12 sm:w-12"
            >
              <i
                class="fas fa-map-marker-alt text-lg text-[#F49321] sm:text-xl"
                aria-hidden="true"
              ></i>
            </div>

            <div class="min-w-0">
              <h3
                class="text-lg font-extrabold tracking-wide text-[#1C2D5B] sm:text-xl"
              >
                {{ area.county }}
              </h3>

              <p class="mt-0.5 text-xs font-semibold text-[#F49321] sm:text-sm">
                {{ area.subtitle }}
              </p>
            </div>
          </div>

          <!-- City List -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="city in area.cities"
              :key="city"
              class="inline-flex items-center rounded-full border border-[#1C2D5B]/10 bg-[#F5F7FB] px-3 py-1.5 text-xs font-semibold leading-snug text-[#1C2D5B] transition-colors duration-300 group-hover:border-[#F49321]/20 sm:text-sm"
            >
              {{ city }}
            </span>
          </div>
        </div>
      </div>

      <!-- Coverage Information -->
      <div
        v-fade
        class="mt-6 flex flex-col gap-4 rounded-2xl border border-[#F49321]/30 bg-[#FFF8EF] p-5 sm:mt-8 sm:flex-row sm:items-start sm:gap-5 sm:p-6 lg:p-8"
      >
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F49321] text-white shadow-[0_4px_10px_rgba(244,147,33,0.25)]"
        >
          <i class="fas fa-truck text-lg" aria-hidden="true"></i>
        </div>

        <div id="service-areas-form">
          <h3 class="mb-2 text-lg font-extrabold text-[#1C2D5B] sm:text-xl">
            Based in Sarasota, Florida
          </h3>

          <p
            class="text-sm font-medium leading-relaxed text-[#3b4a6b] sm:text-base"
          >
            Our primary service area is approximately
            <strong class="text-[#1C2D5B]">
              45 minutes from our Sarasota location.
            </strong>
            Select extended areas may also be available depending on your
            property location, travel conditions, and scheduling availability.
          </p>
        </div>
      </div>

      <!-- Call To Action -->

      <!-- Highlighted Service Area Checker -->

      <!-- Service Area Address Checker -->
      <div
        v-fade
        class="relative mx-auto mt-10 max-w-3xl border-t-4 border-[#F49321] pt-8 text-center sm:mt-14 sm:pt-10"
      >
        <h3
          class="mb-3 text-2xl font-extrabold tracking-wide text-[#1C2D5B] sm:text-3xl lg:text-4xl"
        >
          Are We in
          <span class="text-[#F49321]">Your Neighborhood?</span>
        </h3>

        <p
          class="mx-auto mb-7 max-w-xl text-sm font-medium leading-relaxed text-[#3b4a6b] sm:text-base"
        >
          Enter your property address to see if Festive Express serves your
          location.
        </p>

        <div
          class="relative mx-auto max-w-xl rounded-xl border border-[#1C2D5B]/15 bg-white p-4 text-left shadow-[0_6px_24px_rgba(28,45,91,0.1)] sm:p-6"
        >
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

          <p
            v-if="serviceable && placeId && !validating"
            class="mt-3 text-sm font-semibold text-green-700"
            role="status"
          >
            <i class="fas fa-check-circle mr-1" aria-hidden="true"></i>
            Your address is within our service area!
          </p>
        </div>

        <p class="mt-5 text-xs text-[#3b4a6b] sm:text-sm">
          Outside our standard service area?
          <NuxtLink
            to="#contact"
            class="font-bold text-[#F49321] underline underline-offset-4 hover:text-[#1C2D5B]"
          >
            Contact us to check availability.
          </NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useServiceableAddress } from "~/composables/useServiceableAddress";
import { usePackagePage } from "~/composables/usePackagePage";
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
  packageSlug: () => "",
});

const { setOverage } = usePackagePage();

useServiceableAddress({
  packageSlug: () => "joy",
  onEstimator: (data) => {
    setOverage(data);
  },
});

const serviceAreas = [
  {
    county: "Sarasota County",
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
    subtitle: "Select Communities",
    cities: ["Ruskin", "Sun City Center", "Apollo Beach"],
  },
  {
    county: "Northern Charlotte",
    subtitle: "Select Communities",
    cities: ["Port Charlotte", "Englewood", "Surrounding Communities"],
  },
];
</script>
