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

onMounted(() => {
  const renderTurnstile = () => {
    const container = document.getElementById("turnstile-container");
    if (!container) return;
    if (!window.turnstile) {
      setTimeout(renderTurnstile, 500);
      return;
    }

    container.innerHTML = "";
    window.turnstile.render(container, {
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
