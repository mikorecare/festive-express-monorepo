<template>
  <div>
    <section class="page-hero snow-bg">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 v-fade>Preview Your Home</h1>
            <p v-fade class="breadcrumb"></p>
          </div>
        </div>
      </div>
    </section>

    <div
      ref="estimatorContainer"
      style="width: 100%; min-height: 1200px; overflow: hidden"
    />
  </div>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    FLPDemoWidget: {
      mount: (selector: string) => void;
    };
  }
}

useHead({
  title: "Preview Your Home - Festive Express",
  link: [
    {
      rel: "stylesheet",
      href: "/estimator/widget.css",
    },
  ],
  script: [
    {
      src: "/estimator/widget.js",
      defer: true,
    },
  ],
});

const estimatorContainer = ref<HTMLElement | null>(null);

const executeScripts = (container: HTMLElement) => {
  const scripts = container.querySelectorAll("script");
  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");
    for (let i = 0; i < oldScript.attributes.length; i++) {
      const attr = oldScript.attributes[i];
      if (attr) {
        newScript.setAttribute(attr.name, attr.value);
      }
    }

    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }

    oldScript.parentNode?.replaceChild(newScript, oldScript);
  });
};

onMounted(async () => {
  try {
    const response = await $fetch("/api/estimator");
    const html = response as string;

    if (estimatorContainer.value) {
      estimatorContainer.value.innerHTML = html;
      executeScripts(estimatorContainer.value);

      setTimeout(() => {
        if (typeof window.FLPDemoWidget !== "undefined") {
          window.FLPDemoWidget.mount("#flp-demo-widget");
        }
      }, 100);
    }
  } catch (error) {
    console.error("Failed to load estimator:", error);
    if (estimatorContainer.value) {
      estimatorContainer.value.innerHTML =
        '<p style="padding:20px;text-align:center;">Estimator offline</p>';
    }
  }
});
</script>
