"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { clampFrame, getFramePath, HERO_SEQUENCE } from "@/lib/frame-sequence";
import { gsap } from "@/lib/gsap";

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

/** Every 8th frame first, then every 4th, 2nd and the rest, so any scroll position soon has a near neighbour. */
function coarseToFine(start: number, end: number) {
  const order: number[] = [];
  const queued = new Set<number>();
  for (const stride of [8, 4, 2, 1]) {
    for (let frame = start; frame <= end; frame += 1) {
      if ((frame - 1) % stride !== 0 || queued.has(frame)) continue;
      queued.add(frame);
      order.push(frame);
    }
  }
  return order;
}

const offsetCache = new Map<number, number[]>();

/** Offsets ahead of the playhead: dense close by, sparser further out where only continuity matters. */
function windowOffsets(reach: number) {
  let offsets = offsetCache.get(reach);
  if (offsets) return offsets;
  offsets = [];
  for (let step = 0; step <= reach; step += 1) {
    const stride = step <= 12 ? 1 : step <= 36 ? 2 : step <= 72 ? 4 : 8;
    if (step % stride === 0) offsets.push(step);
  }
  offsetCache.set(reach, offsets);
  return offsets;
}

// Decodes run on worker threads; leaving cores free keeps compositing smooth on small devices.
function getDecodeConcurrency() {
  const cores = navigator.hardwareConcurrency || 4;
  return Math.min(HERO_SEQUENCE.maxDecodeConcurrency, Math.max(2, Math.floor(cores / 2)));
}

