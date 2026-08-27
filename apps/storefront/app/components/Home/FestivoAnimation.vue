<script setup lang="ts">
import {
  ref,
  shallowRef,
  onBeforeUnmount,
  onMounted,
  watch,
  computed,
  triggerRef,
  nextTick,
} from "vue";
import { Festivo, type FestivoConfig, type FestivoState } from "./Festivo";

const props = defineProps<{
  targetRect: DOMRect | null;
  config?: FestivoConfig;
  initialState?: FestivoState;
  useJump?: boolean;
  forceScaleX?: number;
  disableShrink?: boolean;
}>();

const mascot = shallowRef<Festivo | null>(null);
const position = ref({ x: 200, y: 200 });
const scaleX = ref(1);
const isVisible = ref(false);
const isJumping = ref(false);
const isJoy = ref(false);
const isJolly = ref(false);
const isMerry = ref(false);
const imageScale = ref(1);
const isOnCard = ref(false);
const isTalking = ref(false);
const isInterrupted = ref(false);
const isClient = ref(false);

const preloadMascotImages = async () => {
  if (typeof window === "undefined") return;

  const stateFrames = {
    run: 8,
    talk: 4,
    jump: 5,
    joy: 8,
    jolly: 6,
    merry: 10,
  };

  const imageUrls: string[] = [];

  for (const [state, frames] of Object.entries(stateFrames)) {
    for (let frame = 1; frame <= frames; frame++) {
      imageUrls.push(`/Images/Festivo/${state}-3d-${frame}.png`);
    }
  }

  try {
    const loadPromises = imageUrls.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    });

    await Promise.all(loadPromises);
    console.log(`Preloaded ${imageUrls.length} mascot images`);
  } catch (error) {
    console.warn("Failed to preload mascot images:", error);
  }
};

const interruptCurrentAnimation = () => {
  if (mascot.value) {
    mascot.value.cleanup();
    isJumping.value = false;
    isJoy.value = false;
    isJolly.value = false;
    isMerry.value = false;
    isInterrupted.value = true;
    mascot.value.isMoving = false;
    mascot.value.currentState = "talk";
    mascot.value.currentFrame = 1;
    imageScale.value = 1;

    if (mascot.value.onFrameChange) {
      mascot.value.onFrameChange();
    }
    if (mascot.value.onPositionChange) {
      mascot.value.onPositionChange();
    }
    triggerRef(mascot);
  }
};

defineExpose({
  jumpToButton: (rect: DOMRect) => {
    if (mascot.value) {
      interruptCurrentAnimation();

      isJumping.value = true;
      isJoy.value = false;
      isJolly.value = false;
      isMerry.value = false;
      isOnCard.value = false;
      isTalking.value = false;
      imageScale.value = props.disableShrink ? 1 : 1;

      mascot.value.jumpToButton(
        rect,
        (progress: number) => {
          if (!props.disableShrink) {
            const easedProgress = 1 - Math.pow(1 - progress, 2);
            imageScale.value = 1 - easedProgress * 0.5;
          } else {
            imageScale.value = 1;
          }

          if (progress > 0.9 && !isOnCard.value) {
            isOnCard.value = true;
          }
        },
        1,
      );
    } else {
      console.log("Component: No mascot instance!");
    }
  },
  joyToPosition: (rect: DOMRect) => {
    if (mascot.value) {
      interruptCurrentAnimation();

      isJumping.value = false;
      isJoy.value = true;
      isJolly.value = false;
      isMerry.value = false;
      isOnCard.value = false;
      isTalking.value = false;
      imageScale.value = 1;

      mascot.value.joyToPosition(
        rect,
        (progress: number) => {
          imageScale.value = 1;

          if (progress > 0.9 && !isOnCard.value) {
            isOnCard.value = true;
          }
        },
        1,
      );
    } else {
      console.log("Component: No mascot instance!");
    }
  },
  jollyToPosition: (rect: DOMRect) => {
    if (mascot.value) {
      interruptCurrentAnimation();

      isJumping.value = false;
      isJoy.value = false;
      isJolly.value = true;
      isMerry.value = false;
      isOnCard.value = false;
      isTalking.value = false;
      imageScale.value = 1;

      mascot.value.jollyToPosition(
        rect,
        (progress: number) => {
          imageScale.value = 1;

          if (progress > 0.9 && !isOnCard.value) {
            isOnCard.value = true;
          }
        },
        1,
      );
    } else {
      console.log("Component: No mascot instance!");
    }
  },
  merryToPosition: (rect: DOMRect) => {
    if (mascot.value) {
      interruptCurrentAnimation();

      isJumping.value = false;
      isJoy.value = false;
      isJolly.value = false;
      isMerry.value = true;
      isOnCard.value = false;
      isTalking.value = false;
      imageScale.value = 1;

      mascot.value.merryToPosition(
        rect,
        (progress: number) => {
          imageScale.value = 1;

          if (progress > 0.9 && !isOnCard.value) {
            isOnCard.value = true;
          }
        },
        1,
      );
    } else {
      console.log("Component: No mascot instance!");
    }
  },
  startJoyJollyMerry: () => {
    if (mascot.value) {
      interruptCurrentAnimation();
      isJoy.value = false;
      isJolly.value = false;
      isMerry.value = false;
      isJumping.value = false;
      isOnCard.value = false;
      isTalking.value = false;
      imageScale.value = 1;
      mascot.value.startJoyJollyMerry();
    }
  },
  interrupt: interruptCurrentAnimation,
});

