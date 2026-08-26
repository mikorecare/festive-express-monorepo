<template>
  <section class="featured-bundles">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Holiday Package Programs</h2>
        <p class="subtitle">Choose the perfect package for your home</p>
      </div>

      <div class="packages-grid">
        <div
          v-for="pkg in packageProducts"
          :key="pkg.id"
          class="package-card"
          :class="{ popular: pkg.is_popular }"
        >
          <div class="image-wrapper">
            <img
              :src="getImageUrl(pkg.image_url)"
              :alt="pkg.name"
              class="package-image"
            />
            <div
              class="badge"
              :class="{
                standard: isName(pkg.name, 'joy'),
                popular: isName(pkg.name, 'jolly'),
                premium: isName(pkg.name, 'merry'),
              }"
            >
              {{ getBadgeText(pkg.name) }}
            </div>
          </div>

          <div class="packages-info">
            <div class="title-row">
              <h3>{{ pkg.name }}</h3>
              <div class="price">${{ Number(pkg.price).toFixed(2) }}</div>
            </div>

            <div class="card-actions">
              <div class="description-tooltip">
                <button type="button" class="select-btn-border w-100">
                  View Features
                </button>
                <div class="tooltip-content">
                  <div
                    v-for="(variation, vIndex) in pkg.variations || []"
                    :key="vIndex"
                    class="variation-group"
                  >
                    <strong>{{ variation.name }}</strong>
                    <div
                      v-for="(option, oIndex) in variation.options || []"
                      :key="oIndex"
                      class="feature-line"
                    >
                      <img
                        v-if="option.image_url"
                        :src="getImageUrl(option.image_url)"
                        class="option-preview"
                        alt=""
                      />
                      <span>{{ option.name }}</span>
                    </div>
                  </div>
                  <p v-if="!pkg.variations?.length" class="empty-features">
                    Features coming soon
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="select-btn w-100"
                @click="selectPackage(pkg)"
              >
                Select {{ shortName(pkg.name) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type PackageProduct = {
  id: number;
  name: string;
  price: number;
  is_popular?: boolean;
  is_package?: boolean;
  package_data?: string;
  image_url?: string | null;
  created_at?: string;
  variations?: Array<{
    name: string;
    options: Array<{ name: string; image_url?: string }>;
  }>;
};

const packages = ref<PackageProduct[]>([]);
const config = useRuntimeConfig();

onMounted(async () => {
  try {
    const res: any = await $fetch("/products", {
      baseURL: config.public.apiBase,
      params: {
        is_package: true,
        status: "publish",
      },
    });
    packages.value = res.data || res || [];
  } catch (error) {
    console.error("Failed to load packages:", error);
  }
});

/** Outdoor only */
const packageProducts = computed(() =>
  packages.value
    .filter(
      (p) =>
        p.is_package && p.package_data === "holiday-lighting-package-programs",
    )
    .sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return ta - tb;
    }),
);

const selectPackage = (pkg: PackageProduct) => {
  navigateTo(`/products/${pkg.id}`);
};

const getImageUrl = (url?: string | null) => {
  if (!url) return "/Images/placeholder.png";
  return `${config.public.imageBase}/${url}`;
};

const isName = (name: string, key: string) => name.toLowerCase().includes(key);

const getBadgeText = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("joy")) return "STANDARD";
  if (n.includes("jolly")) return "POPULAR";
  if (n.includes("merry")) return "PREMIUM";
  return "PACKAGE";
};

const shortName = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("joy")) return "Joy";
  if (n.includes("jolly")) return "Jolly";
  if (n.includes("merry")) return "Merry";
  return name;
};
</script>

<style scoped>
.featured-bundles {
  padding: 70px 0;
  background: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2.5rem;
  color: #1c2d5b;
  margin-bottom: 10px;
}

.subtitle {
  color: #555;
  margin: 0;
  text-align: center;
  max-width: 100%;
}

/* 3 columns on desktop */
.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.package-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.package-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
}

.image-wrapper {
  position: relative;
}

.package-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.badge {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  background: #1c2d5b;
}

.badge.popular {
  background: #f49321;
}

.badge.premium {
  background: #991b1b;
}

.badge.standard {
  background: #166534;
}

.packages-info {
  padding: 22px 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
}

.title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.title-row h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c2d5b;
}

.price {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #f49321;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.btn-outline,
.btn-select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline {
  background: #fff;
  color: #1c2d5b;
  border: 2px solid #1c2d5b;
}

.btn-outline:hover {
  background: #f8fafc;
}

.btn-select {
  background: #92400e;
  color: #fff;
  border: none;
}

.btn-select:hover {
  background: #1c2d5b;
}

/* Features tooltip */
.description-tooltip {
  position: relative;
}

.tooltip-content {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: min(340px, 90vw);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 20;
  text-align: left;
}

.description-tooltip:hover .tooltip-content,
.description-tooltip:focus-within .tooltip-content {
  opacity: 1;
  visibility: visible;
}

.variation-group {
  margin-bottom: 10px;
}

.variation-group strong {
  display: block;
  color: #1c2d5b;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.feature-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #334155;
}

.option-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}

.empty-features {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 992px) {
  .packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 1.85rem;
  }

  .packages-grid {
    grid-template-columns: 1fr;
  }

  .package-image {
    height: 200px;
  }
}
</style>
