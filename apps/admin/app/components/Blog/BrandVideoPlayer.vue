<template>
  <div
    ref="containerRef"
    :class="{ 'is-fake-fs': isFakeFs }"
    class="holo-player group relative aspect-video overflow-hidden touch-manipulation select-none rounded-xl md:rounded-2xl my-6 md:my-8 mx-2 md:mx-3"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <video
      ref="videoRef"
      :src="src"
      class="absolute inset-0 h-full w-full cursor-pointer bg-[#0a1a3f] object-contain"
      playsinline
      preload="metadata"
      @click="onVideoClick"
      @play="onPlay"
      @pause="onPause"
      @ended="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @durationchange="onLoadedMetadata"
    ></video>

    <!-- Big play button (paused state) -->
    <div
      v-if="!isPlaying"
      class="absolute inset-0 z-10 flex items-center justify-center bg-[#0a1a3f]/35 backdrop-blur-[2px] cursor-pointer"
      @click="togglePlay"
    >
      <button
        type="button"
        aria-label="Play video"
        class="holo-play flex shrink-0 items-center justify-center rounded-full bg-[#2f8cff]/25 backdrop-blur-md border-2 md:border-[3px] border-[#a5e6ff] w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 active:scale-95 md:hover:scale-110 transition-transform"
        @click.stop="togglePlay"
      >
        <svg
          class="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white ml-0.5 md:ml-1 drop-shadow-[0_0_6px_rgba(150,225,255,0.9)]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>

    <!-- Thin progress line while controls are hidden -->
    <div
      class="absolute bottom-0 left-0 right-0 z-10 h-1 bg-white/20 pointer-events-none transition-opacity duration-300"
      :class="controlsShown ? 'opacity-0' : 'opacity-100'"
    >
      <div
        class="h-full bg-[#6fd3ff] shadow-[0_0_8px_#6fd3ff]"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <!-- Floating glass control bar -->
    <div
      class="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-3 sm:left-3 sm:right-3 z-20 pointer-events-none transition-opacity duration-300"
      :class="controlsShown ? 'opacity-100' : 'opacity-0'"
    >
      <div
        class="holo-bar rounded-lg sm:rounded-xl overflow-hidden"
        :class="controlsShown ? 'pointer-events-auto' : 'pointer-events-none'"
      >
        <!-- Buttons row -->
        <div class="flex items-center gap-1 px-1.5 sm:px-3 pt-0.5 text-white">
          <button
            type="button"
            class="holo-icon flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center transition-colors"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
            @click="togglePlay"
          >
            <svg
              v-if="isPlaying"
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <svg
              v-else
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <span
            class="text-[11px] sm:text-xs font-mono tracking-wide text-[#d4f1ff] [text-shadow:0_0_8px_rgba(111,211,255,0.8)]"
          >
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>

          <div class="ml-auto flex items-center">
            <button
              type="button"
              class="holo-icon flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center transition-colors"
              :aria-label="isMuted ? 'Unmute' : 'Mute'"
              @click="toggleMute"
            >
              <svg
                v-if="isMuted"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                />
              </svg>
            </button>

            <button
              type="button"
              class="holo-icon flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center transition-colors"
              aria-label="Fullscreen"
              @click="toggleFullscreen"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Seek bar -->
        <input
          type="range"
          class="seek w-full"
          min="0"
          :max="duration || 0"
          step="0.1"
          :value="currentTime"
          :style="{ '--p': progress + '%' }"
          aria-label="Seek"
          @input="onSeek"
          @pointerdown="isSeeking = true"
          @pointerup="onSeekEnd"
          @pointercancel="onSeekEnd"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

defineProps({
  src: { type: String, required: true },
});

const HIDE_DELAY = 2500;
const isFakeFs = ref(false);
const containerRef = ref(null);
const videoRef = ref(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const isSeeking = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const controlsVisible = ref(true);
const isTouch = ref(false);
let hideTimer = null;

const progress = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0,
);

// Controls are always visible when paused, otherwise only when "awake"
const controlsShown = computed(() => !isPlaying.value || controlsVisible.value);

onMounted(() => {
  isTouch.value = window.matchMedia("(hover: none)").matches;
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  clearTimeout(hideTimer);
  document.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});

// --- Controls visibility ---
const showControls = () => {
  controlsVisible.value = true;
  clearTimeout(hideTimer);
  if (isPlaying.value && !isSeeking.value) {
    hideTimer = setTimeout(() => {
      controlsVisible.value = false;
    }, HIDE_DELAY);
  }
};

const onPointerMove = (e) => {
  if (e.pointerType === "mouse") showControls();
};

const onPointerLeave = (e) => {
  if (e.pointerType === "mouse" && isPlaying.value) {
    clearTimeout(hideTimer);
    controlsVisible.value = false;
  }
};

// --- Playback ---
const onPlay = () => {
  isPlaying.value = true;
  showControls();
};

const onPause = () => {
  isPlaying.value = false;
  clearTimeout(hideTimer);
  controlsVisible.value = true;
};

const togglePlay = () => {
  const v = videoRef.value;
  if (!v) return;
  v.paused ? v.play() : v.pause();
};

// Touch: first tap reveals controls, second tap pauses. Mouse: click toggles.
const onVideoClick = () => {
  if (isTouch.value && isPlaying.value && !controlsVisible.value) {
    showControls();
    return;
  }
  togglePlay();
  showControls();
};

const onTimeUpdate = () => {
  if (!isSeeking.value) currentTime.value = videoRef.value.currentTime;
};

