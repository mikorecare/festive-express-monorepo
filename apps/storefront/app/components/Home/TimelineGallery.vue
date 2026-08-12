<template>
  <section class="w-full bg-[#0c1a35] text-white py-20 relative overflow-hidden bg-[url('/Images/LV.png')] bg-no-repeat bg-[position:50%] bg-cover">

    <!-- Timeline Header -->
    <div class="text-center px-5 sm:pb-5 relative z-[2] sm:mb-10">
      <h2 v-fade class="font-extrabold text-white text-uppercase text-2xl sm:text-3xl lg:text-4xl max-sm:text-[1.2rem] max-sm:leading-[1.3]">Our Wonderful <span class="text-brand-orange">HOLIDAY</span> Stories</h2>
      <p v-fade class="text-white max-w-[50%] max-sm:max-w-[80%] mx-auto leading-[1.3] text-xl max-sm:text-[0.95rem] mt-2 fade-up is-visible">Journey through our favorite seasonal moments and cherished memories captured over the years.</p>
    </div>
    
    <!-- Interactive Guidance Overlay -->
    <Transition name="fade">
      <div 
        v-if="showOverlay" 
        class="absolute inset-0 bg-[#0c1a35]/75 backdrop-blur-sm flex items-center justify-center z-20 cursor-pointer" 
        @click="dismissOverlay"
        @mousedown="dismissOverlay"
        @touchstart.passive="dismissOverlay"
      >
        <div class="text-center text-white pointer-events-none p-5">
          <h2 class="text-2xl sm:text-3xl font-black tracking-widest mb-2 text-white uppercase">CLICK &amp; DRAG TO NAVIGATE</h2>
          <p class="text-base text-[#d1dbe8] mb-6">Move the cursor left and right to view our gallery.</p>
          
          <!-- Animated Hand Icon -->
          <div class="flex flex-col items-center gap-2 animate-[slide-hand_1.8s_ease-in-out_infinite]">
            <svg class="w-12 h-12 stroke-white" viewBox="0 0 24 24" fill="none" stroke-width="2">
              <path d="M18 11V6a2 2 0 0 0-4 0v5" />
              <path d="M14 10V4a2 2 0 0 0-4 0v6" />
              <path d="M10 10.5V6a2 2 0 0 0-4 0v9" />
              <path d="M18 11a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.8-6.7-2.8l-3.2-3.2a2 2 0 0 1 2.8-2.8l1.1 1.1" />
            </svg>
            <div class="flex items-center gap-1.5 text-lg text-[#1cb5a3] font-bold">
              <span>&larr;</span>
              <span>&bull;&bull;&bull;</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Horizontal Scroll Track with Mouse Drag & Touch Support -->
    <div 
      ref="trackRef" 
      class="flex items-center gap-[60px] overflow-x-auto scroll-smooth py-5 px-[80px] select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      :class="{ 'cursor-grabbing !scroll-auto': isTrackDragging, 'cursor-grab': !isTrackDragging }"
      @scroll="onTrackScroll"
      @mousedown="startTrackDrag"
      @mouseleave="stopTrackDrag"
      @mouseup="stopTrackDrag"
      @mousemove="onTrackDrag"
      @touchstart="startTrackDrag"
      @touchend="stopTrackDrag"
      @touchmove="onTrackDrag"
    >
      <template v-for="(item, index) in timelineItems" :key="item.id || index">
        
        <!-- Timeline Card -->
        <div class="flex items-center gap-6 shrink-0">
          <!-- Image Left Layout -->
          <template v-if="item.imagePosition === 'left'">
            <div 
              v-if="item.image" 
              class="shrink-0 w-full relative overflow-hidden cursor-pointer aspect-[16/10] rounded-2xl bg-[#0c1a35] outline outline-2 outline-[rgba(255,122,0,0.2)] -outline-offset-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:outline-brand-orange hover:outline-offset-4 hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:scale-[1.02] hover:brightness-[1.05]" 
              @click="openLightbox(item.image)"
            >
              <img :src="item.image" :alt="item.year || 'Gallery Image'" draggable="false" class="w-full h-[280px] max-w-[400px] max-md:h-[200px] max-md:max-w-[280px] max-sm:h-[160px] max-sm:max-w-[220px] object-cover pointer-events-none block" />
            </div>
            <div v-if="item.year || item.description">
              <span v-if="item.year" class="text-[3.5rem] font-extrabold text-[#d18d45] leading-none block mb-3">{{ item.year }}</span>
              <p v-if="item.description" class="text-[0.92rem] leading-relaxed text-[#cfd8e8]">{{ item.description }}</p>
            </div>
          </template>

          <!-- Image Right Layout -->
          <template v-else>
            <div v-if="item.year || item.description">
              <span v-if="item.year" class="text-[3.5rem] font-extrabold text-[#d18d45] leading-none block mb-3">{{ item.year }}</span>
              <p v-if="item.description" class="text-[0.92rem] leading-relaxed text-[#cfd8e8]">{{ item.description }}</p>
            </div>
            <div 
              v-if="item.image" 
              class="shrink-0 w-full relative overflow-hidden cursor-pointer aspect-[16/10] rounded-2xl bg-[#0c1a35] outline outline-2 outline-[rgba(255,122,0,0.2)] -outline-offset-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:outline-brand-orange hover:outline-offset-4 hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:scale-[1.02] hover:brightness-[1.05]" 
              @click="openLightbox(item.image)"
            >
              <img :src="item.image" :alt="item.year || 'Gallery Image'" draggable="false" class="w-full h-[280px] max-w-[400px] max-md:h-[200px] max-md:max-w-[280px] max-sm:h-[160px] max-sm:max-w-[220px] object-cover pointer-events-none block" />
            </div>
          </template>
        </div>

        <!-- Lightbox Modal -->
        <Transition name="fade">
          <div v-if="activeImage" class="fixed inset-0 w-screen h-screen bg-black/85 flex items-center justify-center z-[9999] p-5" @click.self="closeLightbox">
            <button class="absolute top-5 right-[25px] bg-transparent border-none text-white text-[2.5rem] leading-none cursor-pointer z-[10000] transition-transform duration-200 hover:text-brand-orange hover:scale-[1.15]" @click="closeLightbox" aria-label="Close modal">&times;</button>
            <div class="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
              <img :src="activeImage" alt="Enlarged view" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
        </Transition>

        <!-- Optional Centerpiece/Divider between cards -->
        <div v-if="item.dividerImage">
          <img :src="item.dividerImage" alt="Timeline Divider" draggable="false" class="h-[320px] shrink-0 pointer-events-none" />
        </div>

      </template>
    </div>

    <!-- Bottom Ornament Navigation Bar -->
    <div ref="navBarRef" class="relative w-[85%] max-w-[1100px] h-[60px] mx-auto mt-[20px] flex items-center">
      <div class="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#ff7a00] via-[#ff9e43] to-[#ff7a00] -translate-y-1/2 rounded-[2px]"></div>

      <!-- Draggable Spinner Indicator -->
      <div 
        class="absolute top-1/2 w-[70px] h-[70px] -mt-[35px] -translate-x-1/2 select-none touch-none z-[5] transition-none will-change-[left]"
        :class="{ 'cursor-grabbing': isSpinnerDragging, 'cursor-grab': !isSpinnerDragging }"
        :style="{ left: scrollProgress + '%' }"
        @mousedown="startSpinnerDrag"
        @touchstart="startSpinnerDrag"
      >
        <img :src="spinnerImage" alt="Timeline Ornament" draggable="false" class="w-full h-full object-contain pointer-events-none -scale-x-100" />
      </div>  
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Global Settings / Spinner Image
const spinnerImage = ref('/Images/placeholder.png')

