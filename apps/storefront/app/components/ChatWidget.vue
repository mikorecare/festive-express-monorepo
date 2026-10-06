<template>
  <ClientOnly>
    <div ref="chatContainer">
      <button
        v-if="widgetReady"
        class="custom-chat-btn"
        aria-label="Open chat"
        @click="toggleChat"
      >
        <img src="/Images/chat.png" alt="" />
      </button>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const chatContainer = ref<HTMLElement | null>(null);
const widgetReady = ref(false);

const token =
  "eyJhbGciOiJub25lIn0.eyJyIjoicHJvZHVjdGlvbiIsImkiOjI2MDksImEiOjUxNTIxOCwiYCI6Imh0dHBzIiwiaCI6ImNoYXQuYWN0bS54eXoifQ.";

let widgetInstance: any = null;
let observer: MutationObserver | null = null;

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

const killCtmBubble = () => {
  document
    .querySelectorAll('#engage-message, .engage.visible, [id^="engage-"]')
    .forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.display = "none";
      htmlEl.style.visibility = "hidden";
      htmlEl.style.opacity = "0";
      htmlEl.style.pointerEvents = "none";
    });
};

const moveBubbleOffScreen = () => {
  try {
    const shadowRoot = widgetInstance?.shadowRoot;
    if (!shadowRoot) return;
    const bubble = shadowRoot.querySelector(".bubble") as HTMLElement | null;
    if (!bubble) return;
    bubble.style.position = "fixed";
    bubble.style.bottom = "-9999px";
    bubble.style.right = "-9999px";
    bubble.style.opacity = "0";
    bubble.style.pointerEvents = "none";
    bubble.style.width = "1px";
    bubble.style.height = "1px";
  } catch {
    // ignore
  }
};

const clickBubble = () => {
  if (!widgetInstance) return false;
  try {
    const shadowRoot = widgetInstance.shadowRoot;
    if (!shadowRoot) return false;
    const bubble = shadowRoot.querySelector(".bubble") as HTMLElement | null;
    if (!bubble) return false;

    bubble.style.position = "fixed";
    bubble.style.bottom = "20px";
    bubble.style.right = "20px";
    bubble.style.opacity = "0.01";
    bubble.style.pointerEvents = "auto";
    bubble.style.width = "auto";
    bubble.style.height = "auto";

    bubble.click();

    setTimeout(() => moveBubbleOffScreen(), 50);
    return true;
  } catch (e) {
    console.error("Error clicking chat bubble:", e);
    return false;
  }
};

const open = () => {
  if (!widgetInstance) return;
  if (!clickBubble() && typeof widgetInstance.open === "function") {
    widgetInstance.open();
  }
};

const close = () => {
  if (!widgetInstance) return;
  if (!clickBubble() && typeof widgetInstance.close === "function") {
    widgetInstance.close();
  }
};

const toggle = () => {
  if (!widgetInstance) return;
  if (!clickBubble() && typeof widgetInstance.toggle === "function") {
    widgetInstance.toggle();
  }
};

defineExpose({ open, close, toggle });

const initWidget = async () => {
  try {
    await loadScript();

    if (customElements?.whenDefined) {
      await customElements.whenDefined("ctm-chat");
    } else {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<ctm-chat token="${token}"></ctm-chat>`;
    const chatElement = wrapper.firstElementChild;

    if (chatElement && chatContainer.value) {
      chatContainer.value.appendChild(chatElement);
      widgetInstance = chatElement;

      await new Promise((resolve) => setTimeout(resolve, 500));

      moveBubbleOffScreen();
      killCtmBubble();

      widgetReady.value = true;
    }
  } catch (error) {
    console.error("Failed to initialize chat widget:", error);
  }
};

const toggleChat = () => toggle();

onMounted(() => {
  if (!process.client) return;

  initWidget();

  // Immediately start hiding CTM's default bubble
  killCtmBubble();
  observer = new MutationObserver(killCtmBubble);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
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
  transition:
    transform 0.3s ease,
    bottom 0.2s ease;
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

/* Mobile: lift above the bottom nav */
@media (max-width: 1023px) {
  .custom-chat-btn {
    bottom: calc(80px + env(safe-area-inset-bottom, 0px));
    right: 16px;
    width: 56px;
    height: 56px;
    z-index: 10000;
  }
}

@media (max-width: 400px) {
  .custom-chat-btn {
    width: 48px;
    height: 48px;
  }
}
</style>
