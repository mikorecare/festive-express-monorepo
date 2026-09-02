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
let isRendered = false;

const renderTurnstile = () => {
  const container = document.getElementById("turnstile-container");
  if (!container) {
    console.error("Turnstile container not found");
    return;
  }

  if (!window.turnstile) {
    setTimeout(renderTurnstile, 500);
    return;
  }

  if (!props.siteKey) {
    console.error("Turnstile siteKey is missing");
    return;
  }

  if (isRendered) {
    console.log("Turnstile already rendered");
    return;
  }

  console.log("Rendering Turnstile with siteKey:", props.siteKey);
  container.innerHTML = "";

  try {
    // @ts-ignore
    widgetId = window.turnstile.render(container, {
      sitekey: props.siteKey,
      callback: (token: string) => {
        console.log(
          "Turnstile callback - token received, length:",
          token.length,
        );
        emit("success", token);
      },
      "error-callback": () => {
        console.error("Turnstile error callback");
        emit("error");
      },
      "expired-callback": () => {
        console.warn("Turnstile expired callback");
        emit("expired");
      },
      theme: "light",
      size: "normal",
    });
    isRendered = true;
    console.log("Turnstile rendered with widgetId:", widgetId);
  } catch (e) {
    console.error("Error rendering Turnstile:", e);
  }
};

const resetTurnstile = () => {
  console.log("Resetting Turnstile...");
  if (window.turnstile && widgetId !== null) {
    try {
      window.turnstile.reset(widgetId);
      isRendered = false;
      console.log("Turnstile reset successfully");
    } catch (e) {
      console.error("Error resetting Turnstile:", e);
      isRendered = false;
      renderTurnstile();
    }
  } else {
    isRendered = false;
    renderTurnstile();
  }
};

const getResponse = (): string | null => {
  if (window.turnstile && widgetId !== null) {
    try {
      const token = window.turnstile.getResponse(widgetId);
      if (token) {
        console.log("getResponse - token found, length:", token.length);
        return token;
      } else {
        console.warn("getResponse - no token available");
        return null;
      }
    } catch (e) {
      console.error("Error getting Turnstile response:", e);
      return null;
    }
  }
  console.warn("getResponse - Turnstile not available");
  return null;
};

defineExpose({
  reset: resetTurnstile,
  getResponse: getResponse,
});

onMounted(() => {
  console.log("TurnstileWidget mounted");
  if (!window.turnstile) {
    console.log("Loading Turnstile script...");
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Turnstile script loaded");
      renderTurnstile();
    };
    script.onerror = () => {
      console.error("Failed to load Turnstile script");
    };
    document.head.appendChild(script);
  } else {
    console.log("Turnstile already loaded");
    renderTurnstile();
  }
});
</script>
