"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { clampFrame, getFramePath, HERO_SEQUENCE } from "@/lib/frame-sequence";

interface DecodeRequest {
  frame: number;
  priority: number;
  attempt: number;
}

type FrameSource = ImageBitmap | HTMLImageElement;

interface CacheEntry {
  source: FrameSource;
  width: number;
  height: number;
  lastUsed: number;
}

interface UseFrameSequenceOptions {
  reducedMotion: boolean;
  staticFrame?: number;
}

const CRITICAL_PRIORITY = Number.MAX_SAFE_INTEGER;

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

// Decodes run on worker threads; leaving cores free keeps compositing smooth on small devices.
function getDecodeConcurrency() {
  const cores = navigator.hardwareConcurrency || 4;
  return Math.min(HERO_SEQUENCE.maxDecodeConcurrency, Math.max(2, Math.floor(cores / 2)));
}

// Each decoded 1280×720 frame holds ~3.7 MB, so smaller devices keep a tighter window.
function getDecodedFrameBudget() {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (window.innerWidth < 768 || (memory !== undefined && memory <= 4)) return 32;
  return 64;
}

/**
 * Fetches and decodes a frame off the main thread. Canvas cannot reuse the decode cache
 * that `img.decode()` fills, so an ImageBitmap is the only way to keep drawImage a plain blit.
 */
async function loadFrame(frame: number, signal: AbortSignal): Promise<CacheEntry> {
  const response = await fetch(getFramePath(frame), { signal });
  if (!response.ok) throw new Error(`Frame ${frame} responded ${response.status}`);
  const blob = await response.blob();

  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(blob);
    return { source: bitmap, width: bitmap.width, height: bitmap.height, lastUsed: 0 };
  }

  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, lastUsed: 0 };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function releaseFrame(entry: CacheEntry) {
  if ("close" in entry.source) entry.source.close();
  else entry.source.src = "";
}

