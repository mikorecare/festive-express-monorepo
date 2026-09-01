<template>
  <ClientOnly>
    <div ref="chatContainer"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const chatContainer = ref<HTMLElement | null>(null);
const token =
  "eyJhbGciOiJub25lIn0.eyJyIjoicHJvZHVjdGlvbiIsImkiOjI2MDksImEiOjUxNTIxOCwicCI6Imh0dHBzOiIsImgiOiJjaGF0LmFjdG0ueHl6In0.";

const loadScript = () => {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="https://chat.actm.xyz/chat.js"]')) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://chat.actm.xyz/chat.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const initWidget = async () => {
  try {
    await loadScript();

    if (customElements?.whenDefined) {
      await customElements.whenDefined("ctm-chat");
    } else {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    if (chatContainer.value?.querySelector("ctm-chat")) return;

    const widget = document.createElement("div");
    widget.innerHTML = `<ctm-chat token="${token}"></ctm-chat>`;
    const chatElement = widget.firstElementChild;

    if (chatElement && chatContainer.value) {
      chatContainer.value.appendChild(chatElement);
      console.log("Chat widget mounted successfully");
    } else {
      if (chatContainer.value) {
        chatContainer.value.insertAdjacentHTML(
          "beforeend",
          `<ctm-chat token="${token}"></ctm-chat>`,
        );
      }
    }
  } catch (error) {
    console.error("Failed to initialize chat widget:", error);
  }
};

const open = () => {
  const widget = chatContainer.value?.querySelector("ctm-chat") as any;
  if (widget?.open) widget.open();
};

const close = () => {
  const widget = chatContainer.value?.querySelector("ctm-chat") as any;
  if (widget?.close) widget.close();
};

const toggle = () => {
  const widget = chatContainer.value?.querySelector("ctm-chat") as any;
  if (widget?.toggle) widget.toggle();
};

defineExpose({ open, close, toggle });

onMounted(() => {
  if (process.client) {
    initWidget();
  }
});
</script>
