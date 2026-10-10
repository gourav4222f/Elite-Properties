import { getScrub, gsap, ScrollTrigger } from "@/lib/gsap";
import { ownedBy } from "@/lib/reveal";

export type RevealDirection = "up" | "left" | "none";

const HIDDEN_CLIP: Record<Exclude<RevealDirection, "none">, string> = {
  up: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
};
const OPEN_CLIP = "inset(0% 0% 0% 0%)";

// How far the photograph zooms out while its frame opens.
const REVEAL_ZOOM = 0.16;

let lastRevealAt = 0;

function waitForImage(media: Element | null) {
  const image = media instanceof HTMLImageElement ? media : media?.querySelector("img");
  if (!image || (image.complete && image.naturalWidth > 0)) return Promise.resolve();
  // Never hold a reveal for more than a moment on a slow connection.
  return Promise.race([
    image.decode().catch(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 1400)),
  ]);
}

/**
 * Gives one image frame the site's cinematic treatment. Call inside a gsap.context.
 *
 * - Reveal: the frame opens with a clip as it enters, while the photograph settles from a
 *   gentle zoom. It waits for the image to decode, so it never plays over an empty frame.
 * - Parallax: the photograph drifts `parallax`% of its height across the viewport pass,
 *   overscaled just enough that its edges never show.
 */
export function animateImage(
  frame: HTMLElement,
  { reveal = "up", parallax = 0 }: { reveal?: RevealDirection; parallax?: number } = {},
) {
  const media = frame.querySelector<HTMLElement>("[data-image-media]") ?? frame.querySelector("img");
  const drift = window.innerWidth < 768 ? parallax * 0.6 : parallax;
  const restScale = drift ? 1 + (drift * 2.2) / 100 : 1;

  if (media) gsap.set(media, { scale: restScale, transformOrigin: "50% 50%", force3D: true });

  if (media && drift) {
    gsap.fromTo(
      media,
      { yPercent: -drift },
      {
        yPercent: drift,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: getScrub(),
        },
      },
    );
  }

  if (reveal === "none") return;

  gsap.set(frame, { clipPath: HIDDEN_CLIP[reveal] });
  if (media) gsap.set(media, { scale: restScale + REVEAL_ZOOM });

  ScrollTrigger.create({
    trigger: frame,
    start: "top 96%",
    once: true,
    onEnter: () => {
      // Frames arriving together cascade instead of opening in unison.
      const now = performance.now();
      const delay = now - lastRevealAt < 160 ? 0.14 : 0;
      lastRevealAt = now + delay * 1000;

      waitForImage(media).then(() => {
        gsap.to(frame, {
          clipPath: OPEN_CLIP,
          duration: 1.3,
          delay,
          // Opens as soon as the frame appears, accelerates through the middle, lands softly.
          ease: "power3.inOut",
          // A finished clip is dropped so the frame stops repainting through it.
          onComplete: () => {
            gsap.set(frame, { clearProps: "clipPath" });
          },
        });
        if (media) gsap.to(media, { scale: restScale, duration: 2, delay, ease: "expo.out" });
      });
    },
  });
}

/** Applies `animateImage` to every `[data-image]` frame inside `root`. */
export function animateImages(root: HTMLElement) {
  ownedBy(root, "[data-image]").forEach((frame) => {
    animateImage(frame, {
      reveal: (frame.dataset.image || "up") as RevealDirection,
      parallax: Number(frame.dataset.parallax) || 0,
    });
  });
}