// Overlay Visibility
const showOverlay = ref(true)

const dismissOverlay = () => {
  if (showOverlay.value) {
    showOverlay.value = false
  }
}

// Timeline Data Array
const timelineItems = ref([
  { id: 7, year: '', description: '', image: '/Images/Gallery/Festive-Images-7.webp', imagePosition: 'right', dividerImage: null },
  { id: 13, year: '', description: '', image: '/Images/Gallery/Festive-Images-13.webp', imagePosition: 'left', dividerImage: null },
  { id: 1, year: '', description: '', image: '/Images/Gallery/Festive-Images-1.webp', imagePosition: 'right', dividerImage: null },
  { id: 19, year: '', description: '', image: '/Images/Gallery/Festive-Images-19.webp', imagePosition: 'left', dividerImage: null },
  { id: 17, year: '', description: '', image: '/Images/Gallery/Festive-Images-17.webp', imagePosition: 'right', dividerImage: null },
  { id: 14, year: '', description: '', image: '/Images/Gallery/Festive-Images-14.webp', imagePosition: 'right', dividerImage: null },
  { id: 10, year: '', description: '', image: '/Images/Gallery/Festive-Images-10.webp', imagePosition: 'right', dividerImage: null },
  { id: 9, year: '', description: '', image: '/Images/Gallery/Festive-Images-9.webp', imagePosition: 'right', dividerImage: null },
  { id: 4, year: '', description: '', image: '/Images/Gallery/Festive-Images-4.webp', imagePosition: 'right', dividerImage: null },
  { id: 15, year: '', description: '', image: '/Images/Gallery/Festive-Images-15.webp', imagePosition: 'right', dividerImage: null },
  { id: 20, year: '', description: '', image: '/Images/Gallery/Festive-Images-20.webp', imagePosition: 'left', dividerImage: null },
  { id: 8, year: '', description: '', image: '/Images/Gallery/Festive-Images-8.webp', imagePosition: 'right', dividerImage: null },
  { id: 18, year: '', description: '', image: '/Images/Gallery/Festive-Images-18.webp', imagePosition: 'right', dividerImage: null },
  { id: 2, year: '', description: '', image: '/Images/Gallery/Festive-Images-2.webp', imagePosition: 'right', dividerImage: null },
  { id: 16, year: '', description: '', image: '/Images/Gallery/Festive-Images-16.webp', imagePosition: 'right', dividerImage: null },
  { id: 11, year: '', description: '', image: '/Images/Gallery/Festive-Images-11.webp', imagePosition: 'right', dividerImage: null },
  { id: 3, year: '', description: '', image: '/Images/Gallery/Festive-Images-3.webp', imagePosition: 'right', dividerImage: null },
  { id: 12, year: '', description: '', image: '/Images/Gallery/Festive-Images-12.webp', imagePosition: 'right', dividerImage: null },
  { id: 5, year: '', description: '', image: '/Images/Gallery/Festive-Images-5.webp', imagePosition: 'right', dividerImage: null },
  { id: 6, year: '', description: '', image: '/Images/Gallery/Festive-Images-6.webp', imagePosition: 'right', dividerImage: null },
])

