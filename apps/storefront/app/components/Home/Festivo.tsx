export type FestivoState = "run" | "talk" | "walk-out" | "jump";

interface StateConfig {
  readonly totalFrames: number;
  readonly speed: number;
  readonly maxLoops?: number;
}

export interface FestivoConfig {
  imagePath?: string | ((state: FestivoState, frame: number) => string);
  moveOffsetX?: number;
  moveOffsetY?: number;
  jumpOffsetX?: number;
  jumpOffsetY?: number;
  jumpPeakHeight?: number;
  runFrameDurations?: number[];
  stateConfigs?: Partial<Record<FestivoState, StateConfig>>;
}

const DEFAULT_STATE_CONFIGS: Record<FestivoState, StateConfig> = {
  run: { totalFrames: 7, speed: 200 },
  talk: { totalFrames: 4, speed: 200, maxLoops: 1 },
  "walk-out": { totalFrames: 8, speed: 200 },
  jump: { totalFrames: 5, speed: 200 },
};

const DEFAULT_RUN_FRAME_DURATIONS = [30, 40, 60, 100, 150, 250, 630];

export class Festivo {
  public currentFrame: number = 1;
  public currentState: FestivoState = "talk";
  public scaleX: number = 1;
  public position = { x: 200, y: 200 };
  public isMoving = false;
  public isVisible = false;
  public config: FestivoConfig;

  private frameInterval: any = null;
  private startDelayTimeout: any = null;
  private lastTargetRect: DOMRect | null = null;
  private loopCount: number = 0;
  private jumpAnimationId: number | null = null;
  private isRunActive: boolean = false;

  public onFrameChange: (() => void) | null = null;
  public onPositionChange: (() => void) | null = null;
  public onVisibilityChange: (() => void) | null = null;
  public onMoveComplete: (() => void) | null = null;

  private stateConfigs: Record<FestivoState, StateConfig>;
  private runFrameDurations: number[];

  constructor(config: FestivoConfig = {}, initialState: FestivoState = "talk") {
    this.config = config;

    this.stateConfigs = {
      ...DEFAULT_STATE_CONFIGS,
      ...config.stateConfigs,
    };

    this.runFrameDurations =
      config.runFrameDurations || DEFAULT_RUN_FRAME_DURATIONS;

    this.setState(initialState);
  }

  public get imageSrc(): string {
    const { imagePath } = this.config;

    if (typeof imagePath === "function") {
      return imagePath(this.currentState, this.currentFrame);
    }

    if (typeof imagePath === "string") {
      return imagePath
        .replace("{state}", this.currentState)
        .replace("{frame}", String(this.currentFrame));
    }

    // Default path
    return `/Images/Festivo/${this.currentState}-3d-${this.currentFrame}.png`;
  }

  public moveTo(targetRect: DOMRect) {
    if (!targetRect) return;

    if (this.lastTargetRect) {
      const isSameTarget =
        Math.abs(this.lastTargetRect.left - targetRect.left) < 5 &&
        Math.abs(this.lastTargetRect.top - targetRect.top) < 5;

      if (isSameTarget && !this.isMoving) {
        return;
      }
    }

    this.lastTargetRect = targetRect;
    this.isVisible = true;
    if (this.onVisibilityChange) this.onVisibilityChange();

    const offsetX = this.config.moveOffsetX ?? -50;
    const offsetY = this.config.moveOffsetY ?? 100;

    const destinationX = window.scrollX + targetRect.left + offsetX;
    const destinationY =
      window.scrollY + targetRect.top + targetRect.height / 2 + offsetY;

    if (this.position.x !== -200) {
      const newDirection = destinationX > this.position.x ? "right" : "left";
      this.scaleX = newDirection === "right" ? 1 : -1;
      if (this.onPositionChange) this.onPositionChange();
    }

    this.isMoving = true;
    this.position = { x: destinationX, y: destinationY };
    if (this.onPositionChange) this.onPositionChange();

    this.run();
  }

  public jumpToButton(
    buttonRect: DOMRect,
    onScaleUpdate?: (progress: number) => void,
    forceScaleX?: number,
  ) {
    if (!buttonRect) {
      console.log("No buttonRect");
      return;
    }

    if (this.jumpAnimationId) {
      cancelAnimationFrame(this.jumpAnimationId);
      this.jumpAnimationId = null;
    }

    this.isVisible = true;
    if (this.onVisibilityChange) this.onVisibilityChange();

    const startX = this.position.x;
    const startY = this.position.y;

    const jumpOffsetX = this.config.jumpOffsetX ?? -100;
    const jumpOffsetY = this.config.jumpOffsetY ?? -120;

    const endX =
      window.scrollX + buttonRect.left + buttonRect.width / 2 + jumpOffsetX;
    const endY = window.scrollY + buttonRect.top + jumpOffsetY;

    if (forceScaleX === undefined && this.position.x !== -200) {
      const newDirection = endX > this.position.x ? "right" : "left";
      this.scaleX = newDirection === "right" ? 1 : -1;
      if (this.onPositionChange) this.onPositionChange();
    } else if (forceScaleX !== undefined) {
      this.scaleX = forceScaleX;
      if (this.onPositionChange) this.onPositionChange();
    }

    this.isMoving = true;
    this.setState("jump");
    this.animateJump(startX, startY, endX, endY, 800, onScaleUpdate);
  }

