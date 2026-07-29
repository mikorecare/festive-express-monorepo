<template>
  <div>

    <!-- Hero Banner -->
    <section class="page-hero">
      <div class="hero-overlay">
        <div class="container">
            <div class="hero-content">
                <h1>GALLERY</h1>
                <p class="breadcrumb">HOME / GALLERY</p>
            </div>
        </div>
      </div>
    </section>

    <!-- Gallery Grid -->
    <div class="page-main-section container">
        <div class="section-header">
            <h2 class="section-title">Our Works in Focus</h2>
            <!-- <p class="subtitle">Worry-free lighting with all the essentials handled by FLP</p> -->
        </div>
        <div class="gallery-grid">
            <div 
                v-for="(image, index) in galleryImages" 
                :key="index"
                class="gallery-item"
                @click="openLightbox(index)"
            >
                <img :src="image.thumb" :alt="image.title">
                <div class="overlay">
                    <span class="view-text">View Full</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxVisible" class="lightbox" @click.self="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">×</button>
      
      <button class="nav-btn prev" @click="prevImage">‹</button>
      <img :src="galleryImages[currentIndex].full" class="lightbox-image" alt="Enlarged view">
      <button class="nav-btn next" @click="nextImage">›</button>

      <div class="lightbox-caption">
        {{ galleryImages[currentIndex].title }}
      </div>
    </div>

    <Newsletter />
  </div>
</template>

<script setup lang="ts">
const galleryImages = [
  { thumb: '/Images/Gallery/1-web-or-mls-4605-5th-Ave-NE3-1024x768.jpg', full: '/Images/Gallery/1-web-or-mls-4605-5th-Ave-NE3-1024x768.jpg', title: 'Elegant Roofline Lighting' },
  { thumb: '/Images/Gallery/4-web-or-mls-4605-5th-Ave-NE6-1024x768.jpg', full: '/Images/Gallery/4-web-or-mls-4605-5th-Ave-NE6-1024x768.jpg', title: 'Palm Tree Lighting' },
  { thumb: '/Images/Gallery/6-web-or-mls-4605-5th-Ave-NE8-1024x768.jpg', full: '/Images/Gallery/6-web-or-mls-4605-5th-Ave-NE8-1024x768.jpg', title: 'Modern Home Display' },
  // Add more images as needed
]

const lightboxVisible = ref(false)
const currentIndex = ref(0)

const openLightbox = (index: number) => {
  currentIndex.value = index
  lightboxVisible.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxVisible.value = false
  document.body.style.overflow = 'visible'
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % galleryImages.length
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + galleryImages.length) % galleryImages.length
}
</script>

<style scoped>
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 60px 0;
}

.gallery-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 16 / 10;
    background-color: rgb(240, 240, 240);
    border-width: 3px;
    border-style: solid;
    border-color: rgb(240, 240, 240);
    border-radius: 2px;
    box-shadow: rgb(139, 139, 139) 1px 1px 3px 2px;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.gallery-item:hover img {
  transform: scale(1.08);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.gallery-item:hover .overlay {
  opacity: 1;
}

.view-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.lightbox-image {
  max-width: 90%;
  max-height: 85vh;
  border-radius: 12px;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10000;
}

.prev { left: 30px; }
.next { right: 30px; }

.lightbox-close {
  position: absolute;
  top: 30px;
  right: 40px;
  font-size: 3rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 10000;
}

.lightbox-caption {
  position: absolute;
  bottom: 40px;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  width: 100%;
}
</style>