// Refs & Reactive State
const trackRef = ref(null)
const navBarRef = ref(null)
const scrollProgress = ref(0)

// Track Drag State
const isTrackDragging = ref(false)
let trackStartX = 0
let trackScrollLeft = 0

// Spinner Drag State
const isSpinnerDragging = ref(false)

// Attach Global Handlers for Dragging
onMounted(() => {
  window.addEventListener('mousemove', onSpinnerDrag)
  window.addEventListener('mouseup', stopSpinnerDrag)
  window.addEventListener('touchmove', onSpinnerDrag)
  window.addEventListener('touchend', stopSpinnerDrag)

  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onSpinnerDrag)
  window.removeEventListener('mouseup', stopSpinnerDrag)
  window.removeEventListener('touchmove', onSpinnerDrag)
  window.removeEventListener('touchend', stopSpinnerDrag)

  window.removeEventListener('keydown', handleKeyDown)
})

// Rotation calculation
const spinnerRotation = computed(() => {
  return (scrollProgress.value / 100) * 720
})

// Synchronize scroll progress when scrolling natively or via drag
const onTrackScroll = () => {
  if (trackRef.value && trackRef.value.scrollLeft > 0) {
    dismissOverlay()
  }

  if (!trackRef.value || isTrackDragging.value || isSpinnerDragging.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = trackRef.value
  const maxScroll = scrollWidth - clientWidth
  if (maxScroll > 0) {
    scrollProgress.value = (scrollLeft / maxScroll) * 100
  }
}

/* --- TRACK DRAGGING LOGIC --- */
const startTrackDrag = (e) => {
  dismissOverlay()
    
  if (!trackRef.value) return
  isTrackDragging.value = true
  const pageX = e.touches ? e.touches[0].pageX : e.pageX
  trackStartX = pageX - trackRef.value.offsetLeft
  trackScrollLeft = trackRef.value.scrollLeft
}

const stopTrackDrag = () => {
  isTrackDragging.value = false
}

const onTrackDrag = (e) => {
  if (!isTrackDragging.value || !trackRef.value) return
  e.preventDefault()
  const pageX = e.touches ? e.touches[0].pageX : e.pageX
  const x = pageX - trackRef.value.offsetLeft
  const walk = (x - trackStartX) * 1.8
  trackRef.value.scrollLeft = trackScrollLeft - walk

  const maxScroll = trackRef.value.scrollWidth - trackRef.value.clientWidth
  if (maxScroll > 0) {
    scrollProgress.value = (trackRef.value.scrollLeft / maxScroll) * 100
  }
}

/* --- SPINNER DRAGGING LOGIC --- */
const startSpinnerDrag = (e) => {
  dismissOverlay()
  isSpinnerDragging.value = true
  onSpinnerDrag(e)
}

const stopSpinnerDrag = () => {
  isSpinnerDragging.value = false
}

const onSpinnerDrag = (e) => {
  if (!isSpinnerDragging.value || !navBarRef.value || !trackRef.value) return
  
  const rect = navBarRef.value.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  let offsetX = clientX - rect.left
  
  let percent = (offsetX / rect.width) * 100
  percent = Math.max(0, Math.min(100, percent))
  
  scrollProgress.value = percent
  
  const maxScroll = trackRef.value.scrollWidth - trackRef.value.clientWidth
  trackRef.value.scrollLeft = (percent / 100) * maxScroll
}

// State for active lightbox image
const activeImage = ref(null)

const openLightbox = (imageSrc) => {
  activeImage.value = imageSrc
}

const closeLightbox = () => {
  activeImage.value = null
}

// Close lightbox on Escape key press
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && activeImage.value) {
    closeLightbox()
  }
}
</script>

<style scoped>
@keyframes slide-hand {
  0%, 100% {
    transform: translateX(-25px);
  }
  50% {
    transform: translateX(25px);
  }
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>