<template>
  <section class="relative bg-[url('/Images/Choose-Your-Package.webp')] bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed py-20 z-[1] border-t-5 border-brand-orange">
    <!-- Optional Overlay -->
    <div class="absolute inset-0 z-[-1] pointer-events-none"></div>

    <div class="max-w-[1280px] mx-auto px-5">
      <!-- Section Headers -->
      <h2 v-fade class="text-center font-black text-white tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-2xl sm:text-3xl lg:text-4xl max-sm:text-[1.2rem] max-sm:leading-[1.3] uppercase">
        CHOOSE YOUR <span class="text-brand-orange">HOLIDAY</span> PACKAGE
      </h2>
      <p v-fade class="text-center text-[#e2e8f0] mb-[50px] text-[1.15rem] font-bold tracking-[0.5px] uppercase max-w-[50%] max-sm:max-w-[80%] mx-auto leading-[1.3] max-sm:text-[0.95rem] mt-2 fade-up is-visible">
        COMPARE WHAT’S INCLUDED IN EACH PLAN
      </p>

      <!-- Compare Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-[30px] items-stretch max-lg:max-w-[420px] max-lg:mx-auto">
        <div 
          v-for="pkg in packageProducts" 
          :key="pkg.id"
          class="bg-brand-orange border-4 border-brand-orange rounded-[28px] flex flex-col relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          :class="{ popular: pkg.is_popular }"
        >
          <!-- Package Header -->
          <div class="p-[20px] flex items-center justify-between bg-[#0c2340] min-h-[90px]">
            <div class="flex items-center flex-1">
              <img
                class="h-[60px] w-auto max-w-[160px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                :src="getPackageTitleImage(pkg.name)"
                :alt="pkg.name"
              >
            </div>
            <div class="text-[2.2rem] font-black text-white ml-3">
              ${{ Number(pkg.price).toLocaleString() }}
            </div>
          </div>

          <!-- Package Body / Inclusions -->
          <div class="bg-white rounded-b-[70px] pt-[24px] px-[20px] pb-[60px] flex-1 bg-[url('/Images/LV.png')] bg-no-repeat bg-[position:50%] bg-cover">
            <div class="flex flex-col gap-[16px] w-full">
              <template v-for="(variation, vIndex) in pkg.variations" :key="vIndex">
                <div
                  v-for="(option, oIndex) in variation.options"
                  :key="`${vIndex}-${oIndex}`"
                  class="flex items-center gap-[16px] w-full"
                >
                  <div class="w-[56px] h-[56px] rounded-full border-3 border-brand-orange overflow-hidden shrink-0 bg-white flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                    <img
                      :src="getImageUrl(option.image_url)"
                      :alt="option.name"
                      class="w-full h-full object-cover"
                      @error="handleImgError"
                    >
                  </div>
                  <div>
                    <strong class="text-[0.95rem] text-[#0c2340] font-extrabold leading-[1.3] block">
                      {{ option.name }}
                    </strong>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Bottom Orange Shell with Overlapping Button -->
          <div class="bg-transparent px-[16px] pb-[16px] flex justify-center items-center z-[2]">
            <button 
              class="w-[85%] bg-brand-orange text-white border-2 border-[#0c2340] rounded-[50px] py-[12px] px-[16px] text-[0.95rem] font-black tracking-[0.5px] uppercase cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-transform duration-200 ease-in-out hover:bg-[#0c2340] hover:text-white hover:-translate-y-[2px] -mt-[30px]" 
              @click="selectPackage(pkg)"
            >
              {{ getPackageButtonText(pkg) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const config = useRuntimeConfig()

const packages = ref<Array<{
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
  created_at?: string;
  variations: Array<{
    name: string;
    options: Array<{
      name: string;
      image_url: string;
    }>;
  }>;
}>>([])

onMounted(async () => {
  try {
    const res: any = await $fetch('/products', {
      baseURL: config.public.apiBase,
      params: {
        is_package: true,
        status: 'publish'
      }
    })
    packages.value = res.data || res || []
  } catch (error) {
    console.error('Failed to load packages:', error)
  }
})

const packageProducts = computed(() => 
  packages.value
    .filter(p => p.is_package && p.package_data === 'holiday-lighting-package-programs')
    .sort((a, b) => a.id - b.id)
)

const getImageUrl = (url?: string | null) => {
  if (!url) return '/Images/placeholder.jpg'
  if (url.startsWith('http')) return url
  return `${config.public.imageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

const handleImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/placeholder.jpg'
}

const selectPackage = async (pkg: any) => {
  navigateTo(`/products/${pkg.id}`)
}

const BASE = '/Images/Holiday-Lighting-Package'
const getPackageTitleImage = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('jolly')) return `${BASE}/Jolly.png`
  if (n.includes('merry')) return `${BASE}/Merry.png`
  return `${BASE}/Joy.png`
}

const getPackageButtonText = (pkg: { name: string; id?: string | number }) => {
  const name = pkg.name.toLowerCase()

  if (name.includes('joy')) return 'Choose Joy'
  if (name.includes('jolly')) return 'Get Jolly'
  if (name.includes('merry')) return 'Make It Merry'

  // Fallback for any other package name
  return `Choose ${pkg.name}`
}
</script>