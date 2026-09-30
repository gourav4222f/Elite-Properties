"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getFramePath, HERO_CHAPTERS, HERO_SEQUENCE } from "@/lib/frame-sequence";

interface QueueItem {
  frame: number;
  priority: number;
  attempt: number;
}

interface CacheEntry {
  image: HTMLImageElement;
  lastUsed: number;
  protected: boolean;
}

interface UseFrameSequenceOptions {
  reducedMotion: boolean;
  staticFrame?: number;
}

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

export function useFrameSequence({
  reducedMotion,
  staticFrame = 606,
}: UseFrameSequenceOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wantedFrameRef = useRef(reducedMotion ? staticFrame : 1);
  const renderRequestRef = useRef<number | null>(null);
  const requestFrameRef = useRef<(frame: number) => void>(() => undefined);
  const [criticalProgress, setCriticalProgress] = useState(0);
  const [criticalReady, setCriticalReady] = useState(false);

  const requestFrame = useCallback((frame: number) => {
    requestFrameRef.current(frame);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    wantedFrameRef.current = reducedMotion ? staticFrame : HERO_SEQUENCE.frameStart;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    let disposed = false;
    let inFlight = 0;
    let resizeRequest: number | null = null;
    let phaseTwoQueued = false;
    let phaseThreeQueued = false;
    let accessCounter = 0;
    const queue: QueueItem[] = [];
    const queued = new Set<number>();
    const loading = new Set<number>();
    const failed = new Set<number>();
    const criticalSettled = new Set<number>();
    const cache = new Map<number, CacheEntry>();
    const protectedFrames = new Set<number>([
      ...range(1, HERO_SEQUENCE.criticalEnd),
      ...HERO_CHAPTERS.flatMap((chapter) => [chapter.frameStart, chapter.frameEnd]),
    ]);
    const maxDecodedFrames = window.innerWidth < 768 ? 72 : 120;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const mobile = rect.width < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const findNearestLoaded = (frame: number) => {
      if (cache.has(frame)) return frame;

      for (let distance = 1; distance <= HERO_SEQUENCE.frameCount; distance += 1) {
        const lower = frame - distance;
        const upper = frame + distance;
        if (lower >= HERO_SEQUENCE.frameStart && cache.has(lower)) return lower;
        if (upper <= HERO_SEQUENCE.frameEnd && cache.has(upper)) return upper;
      }

      return null;
    };

    const draw = () => {
      renderRequestRef.current = null;
      resizeCanvas();

      const nearestFrame = findNearestLoaded(wantedFrameRef.current);
      if (nearestFrame === null) return;

      const entry = cache.get(nearestFrame);
      if (!entry || !entry.image.naturalWidth || !entry.image.naturalHeight) return;

      entry.lastUsed = ++accessCounter;
      const { image } = entry;
      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;

      context.fillStyle = "#1b0e07";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, x, y, width, height);
    };

    const scheduleDraw = () => {
      if (renderRequestRef.current !== null) return;
      renderRequestRef.current = window.requestAnimationFrame(draw);
    };

    const evictDistantFrames = () => {
      if (cache.size <= maxDecodedFrames) return;

      const wanted = wantedFrameRef.current;
      const candidates = [...cache.entries()]
        .filter(([frame, entry]) => !entry.protected && frame !== wanted)
        .sort((a, b) => {
          const distanceA = Math.abs(a[0] - wanted);
          const distanceB = Math.abs(b[0] - wanted);
          return distanceB - distanceA || a[1].lastUsed - b[1].lastUsed;
        });

      while (cache.size > maxDecodedFrames && candidates.length > 0) {
        const candidate = candidates.shift();
        if (!candidate) break;
        const [frame, entry] = candidate;
        cache.delete(frame);
        entry.image.src = "";
      }
    };

    const settleCritical = (frame: number) => {
      if (frame > HERO_SEQUENCE.criticalEnd || criticalSettled.has(frame)) return;
      criticalSettled.add(frame);
      const progress = criticalSettled.size / HERO_SEQUENCE.criticalEnd;
      setCriticalProgress(progress);

      if (criticalSettled.size === HERO_SEQUENCE.criticalEnd) {
        setCriticalReady(true);
      }
    };

    const addFrames = (frames: number[], priority: number, attempt = 0) => {
      frames.forEach((frame, index) => {
        const safeFrame = Math.min(
          HERO_SEQUENCE.frameEnd,
          Math.max(HERO_SEQUENCE.frameStart, Math.round(frame)),
        );

        if (cache.has(safeFrame) || loading.has(safeFrame) || failed.has(safeFrame)) return;

        if (queued.has(safeFrame)) {
          const existing = queue.find((item) => item.frame === safeFrame);
          if (existing) existing.priority = Math.max(existing.priority, priority - index * 0.001);
          return;
        }

        queue.push({ frame: safeFrame, priority: priority - index * 0.001, attempt });
        queued.add(safeFrame);
      });

      queue.sort((a, b) => b.priority - a.priority);
    };

    const queueBackgroundPhases = () => {
      if (!phaseTwoQueued) {
        phaseTwoQueued = true;
        addFrames(range(HERO_SEQUENCE.criticalEnd + 1, HERO_SEQUENCE.phaseTwoEnd), 40);
      }

      if (!phaseThreeQueued) {
        phaseThreeQueued = true;
        addFrames(range(HERO_SEQUENCE.phaseTwoEnd + 1, HERO_SEQUENCE.frameEnd), 10);
      }
    };

    const pump = () => {
      if (disposed) return;

      while (inFlight < HERO_SEQUENCE.preloadConcurrency && queue.length > 0) {
        const item = queue.shift();
        if (!item) break;
        queued.delete(item.frame);

        if (cache.has(item.frame) || loading.has(item.frame)) continue;

        inFlight += 1;
        loading.add(item.frame);
        const image = new Image();
        image.decoding = "async";

        image.onload = () => {
          if (disposed) return;

          inFlight -= 1;
          loading.delete(item.frame);
          cache.set(item.frame, {
            image,
            lastUsed: ++accessCounter,
            protected: protectedFrames.has(item.frame),
          });
          if (reducedMotion && item.frame === staticFrame) {
            setCriticalProgress(1);
            setCriticalReady(true);
          }
          settleCritical(item.frame);
          evictDistantFrames();

          if (item.frame === wantedFrameRef.current || cache.size === 1) scheduleDraw();
          if (criticalSettled.size === HERO_SEQUENCE.criticalEnd) queueBackgroundPhases();
          pump();
        };

        image.onerror = () => {
          if (disposed) return;

          inFlight -= 1;
          loading.delete(item.frame);

          if (item.attempt < 2) {
            window.setTimeout(() => {
              if (disposed) return;
              addFrames([item.frame], item.priority + 5, item.attempt + 1);
              pump();
            }, item.attempt === 0 ? 250 : 700);
          } else {
            failed.add(item.frame);
            if (reducedMotion && item.frame === staticFrame) {
              setCriticalProgress(1);
              setCriticalReady(true);
            }
            settleCritical(item.frame);
            if (criticalSettled.size === HERO_SEQUENCE.criticalEnd) queueBackgroundPhases();
          }

          pump();
        };

        image.src = getFramePath(item.frame);
      }
    };

    const prioritizeNearby = (frame: number) => {
      const nearby = [frame];
      for (let distance = 1; distance <= HERO_SEQUENCE.nearbyRadius; distance += 1) {
        nearby.push(frame - distance, frame + distance);
      }
      addFrames(nearby, 200);
      pump();
    };

    requestFrameRef.current = (frame: number) => {
      const safeFrame = Math.min(
        HERO_SEQUENCE.frameEnd,
        Math.max(HERO_SEQUENCE.frameStart, Math.round(frame)),
      );
      wantedFrameRef.current = safeFrame;
      prioritizeNearby(safeFrame);
      scheduleDraw();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (resizeRequest !== null) window.cancelAnimationFrame(resizeRequest);
      resizeRequest = window.requestAnimationFrame(() => {
        resizeRequest = null;
        scheduleDraw();
      });
    });

    resizeObserver.observe(canvas);

    if (reducedMotion) {
      addFrames([staticFrame], 300);
    } else {
      addFrames([1], 300);
      addFrames(range(2, HERO_SEQUENCE.criticalEnd), 250);
    }

    pump();

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      requestFrameRef.current = () => undefined;
      if (renderRequestRef.current !== null) {
        window.cancelAnimationFrame(renderRequestRef.current);
        renderRequestRef.current = null;
      }
      if (resizeRequest !== null) window.cancelAnimationFrame(resizeRequest);
      queue.length = 0;
      cache.forEach(({ image }) => {
        image.onload = null;
        image.onerror = null;
        image.src = "";
      });
      cache.clear();
    };
  }, [reducedMotion, staticFrame]);

  return { canvasRef, criticalProgress, criticalReady, requestFrame };
}
