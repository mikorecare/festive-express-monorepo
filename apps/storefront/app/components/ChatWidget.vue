<template>
  <ClientOnly>
    <div ref="chatContainer">
      <button v-if="widgetReady" class="custom-chat-btn" @click="toggleChat">
        <img src="/Images/chat.png" alt="Chat" />
      </button>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const chatContainer = ref<HTMLElement | null>(null);
const widgetReady = ref(false);

const token =
  "eyJhbGciOiJub25lIn0.eyJyIjoicHJvZHVjdGlvbiIsImkiOjI2MDksImEiOjUxNTIxOCwi cCI6Imh0dHBzOiIsImgiOiJjaGF0LmFjdG0ueHl6In0.";

let widgetInstance: any = null;

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

    const widget = document.createElement("div");
    widget.innerHTML = `<ctm-chat token="${token}"></ctm-chat>`;
    const chatElement = widget.firstElementChild;

    if (chatElement && chatContainer.value) {
      chatContainer.value.appendChild(chatElement);
      widgetInstance = chatElement;

      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Move the bubble off-screen but keep it functional
      try {
        const shadowRoot = widgetInstance.shadowRoot;
        if (shadowRoot) {
          const bubble = shadowRoot.querySelector(".bubble");
          if (bubble) {
            // Move it off-screen instead of hiding
            (bubble as HTMLElement).style.position = "fixed";
            (bubble as HTMLElement).style.bottom = "-9999px";
            (bubble as HTMLElement).style.right = "-9999px";
            (bubble as HTMLElement).style.opacity = "0";
            (bubble as HTMLElement).style.pointerEvents = "none";
            (bubble as HTMLElement).style.width = "1px";
            (bubble as HTMLElement).style.height = "1px";
          }
        }
      } catch (e) {}

      widgetReady.value = true;
    }
  } catch (error) {
    console.error("Failed to initialize chat widget:", error);
  }
};

const toggleChat = () => {
  if (!widgetInstance) return;

  try {
    // Try to find and click the bubble
    const shadowRoot = widgetInstance.shadowRoot;
    if (shadowRoot) {
      const bubble = shadowRoot.querySelector(".bubble");
      if (bubble) {
        // Restore the bubble temporarily for click
        const originalDisplay = (bubble as HTMLElement).style.display;
        const originalPosition = (bubble as HTMLElement).style.position;
        const originalBottom = (bubble as HTMLElement).style.bottom;
        const originalRight = (bubble as HTMLElement).style.right;
        const originalOpacity = (bubble as HTMLElement).style.opacity;
        const originalPointerEvents = (bubble as HTMLElement).style
          .pointerEvents;

        // Make it clickable briefly
        (bubble as HTMLElement).style.position = "fixed";
        (bubble as HTMLElement).style.bottom = "20px";
        (bubble as HTMLElement).style.right = "20px";
        (bubble as HTMLElement).style.opacity = "0.01";
        (bubble as HTMLElement).style.pointerEvents = "auto";
        (bubble as HTMLElement).style.width = "auto";
        (bubble as HTMLElement).style.height = "auto";

        // Click it
        (bubble as HTMLElement).click();

        // Move it back off-screen
        setTimeout(() => {
          (bubble as HTMLElement).style.position = "fixed";
          (bubble as HTMLElement).style.bottom = "-9999px";
          (bubble as HTMLElement).style.right = "-9999px";
          (bubble as HTMLElement).style.opacity = "0";
          (bubble as HTMLElement).style.pointerEvents = "none";
          (bubble as HTMLElement).style.width = "1px";
          (bubble as HTMLElement).style.height = "1px";
        }, 50);

        return;
      }
    }

    // Fallback: try widget methods
    if (typeof widgetInstance.toggle === "function") {
      widgetInstance.toggle();
    } else if (typeof widgetInstance.open === "function") {
      widgetInstance.open();
    }
  } catch (e) {
    console.error("Error toggling chat:", e);
  }
};

onMounted(() => {
  if (process.client) {
    initWidget();
  }
});
</script>

<style scoped>
.custom-chat-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 64px;
  height: 64px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 9999;
  transition: transform 0.3s ease;
}

.custom-chat-btn:hover {
  transform: scale(1.1);
}

.custom-chat-btn img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.custom-chat-btn:hover img {
  filter: drop-shadow(0 6px 20px rgba(244, 147, 33, 0.3));
}

@media (max-width: 640px) {
  .custom-chat-btn {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 400px) {
  .custom-chat-btn {
    width: 44px;
    height: 44px;
  }
}
</style>