  private animateJump(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    duration: number,
    onScaleUpdate?: (progress: number) => void,
  ) {
    const startTime = performance.now();
    const peakHeight = this.config.jumpPeakHeight ?? 150;

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentX = startX + (endX - startX) * eased;

      const baseY = startY + (endY - startY) * eased;
      const arcHeight = peakHeight * Math.sin(progress * Math.PI);
      const currentY = baseY - arcHeight;

      this.position = { x: currentX, y: currentY };
      if (this.onPositionChange) this.onPositionChange();

      if (onScaleUpdate) {
        onScaleUpdate(progress);
      }

      if (progress < 1) {
        this.jumpAnimationId = requestAnimationFrame(animateFrame);
      } else {
        this.position = { x: endX, y: endY };
        if (this.onPositionChange) this.onPositionChange();

        this.isMoving = false;
        this.jumpAnimationId = null;
        this.cleanup();
        this.talk();
        this.currentFrame = 1;
        if (this.onFrameChange) this.onFrameChange();

        if (onScaleUpdate) {
          onScaleUpdate(1);
        }

        if (this.onMoveComplete) {
          this.onMoveComplete();
        }
      }
    };

    this.jumpAnimationId = requestAnimationFrame(animateFrame);
  }

  public setState(newState: FestivoState, delayMs: number = 0) {
    this.cleanup();
    this.loopCount = 0;

    const applyState = () => {
      this.currentState = newState;
      this.currentFrame = 1;

      const config = this.stateConfigs[newState];

      if (this.onFrameChange) this.onFrameChange();

      if (typeof window !== "undefined") {
        if (newState === "run") {
          this.runAnimation(config);
        } else if (newState === "jump") {
          this.jumpAnimation(config);
        } else {
          this.loopAnimation(config);
        }
      }
    };

    if (delayMs > 0 && typeof window !== "undefined") {
      this.startDelayTimeout = setTimeout(applyState, delayMs);
    } else {
      applyState();
    }
  }

  private runAnimation(config: StateConfig) {
    const totalFrames = config.totalFrames;
    let frameIndex = 0;
    const frameDurations = this.runFrameDurations;
    let elapsed = 0;
    const checkInterval = 30;

    const intervalId = setInterval(() => {
      elapsed += checkInterval;
      const currentDuration = frameDurations[frameIndex] || 400;

      if (elapsed >= currentDuration) {
        frameIndex = (frameIndex + 1) % totalFrames;
        this.currentFrame = frameIndex + 1;
        if (this.onFrameChange) this.onFrameChange();
        elapsed = 0;

        if (frameIndex === totalFrames - 1) {
          clearInterval(intervalId);
          this.frameInterval = null;
          this.currentFrame = totalFrames;
          if (this.onFrameChange) this.onFrameChange();
        }
      }
    }, checkInterval);

    this.frameInterval = intervalId;
    this.currentFrame = 1;
    if (this.onFrameChange) this.onFrameChange();
  }

  private jumpAnimation(config: StateConfig) {
    const totalFrames = config.totalFrames;
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex++;
      if (currentIndex >= totalFrames) {
        clearInterval(intervalId);
        this.frameInterval = null;
        this.talk();
        this.currentFrame = 1;
        if (this.onFrameChange) this.onFrameChange();
        return;
      }
      this.currentFrame = currentIndex + 1;
      if (this.onFrameChange) this.onFrameChange();
    }, config.speed);

    this.frameInterval = intervalId;
    this.currentFrame = 1;
    if (this.onFrameChange) this.onFrameChange();
  }

  private loopAnimation(config: StateConfig) {
    this.frameInterval = setInterval(() => {
      if (this.currentFrame >= config.totalFrames) {
        if (config.maxLoops && this.loopCount >= config.maxLoops - 1) {
          this.cleanup();
          this.currentFrame = 1;
          if (this.onFrameChange) this.onFrameChange();
          return;
        }

        this.currentFrame = 1;
        this.loopCount++;
      } else {
        this.currentFrame++;
      }

      if (this.onFrameChange) this.onFrameChange();
    }, config.speed);
  }

  public run(delayMs: number = 0) {
    this.setState("run", delayMs);
  }

  public talk() {
    this.setState("talk");
  }

  public walkOut() {
    this.setState("walk-out");
  }

  public cleanup() {
    this.isRunActive = false;
    if (this.jumpAnimationId) {
      cancelAnimationFrame(this.jumpAnimationId);
      this.jumpAnimationId = null;
    }
    if (this.frameInterval) {
      clearTimeout(this.frameInterval);
      clearInterval(this.frameInterval);
      this.frameInterval = null;
    }
    if (this.startDelayTimeout) {
      clearTimeout(this.startDelayTimeout);
      this.startDelayTimeout = null;
    }
  }
}
