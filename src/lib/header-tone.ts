import { ScrollTrigger } from "@/lib/gsap";

export type HeaderTone = "ink" | "ivory";

export function setHeaderTone(tone: HeaderTone) {
  const root = document.documentElement;
  // Callers fire on every scroll update; only a real change touches the DOM.
  if ((root.dataset.headerTone === "ivory" ? "ivory" : "ink") === tone) return;
  if (tone === "ivory") root.dataset.headerTone = "ivory";
  else delete root.dataset.headerTone;
}

/** The vertical midline of the fixed header, where a tone change should happen. */
export function getHeaderLine() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  return Math.round((header?.offsetHeight ?? 76) / 2);
}

/**
 * Turns the fixed header ivory while a dark band passes beneath it.
 * ScrollTrigger reads unitless offsets, so the midline is resolved in pixels.
 */
export function createIvoryHeaderZone(trigger: Element | string, endTrigger?: Element | string) {
  return ScrollTrigger.create({
    trigger,
    endTrigger,
    start: () => `top ${getHeaderLine()}px`,
    end: () => `bottom ${getHeaderLine()}px`,
    onEnter: () => setHeaderTone("ivory"),
    onEnterBack: () => setHeaderTone("ivory"),
    onLeave: () => setHeaderTone("ink"),
    onLeaveBack: () => setHeaderTone("ink"),
  });
}
