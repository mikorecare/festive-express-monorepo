<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-slate-100 border border-slate-200"
    style="
      box-shadow:
        0 10px 30px -10px rgba(15, 23, 42, 0.15),
        inset 0 4px 10px rgba(255, 255, 255, 0.9),
        inset 0 -4px 10px rgba(15, 23, 42, 0.06);
    "
  >
    <div class="relative h-[220px] sm:h-[260px]">
      <!-- 1. UNDERNEATH: The Message -->
      <div
        class="absolute inset-3 z-0 flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center border border-slate-200"
      >
        <!-- THE VOUCHER CODE -->
        <p
          class="text-[#F49321] font-black text-5xl sm:text-6xl tracking-wide mb-1 [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_4px_10px_rgba(244,147,33,0.4)]"
        >
          FEX500
        </p>

        <!-- Headline -->
        <h2
          class="font-poppins font-extrabold text-[#1C2D5B] text-lg sm:text-xl leading-tight mb-1.5 [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_4px_rgba(28,45,91,0.35)]"
        >
          Take advantage of<br />$500 discount
        </h2>

        <!-- Subhead -->
        <p
          class="text-[#1C2D5B] font-extrabold text-[10px] sm:text-xs leading-relaxed tracking-wide max-w-[200px] [text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff,_0_2px_4px_rgba(28,45,91,0.2)]"
        >
          Your seasonal lighting package just got a little brighter.
        </p>
      </div>

      <!-- 2. THE SCRATCH LAYER -->
      <div class="absolute inset-3 z-10 rounded-xl overflow-hidden">
        <canvas
          ref="canvasRef"
          class="w-full h-full cursor-grab active:cursor-grabbing"
          style="
            touch-action: none;
            user-select: none;
            -webkit-user-select: none;
          "
          @pointerdown="handlePointerDown"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerUp"
          @pointercancel="handlePointerUp"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const ORANGE = "#F49321";
const COVER_SRC = "/Images/LV-4.png";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDrawingRef = ref(false);
const lastPointRef = ref<{ x: number; y: number } | null>(null);
const coverLoaded = ref(false);

let coverImage: HTMLImageElement | null = null;

const drawCover = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const width = canvas.parentElement?.offsetWidth || 0;
  const height = canvas.parentElement?.offsetHeight || 0;

  if (width === 0 || height === 0) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 1) Clear / Setup
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, width, height);

  // 2) Image on top (stretched to fill the whole canvas)
  if (coverImage && coverImage.complete && coverImage.naturalWidth > 0) {
    // Stretch to fill
    ctx.drawImage(coverImage, 0, 0, width, height);
  }

  // 3) Text on top (Responsive Font Size)
  ctx.fillStyle = ORANGE;
  // Scale font size based on width, but cap it so it doesn't get huge on desktop
  const fontSize = Math.min(width * 0.08, 26); 
  
  ctx.font = `bold ${fontSize}px 'Acier Bat', cursive`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  (ctx as any).letterSpacing = "2px"; // Reduced slightly for tighter mobile fit
  
  // Draw text centered
  ctx.fillText("Scratch to reveal", width / 2, height / 2);

  // 4) Setup scratch mode
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 38;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  coverLoaded.value = true;
};

onMounted(() => {
  coverImage = new Image();
  coverImage.onerror = () => console.error("Failed to load cover:", COVER_SRC);
  coverImage.src = COVER_SRC;

  const startDrawing = () => {
    if (coverImage?.complete) {
      drawCover();
    } else {
      coverImage!.onload = drawCover;
    }
  };

  // Wait for layout to be ready
  let attempts = 0;
  const interval = setInterval(() => {
    const canvas = canvasRef.value;
    if (canvas && canvas.parentElement?.offsetWidth! > 0) {
      clearInterval(interval);
      startDrawing();
    }
    if (++attempts > 200) clearInterval(interval);
  }, 20);

  onBeforeUnmount(() => clearInterval(interval));
});

// Pointer functions remain the same...
const getPointerPosition = (event: PointerEvent) => {
  const canvas = canvasRef.value!;
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
};

const handlePointerDown = (event: PointerEvent) => {
  if (!coverLoaded.value) return;
  event.preventDefault();

  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.setPointerCapture(event.pointerId);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const point = getPointerPosition(event);
  isDrawingRef.value = true;
  lastPointRef.value = point;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(point.x, point.y, 19, 0, Math.PI * 2);
  ctx.fill();
};

const handlePointerMove = (event: PointerEvent) => {
  if (!isDrawingRef.value) return;
  event.preventDefault();

  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const current = getPointerPosition(event);
  const previous = lastPointRef.value;
  if (!previous) {
    lastPointRef.value = current;
    return;
  }

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.moveTo(previous.x, previous.y);
  ctx.lineTo(current.x, current.y);
  ctx.stroke();

  lastPointRef.value = current;
};

const handlePointerUp = (event: PointerEvent) => {
  if (!isDrawingRef.value) return;
  const canvas = canvasRef.value;
  if (canvas && canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
  isDrawingRef.value = false;
  lastPointRef.value = null;
};
</script>