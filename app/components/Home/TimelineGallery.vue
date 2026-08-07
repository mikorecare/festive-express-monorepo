<template>
  <section class="timeline-section">

    <div class="timeline-header">
        <h2 v-fade class="section-title text-uppercase">Our Wonderful <span class="highlight">HOLIDAY</span> Stories</h2>
        <p v-fade class="subtitle">Journey through our favorite seasonal moments and cherished memories captured over the years.</p>
    </div>
    
    <!-- Interactive Guidance Overlay -->
    <Transition name="fade">
      <div 
        v-if="showOverlay" 
        class="drag-hint-overlay" 
        @click="dismissOverlay"
        @mousedown="dismissOverlay"
        @touchstart.passive="dismissOverlay"
      >
        <div class="hint-content">
          <h2 class="hint-title">CLICK &amp; DRAG TO NAVIGATE</h2>
          <p class="hint-subtitle">Move the cursor left and right to view our gallery.</p>
          
          <!-- Animated Hand Icon -->
          <div class="hand-icon-wrapper">
            <svg class="hand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 11V6a2 2 0 0 0-4 0v5" />
              <path d="M14 10V4a2 2 0 0 0-4 0v6" />
              <path d="M10 10.5V6a2 2 0 0 0-4 0v9" />
              <path d="M18 11a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.8-6.7-2.8l-3.2-3.2a2 2 0 0 1 2.8-2.8l1.1 1.1" />
            </svg>
            <div class="drag-arrows">
              <span>&larr;</span>
              <span class="dots">&bull;&bull;&bull;</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Horizontal Scroll Track with Mouse Drag & Touch Support -->
    <div 
      ref="trackRef" 
      class="timeline-track"
      :class="{ 'is-dragging': isTrackDragging }"
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
        <div class="timeline-card">
          <!-- Image Left Layout -->
          <template v-if="item.imagePosition === 'left'">
            <div v-if="item.image" class="card-media">
              <img :src="item.image" :alt="item.year || 'Gallery Image'" draggable="false" />
            </div>
            <div v-if="item.year || item.description" class="card-content">
              <span v-if="item.year" class="year-header">{{ item.year }}</span>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
          </template>

          <!-- Image Right Layout -->
          <template v-else>
            <div v-if="item.year || item.description" class="card-content">
              <span v-if="item.year" class="year-header">{{ item.year }}</span>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
            <div v-if="item.image" class="card-media">
              <img :src="item.image" :alt="item.year || 'Gallery Image'" draggable="false" />
            </div>
          </template>
        </div>

        <!-- Optional Centerpiece/Divider between cards -->
        <div v-if="item.dividerImage" class="timeline-divider">
          <img :src="item.dividerImage" alt="Timeline Divider" draggable="false" />
        </div>

      </template>
    </div>

    <!-- Bottom Ornament Navigation Bar -->
    <div ref="navBarRef" class="timeline-nav-bar">
      <div class="nav-track-line"></div>

      <!-- Draggable Spinner Indicator -->
       <!-- :style="{ left: scrollProgress + '%', transform: `translateX(-50%) rotate(${spinnerRotation}deg)` }" -->
      <div 
        class="spinner-indicator"
        :class="{ 'is-dragging': isSpinnerDragging }"
        :style="{ left: scrollProgress + '%' }"
        @mousedown="startSpinnerDrag"
        @touchstart="startSpinnerDrag"
        >
        <img :src="spinnerImage" alt="Timeline Ornament" draggable="false" />
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
  // Start strong with a fun portrait instead of a dark house exterior
  { id: 7, year: '', description: '', image: '/Images/Gallery/Festive-Images-7.webp', imagePosition: 'right', dividerImage: null },
  { id: 13, year: '', description: '', image: '/Images/Gallery/Festive-Images-13.webp', imagePosition: 'left', dividerImage: null },
  { id: 1, year: '', description: '', image: '/Images/Gallery/Festive-Images-1.webp', imagePosition: 'right', dividerImage: null },
  { id: 17, year: '', description: '', image: '/Images/Gallery/Festive-Images-17.webp', imagePosition: 'right', dividerImage: null },

  // Group selfie / fun shot mid-early section
  { id: 14, year: '', description: '', image: '/Images/Gallery/Festive-Images-14.webp', imagePosition: 'right', dividerImage: null },
  { id: 10, year: '', description: '', image: '/Images/Gallery/Festive-Images-10.webp', imagePosition: 'right', dividerImage: null },
  { id: 9, year: '', description: '', image: '/Images/Gallery/Festive-Images-9.webp', imagePosition: 'right', dividerImage: null },
  { id: 4, year: '', description: '', image: '/Images/Gallery/Festive-Images-4.webp', imagePosition: 'right', dividerImage: null },

  // Playful character photo near the middle
  { id: 15, year: '', description: '', image: '/Images/Gallery/Festive-Images-15.webp', imagePosition: 'right', dividerImage: null },
  { id: 8, year: '', description: '', image: '/Images/Gallery/Festive-Images-8.webp', imagePosition: 'right', dividerImage: null },
  { id: 18, year: '', description: '', image: '/Images/Gallery/Festive-Images-18.webp', imagePosition: 'right', dividerImage: null },
  { id: 2, year: '', description: '', image: '/Images/Gallery/Festive-Images-2.webp', imagePosition: 'right', dividerImage: null },

  // Colorful pathway detail leading into the final stretch
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
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onSpinnerDrag)
  window.removeEventListener('mouseup', stopSpinnerDrag)
  window.removeEventListener('touchmove', onSpinnerDrag)
  window.removeEventListener('touchend', stopSpinnerDrag)
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
</script>

