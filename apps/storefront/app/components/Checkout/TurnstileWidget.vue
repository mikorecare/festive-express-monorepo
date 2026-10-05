<template>
  <ClientOnly>
    <div class="mt-1 px-3 bg-transparent rounded-lg">
      <div class="mt-1 px-3">
        <div :id="containerId" class="flex justify-center w-full h-[65px]"></div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  siteKey: string;
  errors: { turnstile: string };
  status: string;
  statusType: string;
  statusClass: string;
  statusIcon: string;
}>();

const emit = defineEmits<{
  (e: "success", token: string): void;
  (e: "error"): void;
  (e: "expired"): void;
}>();

const containerId = `turnstile-${Math.random().toString(36).slice(2, 10)}`;
let widgetId: any = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;

const clearPoll = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const tryRender = () => {
  // @ts-ignore
  const ts = window.turnstile;
  if (!ts || typeof ts.render !== "function") return false;

  const container = document.getElementById(containerId);
  if (!container) return false;

  // Don't double-render into the same container
  if (container.querySelector("iframe")) return true;

  // Bail out if the container has no size yet
  const rect = container.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  try {
    widgetId = ts.render(container, {
      sitekey: props.siteKey,
      callback: (token: string) => emit("success", token),
      "error-callback": () => emit("error"),
      "expired-callback": () => emit("expired"),
      theme: "light",
      size: "normal",
    });
    clearPoll();
    return true;
  } catch (e) {
    console.error("Turnstile render failed:", e);
    return false;
  }
};

const resetTurnstile = () => {
  // @ts-ignore
  const ts = window.turnstile;
  if (ts && widgetId) {
    try {
      ts.reset(widgetId);
      return;
    } catch {
      // fall through
    }
  }
  widgetId = null;
  tryRender();
};

defineExpose({ reset: resetTurnstile });

onMounted(() => {
  // Inject the script once, guarded to prevent duplicate loads
  if (
    !document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]',
    )
  ) {
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  // Poll until it's ready AND the container has real dimensions
  pollTimer = setInterval(() => {
    if (tryRender()) clearPoll();
  }, 200);

  tryRender();
});

onUnmounted(() => {
  clearPoll();
  // @ts-ignore
  if (window.turnstile && widgetId) {
    try {
      // @ts-ignore
      window.turnstile.remove(widgetId);
    } catch {
      // ignore
    }
    widgetId = null;
  }
});
</script>
