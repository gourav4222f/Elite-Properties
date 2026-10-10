"use client";

import { useEffect, type RefObject } from "react";

import { gsap } from "@/lib/gsap";

/**
 * Drives a floating cursor label over any `[data-cursor-view]` element inside `rootRef`.
 * Delegated listeners keep it working when the targets re-render.
 */
export function useViewCursor(
  rootRef: RefObject<HTMLElement | null>,
  cursorRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const root = rootRef.current;
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!root || !cursor || !finePointer || !enabled) return;

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };
    const handleOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest("[data-cursor-view]") : null;
      cursor.classList.toggle("is-visible", Boolean(target));
    };
    const hide = () => cursor.classList.remove("is-visible");

    window.addEventListener("pointermove", handleMove, { passive: true });
    root.addEventListener("pointerover", handleOver);
    root.addEventListener("pointerleave", hide);

    return () => {
      hide();
      window.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerover", handleOver);
      root.removeEventListener("pointerleave", hide);
    };
  }, [cursorRef, enabled, rootRef]);
}
