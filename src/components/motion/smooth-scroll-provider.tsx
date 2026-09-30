"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      autoRaf: false,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return children;
}