<style scoped>
.timeline-header {
  text-align: center;
  padding: 0 20px 20px;
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
}

.section-title {
  font-weight: 800;
  color: #ffffff;
}

.subtitle {
    color: #fff;
}


.timeline-section {
  width: 100%;
  background-color: #0c1a35;
  color: #ffffff;
  padding: 80px 0;
  position: relative;
  overflow: hidden;
  background-image: url(/Images/LV.png);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
}

/* Horizontal Scroll Container */
.timeline-track {
  display: flex;
  align-items: center;
  gap: 60px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 20px 80px;
  cursor: grab;
  user-select: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.timeline-track.is-dragging {
  cursor: grabbing;
  scroll-behavior: auto;
}

.timeline-track::-webkit-scrollbar {
  display: none;
}

/* Card Layout */
.timeline-card {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

/* Card Media Responsive Base */
.card-media {
  flex-shrink: 0;
  width: 100%;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 16 / 10;
    background-color: #f0f0f0;
    border: 3px solid #f0f0f0;
    border-radius: 2px;
    box-shadow: 1px 1px 3px 2px #8b8b8b;
}

.card-media img {
  width: 100%;
  height: 280px;
  max-width: 400px; /* Limits maximum width on large displays */
  object-fit: cover;
  /* border-radius: 10px; */
  pointer-events: none; /* Prevents native image drag breaking scroll */
  display: block;
}

/* Tablet & Mobile Responsiveness */
@media (max-width: 768px) {
  .card-media img {
    height: 200px; /* Reduces image height on smaller viewports */
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .card-media img {
    height: 160px; /* Optimized height for mobile screens */
    max-width: 220px;
  }
}

.year-header {
  font-size: 3.5rem;
  font-weight: 800;
  color: #d18d45;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-content p {
  font-size: 0.92rem;
  line-height: 1.6;
  color: #cfd8e8;
}

.timeline-divider img {
  height: 320px;
  flex-shrink: 0;
  pointer-events: none;
}

/* Bottom Ornament Nav Bar */
.timeline-nav-bar {
  position: relative;
  width: 85%;
  max-width: 1100px;
  height: 60px;
  margin: 20px auto 0;
  display: flex;
  align-items: center;
}

.nav-track-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff7a00, #ff9e43, #ff7a00);
  transform: translateY(-50%);
  border-radius: 2px;
}

.spinner-indicator {
  position: absolute;
  top: 50%;
  width: 70px;
  height: 70px;
  margin-top: -35px;
  transform: translateX(-50%); /* Centering handled here instead of inline style */
  cursor: grab;
  user-select: none;
  touch-action: none;
  z-index: 5;
  transition: none; /* Prevents CSS transitions from causing lag/jitter during drag */
  will-change: left; /* Helps browser render smooth movement */
}

.spinner-indicator.is-dragging {
  cursor: grabbing;
}

.spinner-indicator img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  transform: scaleX(-1);
}

/* Overlay Layer */
.drag-hint-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(12, 26, 53, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  cursor: pointer;
}

.hint-content {
  text-align: center;
  color: #ffffff;
  pointer-events: none;
  padding: 20px;
}

.hint-title {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 8px;
  color: #ffffff;
  text-transform: uppercase;
}

.hint-subtitle {
  font-size: 1rem;
  color: #d1dbe8;
  margin-bottom: 24px;
}

/* Hand & Arrows Animation */
.hand-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: slide-hand 1.8s ease-in-out infinite;
}

.hand-icon {
  width: 48px;
  height: 48px;
  stroke: #ffffff;
}

.drag-arrows {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.2rem;
  color: #1cb5a3;
  font-weight: bold;
}

/* Slide Left to Right Animation */
@keyframes slide-hand {
  0%, 100% {
    transform: translateX(-25px);
  }
  50% {
    transform: translateX(25px);
  }
}

/* Smooth Vue Transition Fade Out */
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>