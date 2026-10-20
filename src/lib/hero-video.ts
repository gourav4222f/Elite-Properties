/**
 * The hero film, encoded for scrubbing: a keyframe every 4 frames and no B-frames, so any
 * seek decodes at most three frames. H.264 is preferred for its hardware decoding; VP9 covers
 * browsers built without it. Re-encode from source/hero-scroll.mp4 with:
 *
 *   ffmpeg -i source/hero-scroll.mp4 -an -vf "scale=1280:-2:flags=lanczos" -c:v libx264 \
 *     -preset slower -tune film -pix_fmt yuv420p -profile:v high -level 4.0 -g 4 -keyint_min 1 \
 *     -bf 0 -sc_threshold 0 -crf 27 -movflags +faststart public/video/hero-1280.mp4
 *
 *   ffmpeg -i source/hero-scroll.mp4 -an -vf "scale=1280:-2:flags=lanczos" -c:v libvpx-vp9 \
 *     -pix_fmt yuv420p -g 4 -keyint_min 1 -crf 44 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 \
 *     -auto-alt-ref 0 -lag-in-frames 0 public/video/hero-1280.webm
 *
 * The 960 versions use scale=960 with -crf 28 (H.264) and -crf 46 (VP9).
 */
export const HERO_VIDEO = {
  sources: [
    {
      type: 'video/mp4; codecs="avc1.640028"',
      desktop: "/video/hero-1280.mp4",
      compact: "/video/hero-960.mp4",
    },
    {
      type: 'video/webm; codecs="vp9"',
      desktop: "/video/hero-1280.webm",
      compact: "/video/hero-960.webm",
    },
  ],
  poster: "/video/hero-poster.webp",
  /** Shown instead of the film when motion is reduced (frame 606). */
  still: "/video/hero-still.webp",
  fps: 24,
  frameCount: 720,
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

/** `start`/`end` are scroll progress; `frameStart`/`frameEnd` are the film frames they cover. */
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

export function getChapterAtProgress(progress: number) {
  return (
    HERO_CHAPTERS.find((chapter, index) => {
      const isLast = index === HERO_CHAPTERS.length - 1;
      return progress >= chapter.start && (isLast ? progress <= chapter.end : progress < chapter.end);
    }) ?? HERO_CHAPTERS[0]
  );
}
