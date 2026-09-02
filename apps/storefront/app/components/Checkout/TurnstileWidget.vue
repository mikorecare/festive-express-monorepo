<template>
  <div class="mt-4 px-3 bg-gray-50 rounded-lg">
    <div class="flex justify-center min-h-max">
      <div id="turnstile-container"></div>
    </div>
  </div>
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

let widgetId: any = null;

const renderTurnstile = () => {
  const container = document.getElementById("turnstile-container");
  if (!container) return;
  if (!window.turnstile) {
    setTimeout(renderTurnstile, 500);
    return;
  }
  if (!props.siteKey) {
    console.error("Turnstile siteKey is missing");
    return;
  }
  container.innerHTML = "";
  // @ts-ignore
  widgetId = window.turnstile.render(container, {
    sitekey: props.siteKey,
    callback: (token: string) => {
      emit("success", token);
    },
    "error-callback": () => {
      emit("error");
    },
    "expired-callback": () => {
      emit("expired");
    },
    theme: "light",
    size: "normal",
  });
};

const resetTurnstile = () => {
  if (window.turnstile && widgetId) {
    try {
      window.turnstile.reset(widgetId);
    } catch (e) {
      renderTurnstile();
    }
  } else {
    renderTurnstile();
  }
};

// ✅ Add getResponse method with proper return type
const getResponse = (): string | null => {
  if (window.turnstile && widgetId) {
    try {
      const token = window.turnstile.getResponse(widgetId);
      return token || null;
    } catch (e) {
      console.error("Error getting Turnstile response:", e);
      return null;
    }
  }
  return null;
};

// ✅ Define what's exposed to parent components
defineExpose({
  reset: resetTurnstile,
  getResponse: getResponse,
});

onMounted(() => {
  if (!window.turnstile) {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderTurnstile;
    document.head.appendChild(script);
  } else {
    renderTurnstile();
  }
});
</script>
