import type Lenis from "lenis";

let instance: Lenis | null = null;
let locked = false;

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis && locked) lenis.stop();
}

/** Freezes wheel, touch and keyboard scrolling, e.g. while the hero loader is on screen. */
export function setScrollLocked(value: boolean) {
  locked = value;
  if (!instance) return;
  if (value) instance.stop();
  else instance.start();
}

/** Glides to a position or element; longer journeys take a little longer, within limits. */
export function scrollToTarget(target: number | HTMLElement) {
  const destination = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;

  if (!instance) {
    window.scrollTo({ top: destination });
    return;
  }

  // A numeric destination measured against the real scroll position stays exact even if
  // Lenis's internal position drifted after a native scroll (keyboard, find-in-page).
  const distance = Math.abs(destination - window.scrollY);
  instance.scrollTo(destination, {
    duration: Math.min(2.4, 0.9 + distance / 12000),
    easing: easeOutQuart,
  });
}
