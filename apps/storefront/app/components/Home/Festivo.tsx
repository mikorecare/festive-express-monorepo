export type FestivoState = "run" | "talk" | "jump" | "joy" | "jolly" | "merry";

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
  joyOffsetX?: number;
  joyOffsetY?: number;
  jollyOffsetX?: number;
  jollyOffsetY?: number;
  merryOffsetX?: number;
  merryOffsetY?: number;
  runFrameDurations?: number[];
  stateConfigs?: Partial<Record<FestivoState, StateConfig>>;
}

const DEFAULT_STATE_CONFIGS: Record<FestivoState, StateConfig> = {
  run: { totalFrames: 7, speed: 200 },
  talk: { totalFrames: 1, speed: 200, maxLoops: 1 },
  jump: { totalFrames: 5, speed: 200 },
  joy: { totalFrames: 8, speed: 100, maxLoops: 0 },
  jolly: { totalFrames: 6, speed: 100, maxLoops: 0 },
  merry: { totalFrames: 10, speed: 100, maxLoops: 0 },
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
  private joyAnimationId: number | null = null;
  private jollyAnimationId: number | null = null;
  private merryAnimationId: number | null = null;
  private isRunActive: boolean = false;
  private stateSequence: FestivoState[] = [];
  private sequenceIndex: number = 0;
  private isSequenceRunning: boolean = false;

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

  public joyToPosition(
    targetRect: DOMRect,
    onProgressUpdate?: (progress: number) => void,
    forceScaleX?: number,
  ) {
    if (!targetRect) {
      console.log("No targetRect");
      return;
    }

    if (this.joyAnimationId) {
      cancelAnimationFrame(this.joyAnimationId);
      this.joyAnimationId = null;
    }

    this.isVisible = true;
    if (this.onVisibilityChange) this.onVisibilityChange();

    const startX = this.position.x;
    const startY = this.position.y;

    const joyOffsetX = this.config.joyOffsetX ?? -80;
    const joyOffsetY = this.config.joyOffsetY ?? -100;

    const endX =
      window.scrollX + targetRect.left + targetRect.width / 2 + joyOffsetX;
    const endY = window.scrollY + targetRect.top + joyOffsetY;

    if (forceScaleX === undefined && this.position.x !== -200) {
      const newDirection = endX > this.position.x ? "right" : "left";
      this.scaleX = newDirection === "right" ? 1 : -1;
      if (this.onPositionChange) this.onPositionChange();
    } else if (forceScaleX !== undefined) {
      this.scaleX = forceScaleX;
      if (this.onPositionChange) this.onPositionChange();
    }

    this.isMoving = true;
    this.currentState = "joy";
    this.currentFrame = 1;
    if (this.onFrameChange) this.onFrameChange();

    this.animateJoy(startX, startY, endX, endY, 1000, onProgressUpdate);
  }

  public jollyToPosition(
    targetRect: DOMRect,
    onProgressUpdate?: (progress: number) => void,
    forceScaleX?: number,
  ) {
    if (!targetRect) {
      console.log("No targetRect");
      return;
    }

    if (this.jollyAnimationId) {
      cancelAnimationFrame(this.jollyAnimationId);
      this.jollyAnimationId = null;
    }

    this.isVisible = true;
    if (this.onVisibilityChange) this.onVisibilityChange();

    const startX = this.position.x;
    const startY = this.position.y;

    const jollyOffsetX = this.config.jollyOffsetX ?? -80;
    const jollyOffsetY = this.config.jollyOffsetY ?? -100;

    const endX =
      window.scrollX + targetRect.left + targetRect.width / 2 + jollyOffsetX;
    const endY = window.scrollY + targetRect.top + jollyOffsetY;

    if (forceScaleX === undefined && this.position.x !== -200) {
      const newDirection = endX > this.position.x ? "right" : "left";
      this.scaleX = newDirection === "right" ? 1 : -1;
      if (this.onPositionChange) this.onPositionChange();
    } else if (forceScaleX !== undefined) {
      this.scaleX = forceScaleX;
      if (this.onPositionChange) this.onPositionChange();
    }

    this.isMoving = true;
    this.currentState = "joy";
    this.currentFrame = 1;
    if (this.onFrameChange) this.onFrameChange();

    this.animateJolly(startX, startY, endX, endY, 1000, onProgressUpdate);
  }

  public merryToPosition(
    targetRect: DOMRect,
    onProgressUpdate?: (progress: number) => void,
    forceScaleX?: number,
  ) {
    if (!targetRect) {
      console.log("No targetRect");
      return;
    }

    if (this.merryAnimationId) {
      cancelAnimationFrame(this.merryAnimationId);
      this.merryAnimationId = null;
    }

    this.isVisible = true;
    if (this.onVisibilityChange) this.onVisibilityChange();

    const startX = this.position.x;
    const startY = this.position.y;

    const merryOffsetX = this.config.merryOffsetX ?? -80;
    const merryOffsetY = this.config.merryOffsetY ?? -100;

    const endX =
      window.scrollX + targetRect.left + targetRect.width / 2 + merryOffsetX;
    const endY = window.scrollY + targetRect.top + merryOffsetY;

    if (forceScaleX === undefined && this.position.x !== -200) {
      const newDirection = endX > this.position.x ? "right" : "left";
      this.scaleX = newDirection === "right" ? 1 : -1;
      if (this.onPositionChange) this.onPositionChange();
    } else if (forceScaleX !== undefined) {
      this.scaleX = forceScaleX;
      if (this.onPositionChange) this.onPositionChange();
    }

    this.isMoving = true;
    this.currentState = "joy";
    this.currentFrame = 1;
    if (this.onFrameChange) this.onFrameChange();

    this.animateMerry(startX, startY, endX, endY, 1000, onProgressUpdate);
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

  private animateJoy(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    duration: number,
    onProgressUpdate?: (progress: number) => void,
  ) {
    const startTime = performance.now();
    const bounceHeight = this.config.jumpPeakHeight ?? 80;

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (endX - startX) * eased;

      const baseY = startY + (endY - startY) * eased;
      const bounce =
        bounceHeight * Math.sin(progress * Math.PI * 1.5) * (1 - progress);
      const currentY = baseY - bounce;

      this.position = { x: currentX, y: currentY };
      if (this.onPositionChange) this.onPositionChange();

      if (onProgressUpdate) {
        onProgressUpdate(progress);
      }

      if (progress < 1) {
        this.joyAnimationId = requestAnimationFrame(animateFrame);
      } else {
        this.position = { x: endX, y: endY };
        if (this.onPositionChange) this.onPositionChange();

        this.isMoving = false;
        this.joyAnimationId = null;
        this.cleanup();

        // Just loop joy (infinite)
        this.setState("joy");
      }
    };

    this.joyAnimationId = requestAnimationFrame(animateFrame);
  }

  private animateJolly(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    duration: number,
    onProgressUpdate?: (progress: number) => void,
  ) {
    const startTime = performance.now();
    const bounceHeight = this.config.jumpPeakHeight ?? 80;

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (endX - startX) * eased;

      const baseY = startY + (endY - startY) * eased;
      const bounce =
        bounceHeight * Math.sin(progress * Math.PI * 1.5) * (1 - progress);
      const currentY = baseY - bounce;

      this.position = { x: currentX, y: currentY };
      if (this.onPositionChange) this.onPositionChange();

      if (onProgressUpdate) {
        onProgressUpdate(progress);
      }

      if (progress < 1) {
        this.jollyAnimationId = requestAnimationFrame(animateFrame);
      } else {
        this.position = { x: endX, y: endY };
        if (this.onPositionChange) this.onPositionChange();

        this.isMoving = false;
        this.jollyAnimationId = null;
        this.cleanup();

        // Start sequence: joy → jolly (loops)
        this.startJollySequence();
      }
    };

    this.jollyAnimationId = requestAnimationFrame(animateFrame);
  }

  private animateMerry(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    duration: number,
    onProgressUpdate?: (progress: number) => void,
  ) {
    const startTime = performance.now();
    const bounceHeight = this.config.jumpPeakHeight ?? 80;

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (endX - startX) * eased;

      const baseY = startY + (endY - startY) * eased;
      const bounce =
        bounceHeight * Math.sin(progress * Math.PI * 1.5) * (1 - progress);
      const currentY = baseY - bounce;

      this.position = { x: currentX, y: currentY };
      if (this.onPositionChange) this.onPositionChange();

      if (onProgressUpdate) {
        onProgressUpdate(progress);
      }

      if (progress < 1) {
        this.merryAnimationId = requestAnimationFrame(animateFrame);
      } else {
        this.position = { x: endX, y: endY };
        if (this.onPositionChange) this.onPositionChange();

        this.isMoving = false;
        this.merryAnimationId = null;
        this.cleanup();

        // Start sequence: joy → jolly → merry (loops)
        this.startMerrySequence();
      }
    };

    this.merryAnimationId = requestAnimationFrame(animateFrame);
  }

  private startJollySequence() {
    this.stateSequence = ["joy", "jolly"];
    this.sequenceIndex = 0;
    this.isSequenceRunning = true;
    this.loopCount = 0;
    this.playNextInSequence();
  }

  private startMerrySequence() {
    this.stateSequence = ["joy", "jolly", "merry"];
    this.sequenceIndex = 0;
    this.isSequenceRunning = true;
    this.loopCount = 0;
    this.playNextInSequence();
  }

  private playNextInSequence() {
    if (this.sequenceIndex >= this.stateSequence.length) {
      this.sequenceIndex = 0;
      this.loopCount++;
    }

    const state = this.stateSequence[this.sequenceIndex];

    if (!state) {
      console.warn("No state found in sequence, resetting to joy");
      this.setState("joy");
      return;
    }

    const validStates: FestivoState[] = [
      "run",
      "talk",
      "jump",
      "joy",
      "jolly",
      "merry",
    ];
    if (!validStates.includes(state)) {
      console.warn("Invalid state in sequence, resetting to joy");
      this.setState("joy");
      return;
    }

    const config = this.stateConfigs[state];

    this.currentState = state;
    this.currentFrame = 1;
    if (this.onFrameChange) this.onFrameChange();

    if (this.frameInterval) {
      clearInterval(this.frameInterval);
      this.frameInterval = null;
    }

    this.frameInterval = setInterval(() => {
      if (this.currentFrame >= config.totalFrames) {
        this.sequenceIndex++;
        this.playNextInSequence();
        return;
      } else {
        this.currentFrame++;
        if (this.onFrameChange) this.onFrameChange();
      }
    }, config.speed);
  }

  public setState(newState: FestivoState, delayMs: number = 0) {
    this.cleanup();
    this.loopCount = 0;
    this.isSequenceRunning = false;
    this.stateSequence = [];
    this.sequenceIndex = 0;

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
        } else if (
          newState === "joy" ||
          newState === "jolly" ||
          newState === "merry"
        ) {
          this.loopAnimation(config);
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
    const maxLoops = config.maxLoops ?? Infinity;
    const isInfinite = maxLoops === 0 || maxLoops === Infinity;

    if (this.frameInterval) {
      clearInterval(this.frameInterval);
      this.frameInterval = null;
    }

    this.frameInterval = setInterval(() => {
      if (this.currentFrame >= config.totalFrames) {
        if (isInfinite) {
          this.currentFrame = 1;
          this.loopCount++;
        } else if (this.loopCount < maxLoops - 1) {
          this.currentFrame = 1;
          this.loopCount++;
        } else {
          this.cleanup();
          this.currentFrame = 1;
          if (this.onFrameChange) this.onFrameChange();
          return;
        }
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

  public joy() {
    this.setState("joy");
  }

  public jolly() {
    this.setState("jolly");
  }

  public merry() {
    this.setState("merry");
  }

  public startJoyJollyMerry() {
    this.cleanup();
    this.isVisible = true;
    if (this.onVisibilityChange) this.onVisibilityChange();
    this.startMerrySequence();
  }

  public cleanup() {
    this.isRunActive = false;
    this.isSequenceRunning = false;
    if (this.jumpAnimationId) {
      cancelAnimationFrame(this.jumpAnimationId);
      this.jumpAnimationId = null;
    }
    if (this.joyAnimationId) {
      cancelAnimationFrame(this.joyAnimationId);
      this.joyAnimationId = null;
    }
    if (this.jollyAnimationId) {
      cancelAnimationFrame(this.jollyAnimationId);
      this.jollyAnimationId = null;
    }
    if (this.merryAnimationId) {
      cancelAnimationFrame(this.merryAnimationId);
      this.merryAnimationId = null;
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
