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
const imageScale = ref(1);
const isOnCard = ref(false);
const isTalking = ref(false);
const isInterrupted = ref(false);

const interruptCurrentAnimation = () => {
  if (mascot.value) {
    mascot.value.cleanup();
    isJumping.value = false;
    isInterrupted.value = true;
    mascot.value.isMoving = false;
    mascot.value.currentState = "talk";
    mascot.value.currentFrame = 1;
    imageScale.value = 1;
    scaleX.value = props.forceScaleX ?? 1;

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
        props.forceScaleX ?? 1,
      );
    } else {
      console.log("Component: No mascot instance!");
    }
  },
  interrupt: interruptCurrentAnimation,
});

onMounted(() => {
  const instance = new Festivo(
    props.config || {},
    props.initialState || "talk",
  );

  instance.onFrameChange = () => {
    triggerRef(mascot);
    if (mascot.value) {
      const wasTalking = isTalking.value;
      isTalking.value = mascot.value.currentState === "talk";

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

  nextTick(() => {
    const initialX = -(window.scrollX + window.innerWidth) + 150;
    const initialY = window.scrollY + window.innerHeight - 300;

    instance.position = { x: initialX, y: initialY };
    instance.isVisible = true;

    position.value = instance.position;
    isVisible.value = instance.isVisible;
    triggerRef(mascot);
  });
});

const updateScaleBasedOnState = () => {
  if (props.disableShrink) {
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

    if (isJumping.value || isTalking.value) {
      interruptCurrentAnimation();
    }

    if (isOnCard.value) {
      imageScale.value = 1;
      isOnCard.value = false;
      isTalking.value = false;
    }

    if (!isJumping.value) {
      if (props.useJump) {
        if (props.forceScaleX !== undefined) {
          scaleX.value = props.forceScaleX;
        }

        isJumping.value = true;
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
          props.forceScaleX ?? 1,
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
  if (mascot.value && !isJumping.value) {
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