const onLoadedMetadata = () => {
  const d = videoRef.value.duration;
  duration.value = Number.isFinite(d) ? d : 0;
};

// --- Seeking ---
const onSeek = (e) => {
  const time = Number(e.target.value);
  videoRef.value.currentTime = time;
  currentTime.value = time;
  showControls();
};

const onSeekEnd = () => {
  isSeeking.value = false;
  showControls();
};

// --- Volume / Fullscreen ---
const toggleMute = () => {
  videoRef.value.muted = !videoRef.value.muted;
  isMuted.value = videoRef.value.muted;
  showControls();
};

const enterFake = () => {
  isFakeFs.value = true;
  document.body.style.overflow = "hidden";
};

const exitFake = () => {
  isFakeFs.value = false;
  document.body.style.overflow = "";
};

const onKeydown = (e) => {
  if (e.key === "Escape" && isFakeFs.value) exitFake();
};

const toggleFullscreen = async () => {
  if (isFakeFs.value) return exitFake();

  const nativeEl =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (nativeEl) {
    (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    return;
  }

  const el = containerRef.value;
  const v = videoRef.value;
  if (!el || !v) return;

  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
      return;
    }
    if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
      return;
    }
  } catch (err) {
    console.warn("Container fullscreen refused:", err);
  }

  if (v.webkitEnterFullscreen && v.readyState >= 1) {
    try {
      v.webkitEnterFullscreen();
      return;
    } catch (err) {
      console.warn("Video fullscreen refused:", err);
    }
  }

  enterFake();
};

const formatTime = (time) => {
  if (!time || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
</script>

<style scoped>
/* ---------- Holo frame ---------- */
.holo-player {
  background: linear-gradient(135deg, #0b1f4d, #0a2a66);
  border: 1.5px solid rgba(150, 215, 255, 0.9);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.12),
    0 0 12px rgba(70, 170, 255, 0.6),
    0 0 30px rgba(70, 170, 255, 0.3);
}

@media (min-width: 768px) {
  .holo-player {
    border-width: 2px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.15),
      0 0 18px rgba(70, 170, 255, 0.65),
      0 0 46px rgba(70, 170, 255, 0.3);
  }
}

/* Glass sheen, inner glow and faint scanlines over the video */
.holo-player::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 0 18px rgba(120, 200, 255, 0.45);
  background:
    linear-gradient(
      115deg,
      rgba(255, 255, 255, 0.16) 0%,
      rgba(255, 255, 255, 0) 30%
    ),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.035) 0 1px,
      transparent 1px 3px
    );
}

/* ---------- Glass control bar ---------- */
.holo-bar {
  background: linear-gradient(
    135deg,
    rgba(40, 120, 255, 0.28),
    rgba(10, 40, 110, 0.5)
  );
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(150, 215, 255, 0.6);
  box-shadow:
    0 0 12px rgba(70, 170, 255, 0.45),
    inset 0 0 10px rgba(120, 200, 255, 0.2);
}

.holo-icon {
  color: #e6f7ff;
  filter: drop-shadow(0 0 4px rgba(111, 211, 255, 0.7));
}
.holo-icon:hover,
.holo-icon:active {
  color: #9be4ff;
}

.holo-play {
  box-shadow:
    0 0 18px rgba(90, 190, 255, 0.8),
    inset 0 0 12px rgba(150, 220, 255, 0.5);
}

/* ---------- Seek bar ---------- */
.seek {
  -webkit-appearance: none;
  appearance: none;
  display: block;
  height: 24px;
  margin: 0;
  padding: 0 10px;
  box-sizing: border-box;
  background:
    linear-gradient(to right, #6fd3ff var(--p, 0%), transparent var(--p, 0%))
      center / calc(100% - 20px) 5px no-repeat,
    linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25))
      center / calc(100% - 20px) 5px no-repeat;
  cursor: pointer;
  outline: none;
  touch-action: pan-y;
  border-radius: 9999px;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
}

.seek::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  background: transparent;
  height: 24px;
}

.seek::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  margin-top: 4px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #6fd3ff;
  box-shadow: 0 0 8px #6fd3ff;
}

.seek::-moz-range-track {
  background: transparent;
  height: 24px;
}

.seek::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #6fd3ff;
  box-shadow: 0 0 8px #6fd3ff;
}

@media (hover: none) {
  .seek::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    margin-top: 2px;
  }
  .seek::-moz-range-thumb {
    width: 16px;
    height: 16px;
  }
}

/* ---------- Fullscreen ---------- */
.holo-player:fullscreen,
.holo-player:-webkit-full-screen {
  aspect-ratio: auto;
  width: 100vw;
  height: 100vh;
  margin: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  background: #000;
}

.holo-player:fullscreen::after,
.holo-player:-webkit-full-screen::after {
  display: none;
}

.holo-player:fullscreen video,
.holo-player:-webkit-full-screen video {
  object-fit: contain;
}

.holo-player.is-fake-fs {
  position: fixed !important;
  inset: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  aspect-ratio: auto;
  margin: 0 !important;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  background: #000;
}

.holo-player.is-fake-fs::after {
  display: none;
}

/* ---------- Fix for mobile bottom nav in fullscreen ---------- */
.holo-player:fullscreen .absolute.bottom-1\.5,
.holo-player:-webkit-full-screen .absolute.bottom-1\.5,
.holo-player.is-fake-fs .absolute.bottom-1\.5 {
  bottom: calc(4rem + env(safe-area-inset-bottom, 0px)) !important;
}
</style>
