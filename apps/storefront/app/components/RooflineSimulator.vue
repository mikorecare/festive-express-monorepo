<template>
  <div class="roofline-simulator">
    <h3 class="simulator-title text-center">
      C-9 Lights Preview – {{ packageName }}
    </h3>

    <div class="simulator-layout">
      <!-- Main Preview -->
      <div class="preview-container" ref="previewRef">
        <img :src="backgroundImage" class="house-bg" alt="House Preview" />
        <canvas
          ref="canvasRef"
          class="scene-canvas"
          aria-label="Roofline lighting simulator"
        ></canvas>

        <!-- Wreath for Joy package -->
        <img
          v-if="showWreath"
          src="/Images/Holiday-Lighting-Package/mixed-noble-wreath.png"
          class="wreath-overlay"
          alt="24 inch Mixed Noble Wreath"
        />
      </div>
    </div>

    <!-- Color Selector (only Warm White, Pure White, Champagne) -->
    <div class="color-panel">
      <h4 class="text-center">Select C-9 Light Color</h4>
      <div class="color-options">
        <button
          v-for="color in lightColors"
          :key="color.value"
          class="color-btn"
          :class="{ active: selectedColor === color.value }"
          @click="changeColor(color.value)"
        >
          <span class="swatch" :style="{ backgroundColor: color.hex }"></span>
          <span class="label">{{ color.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";

const props = defineProps({
  packageName: {
    type: String,
    default: "Joy",
  },
  showWreath: {
    type: Boolean,
    default: true,
  },
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const previewRef = ref<HTMLElement | null>(null);

const lightColors = [
  {
    value: "warm-white",
    label: "Warm White",
    hex: "#F8D5A3",
    color: "#F8D5A3",
  },
  {
    value: "pure-white",
    label: "Pure White",
    hex: "#F0F4FF",
    color: "#FFFFFF",
  },
  { value: "champagne", label: "Champagne", hex: "#F5E8C7", color: "#F5E8C7" },
];

const selectedColor = ref("warm-white");
const backgroundImage = ref("/Images/night.webp"); // Use your night.webp

// Simplified roofline points (based on your original coordinates, scaled)
const rooflines = {
  roof1: [
    { x: 210, y: 383 },
    { x: 460, y: 235 },
    { x: 723, y: 382 },
  ],
  roof2: [
    { x: 720, y: 325 },
    { x: 940, y: 200 },
    { x: 1155, y: 318 },
  ],
  roof3: [
    { x: 1100, y: 400 },
    { x: 1290, y: 293 },
    { x: 1450, y: 380 },
  ],
  roof4: [
    { x: 800, y: 437 },
    { x: 1050, y: 435 },
  ],
  roof5: [
    { x: 1065, y: 428 },
    { x: 1540, y: 428 },
  ],
  roof6: [
    { x: 155, y: 415 },
    { x: 230, y: 415 },
  ],
  roof7: [
    { x: 700, y: 415 },
    { x: 770, y: 415 },
  ],
};

const roofOrder = [
  "roof6",
  "roof1",
  "roof7",
  "roof2",
  "roof4",
  "roof3",
  "roof5",
];

let animationId: number | null = null;
let bulbs: any[] = [];
let ctx: CanvasRenderingContext2D | null = null;
let currentColor = "#F8D5A3";

const DESIGN_WIDTH = 1690;
const DESIGN_HEIGHT = 862;

function buildBulbs() {
  const spacing = 22;
  const result: any[] = [];
  let globalIndex = 0;

  for (const roofName of roofOrder) {
    const points = (rooflines as any)[roofName];
    if (!points) continue;

    const segments = [];
    let pathLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      const len = Math.hypot(end.x - start.x, end.y - start.y);
      pathLength += len;
      segments.push({ start, end, length: len });
    }

    const bulbCount = Math.max(2, Math.round(pathLength / spacing));

    for (let local = 0; local <= bulbCount; local++) {
      const target = (local / bulbCount) * pathLength;
      let walked = 0;
      let point = points[0];
      let tangent = { x: 1, y: 0 };

      for (const seg of segments) {
        if (walked + seg.length >= target) {
          const t = (target - walked) / seg.length;
          point = {
            x: seg.start.x + (seg.end.x - seg.start.x) * t,
            y: seg.start.y + (seg.end.y - seg.start.y) * t,
          };
          tangent = {
            x: seg.end.x - seg.start.x,
            y: seg.end.y - seg.start.y,
          };
          const len = Math.hypot(tangent.x, tangent.y) || 1;
          tangent.x /= len;
          tangent.y /= len;
          break;
        }
        walked += seg.length;
      }

      result.push({
        x: point.x,
        y: point.y,
        globalIndex,
        offset: globalIndex * 0.28,
      });
      globalIndex++;
    }
  }
  return result;
}

function resizeCanvas() {
  if (!canvasRef.value || !previewRef.value) return;

  const canvas = canvasRef.value;
  const rect = previewRef.value.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scale = Math.max(
    rect.width / DESIGN_WIDTH,
    rect.height / DESIGN_HEIGHT,
  );
  const offsetX = (rect.width - DESIGN_WIDTH * scale) / 2;
  const offsetY = (rect.height - DESIGN_HEIGHT * scale) / 2;

  ctx.setTransform(
    scale * dpr,
    0,
    0,
    scale * dpr,
    offsetX * dpr,
    offsetY * dpr,
  );
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function draw() {
  if (!ctx || !canvasRef.value) return;

  ctx.clearRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  ctx.globalCompositeOperation = "screen";

  for (const bulb of bulbs) {
    const intensity = 0.85 + Math.sin(Date.now() / 800 + bulb.offset) * 0.15;

    // Glow
    const gradient = ctx.createRadialGradient(
      bulb.x,
      bulb.y,
      0,
      bulb.x,
      bulb.y,
      22,
    );
    gradient.addColorStop(0, hexToRgba(currentColor, 0.7 * intensity));
    gradient.addColorStop(0.4, hexToRgba(currentColor, 0.35 * intensity));
    gradient.addColorStop(1, hexToRgba(currentColor, 0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(bulb.x, bulb.y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Core
    const core = ctx.createRadialGradient(bulb.x, bulb.y, 0, bulb.x, bulb.y, 5);
    core.addColorStop(0, "rgba(255,255,255,0.95)");
    core.addColorStop(0.5, hexToRgba(currentColor, 0.9));
    core.addColorStop(1, hexToRgba(currentColor, 0.7));
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(bulb.x, bulb.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  animationId = requestAnimationFrame(draw);
}

function changeColor(value: string) {
  selectedColor.value = value;
  const found = lightColors.find((c) => c.value === value);
  if (found) {
    currentColor = found.color;
  }
}

onMounted(() => {
  bulbs = buildBulbs();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  draw();
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener("resize", resizeCanvas);
});
</script>

<style scoped>
.roofline-simulator {
  margin: 0px 0;
  /* padding: 24px; */
  background: #f8fafc;
  border-radius: 16px;
}

.simulator-title {
  font-size: 1.5rem;
  color: #1c2d5b;
  margin-bottom: 20px;
}

.simulator-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.preview-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 1690 / 862;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  background: #071321;
  transition:
    transform 0.5s ease,
    box-shadow 0.5s ease;
  margin: 0 auto;
}

/* .preview-container:hover {
  transform: scale(1.04);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
} */

.house-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.preview-container:hover .house-bg {
  transform: scale(1.08);
}

.scene-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  transition: transform 0.6s ease;
}

.preview-container:hover .scene-canvas {
  transform: scale(1.08);
}

.wreath-overlay {
  position: absolute;
  top: 32%;
  right: 18%;
  width: 110px;
  z-index: 5;
  transition: transform 0.6s ease;
}

.preview-container:hover .wreath-overlay {
  transform: scale(1.15);
}

.color-panel {
  background: white;
  padding: 28px 24px;
  border-radius: 12px;
  min-width: 260px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 100%;
  margin: 40px auto;
}

.color-panel h4 {
  text-align: center;
  margin-bottom: 20px;
  color: #1c2d5b;
  font-size: 1.1rem;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center the buttons */
  gap: 40px;
  align-items: center;
}

.color-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.25s;
  text-align: left;
}

.color-btn:hover {
  border-color: #f49321;
  background: white;
}

.color-btn.active {
  border-color: #f49321;
  background: #fff7ed;
  box-shadow: 0 4px 12px rgba(244, 147, 34, 0.2);
}

.swatch {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.label {
  font-weight: 600;
  color: #1c2d5b;
  font-size: 0.95rem;
}

.info-box {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #475569;
}

.info-box ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

.info-box li {
  margin-bottom: 4px;
}

@media (max-width: 900px) {
  .simulator-layout {
    flex-direction: column;
  }
  .color-panel {
    width: 100%;
  }
}
</style>
