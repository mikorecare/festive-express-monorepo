<template>
  <ClientOnly>
    <div ref="chatContainer">
      <button
        v-if="widgetReady"
        class="custom-chat-btn"
        @click="toggleChat"
      >
        <img
          src="/Images/chat.png"
          alt="Chat"
        />
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
    if (
      document.querySelector(
        'script[src="https://chat.actm.xyz/chat.js"]'
      )
    ) {
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

      setTimeout(() => {
        try {
          const shadowRoot = chatElement.shadowRoot;

          if (shadowRoot) {
            const bubble = shadowRoot.querySelector(".bubble");

            if (bubble) {
              (bubble as HTMLElement).style.display = "none";
            }
          }
        } catch (e) {}

        widgetReady.value = true;
      }, 500);
    } else if (chatContainer.value) {
      chatContainer.value.insertAdjacentHTML(
        "beforeend",
        `<ctm-chat token="${token}"></ctm-chat>`
      );

      widgetInstance = chatContainer.value.querySelector("ctm-chat");

      setTimeout(() => {
        widgetReady.value = true;
      }, 500);
    }
  } catch (error) {
    console.error("Failed to initialize chat widget:", error);
  }
};

const toggleChat = () => {
  if (widgetInstance) {
    try {
      const shadowRoot = widgetInstance.shadowRoot;

      if (shadowRoot) {
        const bubble = shadowRoot.querySelector(".bubble");

        if (bubble) {
          (bubble as HTMLElement).click();
          return;
        }
      }
    } catch (e) {}

    if (typeof widgetInstance.toggle === "function") {
      widgetInstance.toggle();
    } else if (typeof widgetInstance.open === "function") {
      widgetInstance.open();
    }
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
</style>