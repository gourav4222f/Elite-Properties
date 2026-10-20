"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { readPrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { HERO_VIDEO } from "@/lib/hero-video";

interface UseScrollVideoOptions {
  reducedMotion: boolean;
}

// One download per visit: returning to the page (client navigation) reuses the same file.
const downloads = new Map<string, Promise<string>>();

/**
 * Downloads the whole film before scrubbing. A seek into a range that has not arrived yet
 * stalls the picture, so the film is held in memory as a blob, with progress reported as
 * the bytes come in. If streaming the body is not possible, the plain URL is used instead.
 */
function downloadFilm(source: string, onProgress: (progress: number) => void) {
  let download = downloads.get(source);
  if (download) return download;

  download = (async () => {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Hero film responded ${response.status}`);

    const total = Number(response.headers.get("content-length")) || 0;
    if (!response.body || !total) return URL.createObjectURL(await response.blob());

    const reader = response.body.getReader();
    const chunks: BlobPart[] = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.byteLength;
      onProgress(received / total);
    }
    return URL.createObjectURL(new Blob(chunks, { type: "video/mp4" }));
  })();

  // A failed download is retried on the next visit rather than cached.
  download.catch(() => downloads.delete(source));
  downloads.set(source, download);
  return download;
}

/** The first format this browser can decode, at the size that suits the screen. */
function pickSource(video: HTMLVideoElement) {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const compact = window.matchMedia("(max-width: 767px)").matches || connection?.saveData;
  const format = HERO_VIDEO.sources.find((option) => video.canPlayType(option.type)) ?? HERO_VIDEO.sources[0];
  return compact ? format.compact : format.desktop;
}

export function useScrollVideo({ reducedMotion }: UseScrollVideoOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestProgressRef = useRef<(progress: number) => void>(() => undefined);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);

  /** Shows the frame at `progress` (0–1) through the film. */
  const requestProgress = useCallback((progress: number) => {
    requestProgressRef.current(progress);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    // With motion reduced the hero is a still photograph, so the film is never downloaded.
    // The preference is read directly too: on the first render the hook has not read it yet.
    if (!video || reducedMotion || readPrefersReducedMotion()) return;

    let disposed = false;
    let seekable = false;
    let seeking = false;
    let wantedFrame = 0;
    let shownFrame = -1;
    let seekWatchdog = 0;

    // Only one seek runs at a time; when it lands, the next one jumps straight to wherever
    // the scroll is now. Queuing every intermediate position is what makes scrubbing lag.
    const seek = () => {
      if (!seekable || seeking || wantedFrame === shownFrame) return;
      seeking = true;
      shownFrame = wantedFrame;
      // A quarter into the frame, so rounding never lands on the previous one.
      video.currentTime = (wantedFrame + 0.25) / HERO_VIDEO.fps;
      // Some browsers skip `seeked` for a no-op seek; never let one wedge the queue.
      window.clearTimeout(seekWatchdog);
      seekWatchdog = window.setTimeout(handleSeeked, 400);
    };

    const handleSeeked = () => {
      window.clearTimeout(seekWatchdog);
      seeking = false;
      seek();
    };

    requestProgressRef.current = (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      wantedFrame = Math.round(clamped * (HERO_VIDEO.frameCount - 1));
      seek();
    };

    const handleLoaded = () => {
      if (disposed || seekable) return;
      seekable = true;
      // iOS only paints seeks on a video that has played once; it is muted, so this is allowed.
      const priming = video.play();
      const settle = () => {
        if (disposed) return;
        video.pause();
        shownFrame = -1;
        seek();
        setLoadProgress(1);
        setReady(true);
      };
      if (priming) priming.then(settle, settle);
      else settle();
    };

    // A browser that cannot decode the film keeps the poster; the story still scrolls over it.
    const handleError = () => {
      if (disposed) return;
      setLoadProgress(1);
      setReady(true);
    };

    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("error", handleError);

    const source = pickSource(video);
    downloadFilm(source, (progress) => {
      // Whole percents are all the loader shows, so smaller steps skip the re-render.
      if (!disposed) setLoadProgress((current) => (progress - current >= 0.01 ? progress : current));
    }).then(
      (url) => {
        if (!disposed) video.src = url;
      },
      () => {
        if (!disposed) video.src = source;
      },
    );

    return () => {
      disposed = true;
      window.clearTimeout(seekWatchdog);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("error", handleError);
      requestProgressRef.current = () => undefined;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [reducedMotion]);

  return {
    videoRef,
    loadProgress: reducedMotion ? 1 : loadProgress,
    ready: reducedMotion || ready,
    requestProgress,
  };
}
