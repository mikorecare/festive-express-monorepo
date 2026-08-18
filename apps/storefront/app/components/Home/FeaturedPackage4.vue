<template>
  <section class="featured-bundles">
    <div class="container">
      <div class="section-header">
        <span class="badge"></span>
        <h2 class="section-title">Holiday Package Programs</h2>
        <p class="subtitle">Choose the perfect package for your home</p>
      </div>

      <div class="packages-page">
        <div class="container">
          <!-- <div class="packages-grid">
            <div 
              v-for="pkg in packageProducts" 
              :key="pkg.id" 
              class="package-card"
              :class="{ popular: pkg.is_popular }"
            >
              <div v-if="pkg.is_popular" class="popular-badge">POPULAR</div>
              
              <h3 class="package-header" :class="pkg.name.toLowerCase()" :style="{ color: pkg.color }">{{ pkg.name }}</h3>
              <img 
                :src="getImageUrl(pkg.image_url)" 
                alt=""
                class="package-image"
              >
              <div class="price"><sup>$</sup>{{ pkg.price }}</div>
               <p class="description">{{ pkg.description }}</p> -->
          <!-- <p class="description" v-html="pkg.description.replace(/\n/g, '<br>')"></p> -->

          <!-- Dynamic Description with Green Check -->
          <!-- <div class="description">
                <div v-for="(line, index) in getPackageDescription(pkg)" :key="index" class="feature-line">
                  <span class="check-icon">✔</span>
                  {{ line }}
                </div>
              </div>

              <button @click="selectPackage(pkg)" class="btn-primary">
                Select {{ pkg.name }}
              </button>
            </div> -->
          <!-- </div>   -->

          <div class="packages-grid">
            <!-- Left: Package Products -->
            <div class="left-column">
              <h2 class="column-title">Holiday Lighting Packages</h2>

              <div class="grid md:grid-cols-2 gap-8">
                <!-- Joy -->
                <div
                  v-for="pkg in packageProducts"
                  :key="pkg.id"
                  class="package-card"
                  :class="{ popular: pkg.is_popular }"
                >
                  <div class="image-wrapper">
                    <img
                      :src="getImageUrl(pkg.image_url)"
                      alt=""
                      class="package-image"
                    />
                    <div
                      class="badge"
                      :class="{
                        standard: pkg.name.toLowerCase() === 'joy',
                        popular: pkg.name.toLowerCase() === 'jolly',
                        premium: pkg.name.toLowerCase() === 'merry',
                      }"
                    >
                      {{ getBadgeText(pkg.name) }}
                    </div>
                  </div>
                  <div class="packages-info">
                    <h3 class="text-3xl font-bold">{{ pkg.name }}</h3>
                    <div
                      class="d-flex align-items-center justify-content-between"
                    >
                      <div class="price"><sup>$</sup>{{ pkg.price }}</div>

                      <div class="description-tooltip ml-2 mr-2">
                        <button class="tooltip-trigger select-btn-border">
                          View Features
                        </button>
                        <div class="tooltip-content">
                          <div
                            v-for="(variation, vIndex) in pkg.variations"
                            :key="vIndex"
                            class="variation-group"
                          >
                            <strong>{{ variation.name }}:</strong>
                            <div
                              v-for="(option, oIndex) in variation.options"
                              :key="oIndex"
                              class="feature-line"
                            >
                              <!-- <span class="check-icon">✔</span> -->
                              <img
                                v-if="option.image_url"
                                :src="getImageUrl(option.image_url)"
                                class="option-preview"
                              />
                              {{ option.name }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button @click="selectPackage(pkg)" class="select-btn">
                        Select Package
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Holiday Indoor Package -->
            <div class="right-column">
              <h2 class="column-title indoor-package">
                Holiday Indoor Packages
              </h2>
              <span>Pricing based on 3-year lease programs</span>

              <!-- Indoor Packages -->
              <div>
                <div class="grid-view mt-4">
                  <div
                    v-for="pkg in holidayIndoorPackage"
                    :key="pkg.name"
                    class="indoor-card"
                  >
                    <div class="icon-circle">
                      <!-- <span class="text-4xl">{{ pkg.icon }}</span> -->
                      <img
                        :src="getImageUrl(pkg.image_url)"
                        alt=""
                        class="featured-image"
                      />
                    </div>
                    <h4 class="text-xl font-semibold mt-6">{{ pkg.name }}</h4>
                    <div class="price text-3xl font-bold mt-2">
                      <sup>$</sup>{{ pkg.price }}
                    </div>
                    <button @click="selectPackage(pkg)" class="select-btn mb-3">
                      Select Package
                    </button>

                    <div class="description-tooltip">
                      <button class="tooltip-trigger select-btn-border">
                        View Features
                      </button>
                      <div class="tooltip-content">
                        <div
                          v-for="(variation, vIndex) in pkg.variations"
                          :key="vIndex"
                          class="variation-group"
                        >
                          <strong>{{ variation.name }}:</strong>
                          <div
                            v-for="(option, oIndex) in variation.options"
                            :key="oIndex"
                            class="feature-line"
                          >
                            <span v-if="!option.image_url" class="check-icon"
                              >✔</span
                            >
                            <img
                              v-if="option.image_url"
                              :src="getImageUrl(option.image_url)"
                              class="option-preview"
                            />
                            {{ option.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Custom Package (static) -->
                  <div class="indoor-card custom-card">
                    <div class="icon-circle">
                      <img
                        src="/Images/wreathxtree.png"
                        alt="Custom Package"
                        class="featured-image"
                      />
                    </div>
                    <h4 class="text-xl font-semibold mt-6">Custom Package</h4>
                    <!-- <div class="price text-3xl font-bold mt-2">Quote</div> --><br /><br />
                    <button
                      @click="navigateTo('/contact')"
                      class="select-btn mb-3"
                    >
                      Request Quote
                    </button>

                    <div class="description-tooltip">
                      <button class="tooltip-trigger select-btn-border">
                        View Features
                      </button>
                      <div class="tooltip-content">
                        <div class="feature-line">
                          <span class="check-icon">✔</span> Fully customized
                          design
                        </div>
                        <div class="feature-line">
                          <span class="check-icon">✔</span> Mix any lights &
                          décor
                        </div>
                        <div class="feature-line">
                          <span class="check-icon">✔</span> Sized for your
                          property
                        </div>
                        <div class="feature-line">
                          <span class="check-icon">✔</span> Free consultation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">


const packages = ref<
  Array<{
    id: number;
    name: string;
    description: string;
    slug: string;
    event_date_from: string;
    event_date_to: string;
    is_popular: boolean;
    is_package: boolean;
    package_data: string;
    price: number;
    color: string;
    image_url: string | null;
    variations: Array<{
      name: string;
      options: Array<{
        name: string;
        image_url: string;
      }>;
    }>;
  }>
>([]);

onMounted(async () => {
  try {
    const res: any = await $fetch("/products?is_package=true", {
      baseURL: useRuntimeConfig().public.apiBase,
      params: {
        status: "publish",
      },
    });
    packages.value = res.data || res || [];
  } catch (error) {
    console.error("Failed to load packages:", error);
  }
});

const packageProducts = computed(() =>
  // packages.value.filter(p => p.is_package && p.package_data === 'holiday-lighting-package-programs')
  packages.value
    .filter(
      (p: any) =>
        p.is_package && p.package_data === "holiday-lighting-package-programs",
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    ),
);

const holidayIndoorPackage = computed(() =>
  // packages.value.filter(p => p.is_package && p.package_data === 'holiday-indoor-packages')
  packages.value
    .filter(
      (p: any) => p.is_package && p.package_data === "holiday-indoor-packages",
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    ),
);

const selectPackage = async (pkg: any) => {
  navigateTo(`/products/${pkg.id}`);
};

const getImageUrl = (url: string | null) => {
  if (!url) return "/Images/placeholder.png";
  return `${useRuntimeConfig().public.imageBase}/${url}`;
};

const getBadgeText = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("joy")) return "STANDARD";
  if (n.includes("jolly")) return "POPULAR";
  if (n.includes("merry")) return "PREMIUM";
  return "PACKAGE";
};
</script>

<style scoped>
.featured-bundles {
  padding: 70px 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.column-title {
  padding-left: 1rem;
  border-left: 4px solid rgb(253 153 35);
  margin-bottom: 2rem;
}
.indoor-package {
  margin-bottom: 1rem !important;
}

.section-title {
  font-size: 2.5rem;
  color: #0c2340;
  margin-bottom: 12px;
}

.subtitle {
  color: #555;
  max-width: 600px;
  margin: 0 auto;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.package-card {
  background: white;
  border-radius: 12px;
  /* padding: 30px; */
  padding-bottom: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
  position: relative;
  display: flex;
  flex-direction: column;
  /* height: 100%; */
  margin-bottom: 20px;
}

.packages-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  position: relative;
  /* height: 260px; */
}

.packages-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.package-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  /* margin: 20px 0; */
}

.packages-info {
  padding: 24px;
}

.packages-info h3 {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
}

.package-header {
  font-size: 1.6rem;
  font-weight: 700;
  /* padding: 12px 0; */
  text-align: center;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
  padding: 30px 0;
  background: #ff890b;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  text-align: center;
  color: white;
}

/* .joy { color: #166534; }
.jolly { color: #92400e; }
.merry { color: #991b1b; } */

.description {
  color: #fff;
  font-size: 0.97rem;
  line-height: 2.8;
  margin-bottom: 18px;
  flex: 1;
  max-width: 90%; /* Not full width */
  margin-left: auto;
  margin-right: auto;
}

.description-tooltip {
  position: relative;
  display: inline-block;
  /* margin-bottom: 24px; */
  text-align: center;
}

.tooltip-trigger {
  /* background: #f1f5f9;
  color: #0c2340;
  border: none;
  padding: 8px 16px;
  border-radius: 8px; */
  cursor: pointer;
  /* font-size: 0.9rem; */
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  width: 380px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 10;
  margin-bottom: 8px;
}

.description-tooltip:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
}

