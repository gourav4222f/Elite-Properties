"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { chapterForPath } from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { resetScroll, setScrollLocked } from "@/lib/smooth-scroll";

const NAVIGATE_EVENT = "elite:navigate";
const SHOWN_EVENT = "elite:page-shown";

/**
 * Resolves once the page is visible: at once on a fresh load, or as the curtain lifts after
 * a page turn, so a page's opening animation is never spent behind the curtain.
 */
export function whenPageShown() {
  if (document.documentElement.dataset.pageTurn !== "true") return Promise.resolve();
  return new Promise<void>((resolve) => window.addEventListener(SHOWN_EVENT, () => resolve(), { once: true }));
}

/** Navigates with the page-turn transition from code, e.g. after a search form is submitted. */
export function turnPage(href: string) {
  window.dispatchEvent(new CustomEvent<string>(NAVIGATE_EVENT, { detail: href }));
}

const CLOSED = "inset(100% 0% 0% 0%)";
const COVERED = "inset(0% 0% 0% 0%)";
const LIFTED = "inset(0% 0% 100% 0%)";

/**
 * Turns the page between routes: an ink curtain rises with the destination chapter's name,
 * the route changes underneath, and the curtain lifts away once the new page has rendered.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const curtainRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<{ hash: string; timeout: number } | null>(null);
  const liftRef = useRef<() => void>(() => undefined);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const go = (url: URL) => {
      const href = url.pathname + url.search + url.hash;
      const curtain = curtainRef.current;
      if (reducedMotion || !curtain) {
        router.push(href);
        return;
      }
      if (pendingRef.current) return;

      setCaption(chapterForPath(url.pathname)?.label ?? "Elite Properties");
      setScrollLocked("page-turn", true);
      document.documentElement.dataset.pageTurn = "true";
      // If the route never resolves, the curtain still lifts rather than trapping the visitor.
      const timeout = window.setTimeout(() => lift(), 8000);
      pendingRef.current = { hash: url.hash, timeout };

      gsap.killTweensOf(curtain);
      gsap.fromTo(
        curtain,
        { clipPath: CLOSED, visibility: "visible" },
        { clipPath: COVERED, duration: 0.6, ease: "power3.inOut", onComplete: () => router.push(href) },
      );
      gsap.fromTo(
        curtain.querySelectorAll("[data-curtain-copy]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "power4.out", delay: 0.22 },
      );
    };

    const handleNavigate = (event: Event) => {
      const url = new URL((event as CustomEvent<string>).detail, window.location.href);
      if (url.pathname === window.location.pathname) router.push(url.pathname + url.search + url.hash);
      else go(url);
    };

    const handleClick = (event: MouseEvent) => {
      if (reducedMotion) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      // Other sites, same-page anchors and filter changes are left to the browser and router.
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      event.preventDefault();
      go(url);
    };

    const lift = () => {
      const curtain = curtainRef.current;
      const pending = pendingRef.current;
      if (!curtain || !pending) return;
      window.clearTimeout(pending.timeout);
      pendingRef.current = null;

      gsap.killTweensOf(curtain);
      // The new page starts its opening as the curtain clears its upper half.
      window.setTimeout(() => {
        delete document.documentElement.dataset.pageTurn;
        window.dispatchEvent(new Event(SHOWN_EVENT));
      }, 380);
      gsap.to(curtain, {
        clipPath: LIFTED,
        duration: 0.8,
        delay: 0.12,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(curtain, { clipPath: CLOSED, visibility: "hidden" });
          setScrollLocked("page-turn", false);
        },
      });
    };

    liftRef.current = lift;
    window.addEventListener("click", handleClick, { capture: true });
    window.addEventListener(NAVIGATE_EVENT, handleNavigate);
    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener(NAVIGATE_EVENT, handleNavigate);
    };
  }, [reducedMotion, router]);

  // A new page is in place. Shared parts (header, footer) re-measure against it on every
  // route change, including back and forward; after a page turn it starts from the top (or
  // its anchor) and the curtain lifts.
  useEffect(() => {
    const pending = pendingRef.current;
    const frame = window.requestAnimationFrame(() => {
      if (pending) {
        const anchor = pending.hash ? document.getElementById(decodeURIComponent(pending.hash.slice(1))) : null;
        resetScroll(anchor);
      }
      ScrollTrigger.refresh();
      if (pending) liftRef.current();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <>
      {children}
      <div ref={curtainRef} className="page-curtain" aria-hidden="true">
        <div className="page-curtain-inner">
          <span className="page-curtain-mask">
            <span data-curtain-copy className="page-curtain-label">Elite Properties</span>
          </span>
          <span className="page-curtain-mask">
            <span data-curtain-copy className="page-curtain-title">{caption}</span>
          </span>
        </div>
      </div>
    </>
  );
}
