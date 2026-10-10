"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerLenis, scrollToTarget } from "@/lib/smooth-scroll";

/**
 * In-page links glide instead of jumping. Handling them in the capture phase also stops
 * next/link from running its own hash scroll, which would fight the smooth one.
 */
function handleHashLinkClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
  const hash = link?.getAttribute("href");
  if (!hash || hash.length < 2) return;

  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;

  event.preventDefault();
  scrollToTarget(target);
  window.history.pushState(null, "", hash);

  // Keyboard and screen-reader users continue from the destination, without a second jump.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
    });

    // ScrollTrigger already updates on native scroll events (touch, keyboard). Lenis only has
    // to hand over the positions it animates itself, so each scroll is processed once.
    lenis.on("scroll", (instance: Lenis) => {
      if (instance.isScrolling === "smooth") ScrollTrigger.update();
    });
    // Lenis rewrites its classes on <html> whenever scrolling starts or stops, which restyles
    // the whole document mid-gesture. Its base class is kept; the churn is switched off.
    Object.assign(lenis, { updateClassName: () => undefined });
    registerLenis(lenis);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener("click", handleHashLinkClick, { capture: true });

    // Late font swaps change line breaks, so trigger positions are re-measured once fonts settle.
    let active = true;
    document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      window.removeEventListener("click", handleHashLinkClick, { capture: true });
      gsap.ticker.remove(update);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return children;
}