export function useFrameSequence({
  reducedMotion,
  staticFrame = 606,
}: UseFrameSequenceOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestFrameRef = useRef<(frame: number) => void>(() => undefined);
  const [criticalProgress, setCriticalProgress] = useState(0);
  const [criticalReady, setCriticalReady] = useState(false);

  const requestFrame = useCallback((frame: number) => {
    requestFrameRef.current(frame);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    let disposed = false;
    let wantedFrame = reducedMotion ? staticFrame : HERO_SEQUENCE.frameStart;
    let drawnFrame = -1;
    let direction = 1;
    let epoch = 0;
    let decoding = 0;
    let accessCounter = 0;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let warmingStarted = false;
    const budget = getDecodedFrameBudget();
    const lookAhead = Math.min(HERO_SEQUENCE.lookAhead, Math.floor(budget * 0.55));
    const lookBehind = Math.min(HERO_SEQUENCE.lookBehind, Math.floor(budget * 0.15));
    const decodeConcurrency = getDecodeConcurrency();
    const queue = new Map<number, DecodeRequest>();
    const pending = new Set<number>();
    const failed = new Set<number>();
    const cache = new Map<number, CacheEntry>();
    const criticalFrames = new Set(
      reducedMotion ? [staticFrame] : range(HERO_SEQUENCE.frameStart, HERO_SEQUENCE.criticalEnd),
    );
    const criticalSettled = new Set<number>();
    const abort = new AbortController();

    // A canvas pixel finer than a source pixel adds fill cost without adding detail.
    const sizeCanvas = () => {
      const coverScale = Math.max(
        viewportWidth / HERO_SEQUENCE.frameWidth,
        viewportHeight / HERO_SEQUENCE.frameHeight,
      );
      const maxRatio = viewportWidth < 768 ? 1.5 : 2;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, maxRatio, Math.max(1, 1 / coverScale));
      const width = Math.round(viewportWidth * pixelRatio);
      const height = Math.round(viewportHeight * pixelRatio);
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      return true;
    };

    const findNearestLoaded = (frame: number) => {
      if (cache.has(frame)) return frame;

      for (let distance = 1; distance < HERO_SEQUENCE.frameCount; distance += 1) {
        // Prefer the frame just passed, so a loading gap never flashes ahead of the scroll.
        const behind = frame - direction * distance;
        const ahead = frame + direction * distance;
        if (cache.has(behind)) return behind;
        if (cache.has(ahead)) return ahead;
      }

      return null;
    };

    const paint = (force = false) => {
      if (!viewportWidth || !viewportHeight) return;

      const frame = findNearestLoaded(wantedFrame);
      if (frame === null || (!force && frame === drawnFrame)) return;

      const entry = cache.get(frame);
      if (!entry) return;

      entry.lastUsed = ++accessCounter;
      const scale = Math.max(canvas.width / entry.width, canvas.height / entry.height);
      const width = entry.width * scale;
      const height = entry.height * scale;
      context.drawImage(entry.source, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      drawnFrame = frame;
    };

    const evictDistantFrames = () => {
      if (cache.size <= budget) return;

      const candidates = [...cache.entries()]
        .filter(([frame]) => frame !== drawnFrame && frame !== HERO_SEQUENCE.frameStart)
        .sort(
          (a, b) =>
            Math.abs(b[0] - wantedFrame) - Math.abs(a[0] - wantedFrame) || a[1].lastUsed - b[1].lastUsed,
        );

      for (const [frame, entry] of candidates) {
        if (cache.size <= budget) break;
        cache.delete(frame);
        releaseFrame(entry);
      }
    };

    // Distant frames are only fetched into the HTTP cache; decoding waits until they are near.
    const startWarming = () => {
      if (reducedMotion || warmingStarted) return;
      warmingStarted = true;
      let next = HERO_SEQUENCE.criticalEnd + 1;

      const warmNext = (): Promise<void> | undefined => {
        while (next <= HERO_SEQUENCE.frameEnd && (cache.has(next) || pending.has(next))) next += 1;
        if (disposed || next > HERO_SEQUENCE.frameEnd) return undefined;

        const frame = next;
        next += 1;
        return fetch(getFramePath(frame), { signal: abort.signal, priority: "low" })
          .then((response) => response.blob())
          .then(
            () => undefined,
            () => undefined,
          )
          .then(warmNext);
      };

      for (let lane = 0; lane < HERO_SEQUENCE.warmConcurrency; lane += 1) warmNext();
    };

    const settleCritical = (frame: number) => {
      if (!criticalFrames.has(frame) || criticalSettled.has(frame)) return;
      criticalSettled.add(frame);
      setCriticalProgress(criticalSettled.size / criticalFrames.size);

      if (criticalSettled.size === criticalFrames.size) {
        setCriticalReady(true);
        startWarming();
      }
    };

    const takeNext = () => {
      let next: DecodeRequest | undefined;
      for (const request of queue.values()) {
        if (!next || request.priority > next.priority) next = request;
      }
      if (next) queue.delete(next.frame);
      return next;
    };

    const pump = () => {
      while (!disposed && decoding < decodeConcurrency) {
        const request = takeNext();
        if (!request) return;
        decodeFrame(request);
      }
    };

    const decodeFrame = (request: DecodeRequest) => {
      const { frame } = request;
      decoding += 1;
      pending.add(frame);

      loadFrame(frame, abort.signal).then(
        (entry) => {
          if (disposed) {
            releaseFrame(entry);
            return;
          }
          decoding -= 1;
          pending.delete(frame);
          entry.lastUsed = ++accessCounter;
          cache.set(frame, entry);
          settleCritical(frame);
          evictDistantFrames();
          paint();
          pump();
        },
        () => {
          if (disposed) return;
          decoding -= 1;
          pending.delete(frame);

          if (request.attempt < 2) {
            window.setTimeout(() => {
              if (disposed || cache.has(frame)) return;
              queue.set(frame, { ...request, attempt: request.attempt + 1 });
              pump();
            }, request.attempt === 0 ? 250 : 700);
          } else {
            failed.add(frame);
            settleCritical(frame);
          }

          pump();
        },
      );
    };

    const enqueue = (frame: number, priority: number) => {
      if (frame < HERO_SEQUENCE.frameStart || frame > HERO_SEQUENCE.frameEnd) return;
      if (cache.has(frame) || pending.has(frame) || failed.has(frame)) return;

      const existing = queue.get(frame);
      if (existing) existing.priority = Math.max(existing.priority, priority);
      else queue.set(frame, { frame, priority, attempt: 0 });
    };

    // Newer requests outrank older ones, and the window leans in the direction of travel.
    const prioritizeAround = (frame: number) => {
      epoch += 1;
      const base = epoch * 1000;
      for (let step = 0; step <= lookAhead; step += 1) {
        enqueue(frame + direction * step, base - step);
      }
      for (let step = 1; step <= lookBehind; step += 1) {
        enqueue(frame - direction * step, base - lookAhead - step);
      }

      const reach = lookAhead + lookBehind;
      for (const request of queue.values()) {
        if (request.priority !== CRITICAL_PRIORITY && Math.abs(request.frame - frame) > reach) {
          queue.delete(request.frame);
        }
      }

      pump();
    };

    requestFrameRef.current = (value: number) => {
      const frame = clampFrame(value);
      if (frame === wantedFrame) return;

      direction = frame > wantedFrame ? 1 : -1;
      wantedFrame = frame;
      prioritizeAround(frame);
      // Called from GSAP's tick, so the canvas updates in the same frame as the story text.
      paint();
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      viewportWidth = entry.contentRect.width;
      viewportHeight = entry.contentRect.height;
      if (!viewportWidth || !viewportHeight) return;
      if (sizeCanvas() || drawnFrame === -1) paint(true);
    });

    resizeObserver.observe(canvas);

    criticalFrames.forEach((frame) => {
      queue.set(frame, { frame, priority: CRITICAL_PRIORITY, attempt: 0 });
    });
    pump();

    return () => {
      disposed = true;
      abort.abort();
      resizeObserver.disconnect();
      requestFrameRef.current = () => undefined;
      queue.clear();
      cache.forEach(releaseFrame);
      cache.clear();
    };
  }, [reducedMotion, staticFrame]);

  return { canvasRef, criticalProgress, criticalReady, requestFrame };
}
