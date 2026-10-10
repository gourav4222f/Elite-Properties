export const HERO_SEQUENCE = {
  frameCount: 720,
  frameStart: 1,
  frameEnd: 720,
  frameWidth: 1280,
  frameHeight: 720,
  criticalEnd: 24,
  desktopScrollVh: 700,
  mobileScrollVh: 500,
  maxDecodeConcurrency: 4,
  warmConcurrency: 2,
  lookAhead: 36,
  lookBehind: 10,
} as const;

export type HeroChapterId =
  | "intro"
  | "discover"
  | "explore"
  | "perspective"
  | "experience"
  | "belong"
  | "brand"
  | "final";

export interface HeroChapter {
  id: HeroChapterId;
  start: number;
  end: number;
  frameStart: number;
  frameEnd: number;
  headerTone: "ink" | "ivory";
}

export const HERO_CHAPTERS: readonly HeroChapter[] = [
  { id: "intro", start: 0, end: 0.12, frameStart: 1, frameEnd: 85, headerTone: "ivory" },
  { id: "discover", start: 0.12, end: 0.27, frameStart: 86, frameEnd: 195, headerTone: "ivory" },
  { id: "explore", start: 0.27, end: 0.42, frameStart: 196, frameEnd: 300, headerTone: "ivory" },
  { id: "perspective", start: 0.42, end: 0.58, frameStart: 301, frameEnd: 415, headerTone: "ink" },
  { id: "experience", start: 0.58, end: 0.71, frameStart: 416, frameEnd: 510, headerTone: "ink" },
  { id: "belong", start: 0.71, end: 0.84, frameStart: 511, frameEnd: 605, headerTone: "ink" },
  { id: "brand", start: 0.84, end: 0.93, frameStart: 606, frameEnd: 669, headerTone: "ink" },
  { id: "final", start: 0.93, end: 1, frameStart: 670, frameEnd: 720, headerTone: "ink" },
] as const;

export function getFramePath(frame: number) {
  return `/frames/frame_${String(clampFrame(frame)).padStart(4, "0")}.webp`;
}

export function clampFrame(frame: number) {
  return Math.min(HERO_SEQUENCE.frameEnd, Math.max(HERO_SEQUENCE.frameStart, Math.round(frame)));
}

export function getChapterAtProgress(progress: number) {
  return (
    HERO_CHAPTERS.find((chapter, index) => {
      const isLast = index === HERO_CHAPTERS.length - 1;
      return progress >= chapter.start && (isLast ? progress <= chapter.end : progress < chapter.end);
    }) ?? HERO_CHAPTERS[0]
  );
}