onMounted(async () => {
  await preloadMascotImages();

  isClient.value = true;

  const instance = new Festivo(
    props.config || {},
    props.initialState || "talk",
  );

  instance.onFrameChange = () => {
    triggerRef(mascot);
    if (mascot.value) {
      const wasTalking = isTalking.value;
      isTalking.value = mascot.value.currentState === "talk";
      isJoy.value = mascot.value.currentState === "joy";
      isJolly.value = mascot.value.currentState === "jolly";
      isMerry.value = mascot.value.currentState === "merry";
      isJumping.value = mascot.value.currentState === "jump";

      if (wasTalking !== isTalking.value) {
        updateScaleBasedOnState();
      }
    }
  };

  instance.onPositionChange = () => {
    position.value = instance.position;
    scaleX.value = instance.scaleX;
    triggerRef(mascot);
  };

  instance.onVisibilityChange = () => {
    isVisible.value = instance.isVisible;
    triggerRef(mascot);
  };

  instance.onMoveComplete = () => {
    isJumping.value = false;
    isJoy.value = false;
    isJolly.value = false;
    isMerry.value = false;
    if (mascot.value) {
      isTalking.value = mascot.value.currentState === "talk";
    }
    updateScaleBasedOnState();
  };

  mascot.value = instance;
  position.value = instance.position;
  scaleX.value = instance.scaleX;
  isVisible.value = instance.isVisible;
  isTalking.value = instance.currentState === "talk";

  const frameSynchronizer = setInterval(() => {
    triggerRef(mascot);
  }, 40);

  onBeforeUnmount(() => {
    clearInterval(frameSynchronizer);
    instance.cleanup();
  });

  if (typeof window !== "undefined") {
    nextTick(() => {
      const initialX = -(window.scrollX + window.innerWidth) + 150;
      const initialY = window.scrollY + window.innerHeight - 300;

      instance.position = { x: initialX, y: initialY };
      instance.isVisible = true;

      position.value = instance.position;
      isVisible.value = instance.isVisible;
      triggerRef(mascot);
    });
  }
});

const updateScaleBasedOnState = () => {
  if (props.disableShrink) {
    imageScale.value = 1;
    return;
  }

  if (isJoy.value || isJolly.value || isMerry.value) {
    imageScale.value = 1;
    return;
  }

  if (isOnCard.value && isTalking.value) {
    imageScale.value = 0.5;
  } else if (!isOnCard.value && isTalking.value) {
    imageScale.value = 1;
  } else if (isOnCard.value && !isTalking.value) {
    imageScale.value = 0.5;
  } else {
    imageScale.value = 1;
  }
};

const currentImageSrc = computed(() => {
  return mascot.value ? mascot.value.imageSrc : "/Images/Festivo/talk-3d-1.png";
});

