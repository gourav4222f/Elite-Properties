import type Lenis from "lenis";

let instance: Lenis | null = null;
// Several things can hold scrolling (the hero loader, a page turn); it resumes when none do.
const locks = new Set<string>();

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis && locks.size) lenis.stop();
}

/** Freezes wheel, touch and keyboard scrolling while `reason` holds it, e.g. the hero loader. */
export function setScrollLocked(reason: string, value: boolean) {
  if (value) locks.add(reason);
  else locks.delete(reason);
  if (!instance) return;
  if (locks.size) instance.stop();
  else instance.start();
}

/** Where an anchor sits on the page, honouring its CSS `scroll-margin-top`. */
function anchorTop(anchor: HTMLElement) {
  const margin = Number.parseFloat(getComputedStyle(anchor).scrollMarginTop) || 0;
  return Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - margin);
}

/** Glides to a position or element; longer journeys take a little longer, within limits. */
export function scrollToTarget(target: number | HTMLElement) {
  const destination = typeof target === "number" ? target : anchorTop(target);

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

/** Jumps without easing, to the top or an anchor, e.g. when a new page has replaced the old one. */
export function resetScroll(anchor?: HTMLElement | null) {
  const destination = anchor ? anchorTop(anchor) : 0;
  if (instance) instance.scrollTo(destination, { immediate: true, force: true });
  else window.scrollTo(0, destination);
}