// Each decoded 1280×720 frame holds ~3.7 MB, so smaller devices keep a tighter window.
function getDecodedFrameBudget() {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory <= 2) return 24;
  if (window.innerWidth < 768 || (memory !== undefined && memory <= 4)) return 40;
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
    let drawnIsPreview = false;
    let needsPaint = false;
    let direction = 1;
    let velocity = 0;
    let lastRequestAt = 0;
    let epoch = 0;
    let decoding = 0;
    let accessCounter = 0;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let warmingStarted = false;
    const budget = getDecodedFrameBudget();
    const lookBehind = Math.min(HERO_SEQUENCE.lookBehind, Math.floor(budget * 0.15));
    const minReach = Math.min(HERO_SEQUENCE.lookAhead, Math.floor(budget * 0.5));
    // The widest window that still fits the decoded budget alongside the frames kept behind.
    let maxReach = minReach;
    while (maxReach < 160 && windowOffsets(maxReach + 1).length + lookBehind <= budget - 4) maxReach += 1;
    const decodeConcurrency = getDecodeConcurrency();
    const queue = new Map<number, DecodeRequest>();
    const pending = new Set<number>();
    const failed = new Set<number>();
    const cache = new Map<number, CacheEntry>();
    // Low-resolution keyframes that stand in while a full frame is still on its way.
    const previews = new Map<number, CacheEntry>();
    const criticalFrames = new Set(
      reducedMotion ? [staticFrame] : range(HERO_SEQUENCE.frameStart, HERO_SEQUENCE.criticalEnd),
    );
    const criticalSettled = new Set<number>();
    const inFlight = new Map<number, DecodeRequest>();
    const abort = new AbortController();
    let worker: Worker | null = null;
    try {
      worker = new Worker(new URL("../workers/frame-loader.worker.ts", import.meta.url), { type: "module" });
    } catch {
      worker = null;
    }

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

    const findNearestPreview = (frame: number) => {
      const stride = HERO_SEQUENCE.previewStride;
      const anchor = Math.round((frame - 1) / stride) * stride + 1;
      let nearest: number | null = null;
      for (const candidate of [anchor, anchor - stride, anchor + stride]) {
        if (!previews.has(candidate)) continue;
        if (nearest === null || Math.abs(candidate - frame) < Math.abs(nearest - frame)) nearest = candidate;
      }
      return nearest;
    };

    const paint = (force = false) => {
      if (!viewportWidth || !viewportHeight) return;

      // A full frame close by always wins; otherwise a nearer keyframe beats a stale full
      // frame, so the footage keeps pace with the scroll even before everything has loaded.
      let frame = findNearestLoaded(wantedFrame);
      let usePreview = false;
      const fullDistance = frame === null ? Infinity : Math.abs(frame - wantedFrame);
      if (fullDistance > 2) {
        const keyframe = findNearestPreview(wantedFrame);
        if (keyframe !== null && Math.abs(keyframe - wantedFrame) < fullDistance) {
          frame = keyframe;
          usePreview = true;
        }
      }
      if (frame === null || (!force && frame === drawnFrame && usePreview === drawnIsPreview)) return;

      const entry = usePreview ? previews.get(frame) : cache.get(frame);
      if (!entry) return;

      entry.lastUsed = ++accessCounter;
      drawnIsPreview = usePreview;
      const scale = Math.max(canvas.width / entry.width, canvas.height / entry.height);
      const width = entry.width * scale;
      const height = entry.height * scale;
      context.drawImage(entry.source, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      drawnFrame = frame;
    };

    // One draw per frame at most, after the scroll update and the story timeline have run.
    const flush = () => {
      if (!needsPaint) return;
      needsPaint = false;
      paint();
    };
    // Registered a frame late so it sits after Lenis in GSAP's ticker on every tick.
    const registerFlush = window.requestAnimationFrame(() => gsap.ticker.add(flush));

    // Closing a bitmap frees memory synchronously, so evictions are released once the
    // main thread is idle rather than in the middle of a scroll.
    const releaseQueue: CacheEntry[] = [];
    let releaseScheduled = false;
    const releaseLater = (entry: CacheEntry) => {
      releaseQueue.push(entry);
      if (releaseScheduled) return;
      releaseScheduled = true;
      const flushReleases = () => {
        releaseScheduled = false;
        releaseQueue.splice(0).forEach(releaseFrame);
      };
      // Safari has no requestIdleCallback; a short timeout keeps the release off the scroll path.
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(flushReleases, { timeout: 600 });
      else window.setTimeout(flushReleases, 200);
    };

    // Frames behind the direction of travel go first; they are the least likely to be needed.
    const evictDistantFrames = () => {
      while (cache.size > budget) {
        let victim = -1;
        let worst = -1;
        for (const frame of cache.keys()) {
          if (frame === drawnFrame || frame === HERO_SEQUENCE.frameStart) continue;
          const offset = (frame - wantedFrame) * direction;
          const cost = offset >= 0 ? offset : -offset * 3;
          if (cost > worst) {
            worst = cost;
            victim = frame;
          }
        }
        const entry = cache.get(victim);
        if (!entry) return;
        cache.delete(victim);
        releaseLater(entry);
      }
    };

    // Distant frames are only fetched into the HTTP cache; decoding waits until they are near.
    const startWarming = () => {
      if (reducedMotion || warmingStarted) return;
      warmingStarted = true;
      const order = coarseToFine(HERO_SEQUENCE.criticalEnd + 1, HERO_SEQUENCE.frameEnd);

      if (worker) {
        const stride = HERO_SEQUENCE.previewStride;
        const keyframes = range(HERO_SEQUENCE.frameStart, HERO_SEQUENCE.frameEnd).filter(
          (frame) => (frame - 1) % stride === 0,
        );
        const previewWidth = viewportWidth < 768 ? 320 : 448;
        worker.postMessage({
          type: "background",
          previews: keyframes.map((frame) => ({ frame, url: getFramePath(frame) })),
          previewWidth,
          previewHeight: Math.round((previewWidth * HERO_SEQUENCE.frameHeight) / HERO_SEQUENCE.frameWidth),
          warm: order.filter((frame) => (frame - 1) % stride !== 0).map(getFramePath),
          lanes: HERO_SEQUENCE.warmConcurrency,
        });
        return;
      }

      let cursor = 0;

      const warmNext = (): Promise<void> | undefined => {
        while (cursor < order.length && (cache.has(order[cursor]) || pending.has(order[cursor]))) cursor += 1;
        if (disposed || cursor >= order.length) return undefined;

        const frame = order[cursor];
        cursor += 1;
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

    const handleDecoded = (frame: number, entry: CacheEntry) => {
      if (disposed) {
        releaseFrame(entry);
        return;
      }
      decoding -= 1;
      pending.delete(frame);
      inFlight.delete(frame);
      entry.lastUsed = ++accessCounter;
      cache.set(frame, entry);
      settleCritical(frame);
      evictDistantFrames();
      if (drawnFrame === -1 || drawnIsPreview || Math.abs(frame - wantedFrame) < Math.abs(drawnFrame - wantedFrame)) {
        needsPaint = true;
      }
      pump();
    };

    const handleFailed = (request: DecodeRequest) => {
      if (disposed) return;
      const { frame } = request;
      decoding -= 1;
      pending.delete(frame);
      inFlight.delete(frame);

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
    };

    if (worker) {
      worker.onmessage = (event: MessageEvent<{ type: string; frame: number; bitmap?: ImageBitmap }>) => {
        const { type, frame, bitmap } = event.data;

        if (type === "preview" && bitmap) {
          if (disposed) {
            bitmap.close();
            return;
          }
          previews.set(frame, { source: bitmap, width: bitmap.width, height: bitmap.height, lastUsed: 0 });
          if (drawnIsPreview || Math.abs(drawnFrame - wantedFrame) > Math.abs(frame - wantedFrame)) needsPaint = true;
          return;
        }

        const request = inFlight.get(frame);
        if (!request) {
          bitmap?.close();
          return;
        }

        if (type === "decoded" && bitmap) {
          handleDecoded(frame, { source: bitmap, width: bitmap.width, height: bitmap.height, lastUsed: 0 });
        } else if (type === "unsupported") {
          // No ImageBitmap in workers here: everything in flight is decoded on the page instead.
          worker?.terminate();
          worker = null;
          inFlight.forEach((stranded, strandedFrame) => {
            pending.delete(strandedFrame);
            queue.set(strandedFrame, stranded);
          });
          decoding -= inFlight.size;
          inFlight.clear();
          pump();
        } else {
          handleFailed(request);
        }
      };
    }

    const decodeFrame = (request: DecodeRequest) => {
      const { frame } = request;
      decoding += 1;
      pending.add(frame);
      inFlight.set(frame, request);

      if (worker) {
        worker.postMessage({ type: "decode", frame, url: getFramePath(frame) });
        return;
      }

      loadFrame(frame, abort.signal).then(
        (entry) => handleDecoded(frame, entry),
        () => handleFailed(request),
      );
    };

    const enqueue = (frame: number, priority: number) => {
      if (frame < HERO_SEQUENCE.frameStart || frame > HERO_SEQUENCE.frameEnd) return;
      if (cache.has(frame) || pending.has(frame) || failed.has(frame)) return;

      const existing = queue.get(frame);
      if (existing) existing.priority = Math.max(existing.priority, priority);
      else queue.set(frame, { frame, priority, attempt: 0 });
    };

    // Newer requests outrank older ones; the window leans into the direction of travel and
    // reaches further the faster the scroll, so quick flicks still find frames waiting.
    const prioritizeAround = (frame: number) => {
      const reach = Math.min(maxReach, Math.max(minReach, Math.round(velocity * 0.45)));
      const offsets = windowOffsets(reach);
      epoch += 1;
      const base = epoch * 1000;

      offsets.forEach((step, index) => enqueue(frame + direction * step, base - index));
      for (let step = 1; step <= lookBehind; step += 1) {
        enqueue(frame - direction * step, base - offsets.length - step);
      }

      for (const request of queue.values()) {
        if (request.priority === CRITICAL_PRIORITY) continue;
        const offset = (request.frame - frame) * direction;
        if (offset < -lookBehind || offset > reach) queue.delete(request.frame);
      }

      pump();
    };

    requestFrameRef.current = (value: number) => {
      const frame = clampFrame(value);
      if (frame === wantedFrame) return;

      const now = performance.now();
      const elapsed = Math.max(8, now - lastRequestAt);
      const instant = (Math.abs(frame - wantedFrame) / elapsed) * 1000;
      velocity = elapsed > 200 ? instant : velocity * 0.75 + instant * 0.25;
      lastRequestAt = now;

      direction = frame > wantedFrame ? 1 : -1;
      wantedFrame = frame;
      needsPaint = true;
      prioritizeAround(frame);
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      viewportWidth = entry.contentRect.width;
      viewportHeight = entry.contentRect.height;
      if (!viewportWidth || !viewportHeight) return;
      // Resizing clears the canvas, so it is redrawn in the same frame.
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
      worker?.terminate();
      window.cancelAnimationFrame(registerFlush);
      gsap.ticker.remove(flush);
      resizeObserver.disconnect();
      requestFrameRef.current = () => undefined;
      queue.clear();
      cache.forEach(releaseFrame);
      cache.clear();
      previews.forEach(releaseFrame);
      previews.clear();
      releaseQueue.splice(0).forEach(releaseFrame);
    };
  }, [reducedMotion, staticFrame]);

  return { canvasRef, criticalProgress, criticalReady, requestFrame };
}