watch(
  () => props.targetRect,
  (newRect) => {
    if (!newRect || !mascot.value) return;

    if (
      isJumping.value ||
      isTalking.value ||
      isJoy.value ||
      isJolly.value ||
      isMerry.value
    ) {
      interruptCurrentAnimation();
    }

    if (isOnCard.value) {
      imageScale.value = 1;
      isOnCard.value = false;
      isTalking.value = false;
    }

    if (!isJumping.value && !isJoy.value && !isJolly.value && !isMerry.value) {
      if (props.useJump) {
        isJumping.value = true;
        isJoy.value = false;
        isJolly.value = false;
        isMerry.value = false;
        isOnCard.value = false;
        isTalking.value = false;
        imageScale.value = props.disableShrink ? 1 : 1;

        mascot.value.jumpToButton(
          newRect,
          (progress: number) => {
            if (!props.disableShrink) {
              const easedProgress = 1 - Math.pow(1 - progress, 2);
              imageScale.value = 1 - easedProgress * 0.5;
            } else {
              imageScale.value = 1;
            }

            if (progress > 0.9 && !isOnCard.value) {
              isOnCard.value = true;
            }
          },
          1,
        );
      } else {
        mascot.value.moveTo(newRect);
      }
    }
  },
  {
    immediate: true,
    flush: "post",
  },
);

const onMoveComplete = () => {
  if (
    mascot.value &&
    !isJumping.value &&
    !isJoy.value &&
    !isJolly.value &&
    !isMerry.value
  ) {
    mascot.value.isMoving = false;
    mascot.value.cleanup();
    mascot.value.scaleX = 1;
    scaleX.value = 1;

    mascot.value.talk();
    mascot.value.currentFrame = 1;
    triggerRef(mascot);

    if (mascot.value.onMoveComplete) {
      mascot.value.onMoveComplete();
    }
  }
};
</script>

<template>
  <div
    v-if="isClient"
    class="festivo-mascot-wrapper"
    :class="{
      'opacity-0': !isVisible,
      'opacity-100': isVisible,
      jumping: isJumping,
      joy: isJoy,
      jolly: isJolly,
      merry: isMerry,
      'on-card': isOnCard,
      talking: isTalking,
    }"
    :style="{
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    }"
    @transitionend="onMoveComplete"
  >
    <!-- Flip wrapper - NO transition, flips instantly -->
    <div
      class="festivo-flip-wrapper"
      :style="{
        transform: `scaleX(${scaleX})`,
      }"
    >
      <!-- Scale wrapper - has transition for smooth shrink/grow -->
      <div
        class="festivo-scale-wrapper"
        :style="{
          transform: `scale(${imageScale})`,
        }"
      >
        <img
          :src="currentImageSrc"
          alt="Festivo Mascot"
          loading="lazy"
          class="festivo-img"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.festivo-mascot-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  pointer-events: none;
  transition:
    transform 2s cubic-bezier(0.25, 1, 0.5, 1),
    opacity 0.3s ease;
  will-change: transform, opacity;
}

.festivo-mascot-wrapper.jumping {
  transition: none !important;
}

.festivo-mascot-wrapper.joy {
  transition: none !important;
}

.festivo-mascot-wrapper.jolly {
  transition: none !important;
}

.festivo-mascot-wrapper.merry {
  transition: none !important;
}

/* Flip wrapper - NO transition, instant flip */
.festivo-flip-wrapper {
  transform-origin: center;
  transition: none !important;
}

/* Scale wrapper - smooth transition for shrink/grow */
.festivo-scale-wrapper {
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.festivo-mascot-wrapper.on-card.talking .festivo-scale-wrapper {
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

/* When in special states, make scale transition instant too */
.festivo-mascot-wrapper.jumping .festivo-scale-wrapper {
  transition: none !important;
}

.festivo-mascot-wrapper.joy .festivo-scale-wrapper {
  transition: none !important;
}

.festivo-mascot-wrapper.jolly .festivo-scale-wrapper {
  transition: none !important;
}

.festivo-mascot-wrapper.merry .festivo-scale-wrapper {
  transition: none !important;
}

.festivo-img {
  width: 110px;
  height: 110px;
  object-fit: contain;
  image-rendering: auto;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}
</style>