.feature-line {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.check-icon {
  color: #10b981;
  font-size: 1.2rem;
  font-weight: bold;
}

img.option-preview {
  width: 50px;
}

.price {
  font-size: 2.5rem;
  font-weight: 800;
  /* margin: 12px 0 24px; */
  color: #f59e0b;
}
.price sup {
  font-size: 0.5em;
  top: -0.7em;
}

/* Responsive */
@media (max-width: 768px) {
  .packages-grid {
    grid-template-columns: 1fr;
  }
}

/* Indoor Cards */
.indoor-card {
  background: white;
  padding: 32px 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.indoor-card:hover {
  transform: translateY(-8px);
}

.icon-circle {
  width: 80px;
  height: 80px;
  background-color: rgb(229 238 255);
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Important */
  padding: 8px; /* Optional padding */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.featured-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Keeps aspect ratio, fits inside */
  border-radius: 50%;
}

.indoor-select-btn {
  margin-top: 24px;
  width: 100%;
  padding: 12px;
  border: 2px solid #f59e0b;
  color: #f59e0b;
  border-radius: 9999px;
  font-weight: 600;
}

.indoor-select-btn:hover {
  background: #f59e0b;
  color: white;
}

.right-column {
  background-color: rgb(26 43 72 / 0.05);
  border-color: rgb(26 43 72 / 0.1);
  border-width: 1px;
  border-radius: 16px;
  padding: 2rem;
  border-style: solid;
  box-sizing: border-box;
}
.right-column .grid-view {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  display: grid;
}
</style>
