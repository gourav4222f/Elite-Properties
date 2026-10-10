import { gsap, motionEasings, ScrollTrigger } from "@/lib/gsap";
import { animateImages } from "@/lib/image-motion";

/**
 * Applies the site's standard scroll reveals inside `root`. Call it within a gsap.context
 * so everything it creates is reverted with the section.
 *
 * - `[data-reveal-lines]`: masked `.line-mask > span` lines rise into place
 * - `[data-reveal]`: copy fades up, batched so neighbours stagger naturally
 * - `[data-image]`: image frames reveal and drift (see `animateImages`)
 */
export function revealOnScroll(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-reveal-lines]").forEach((heading) => {
    gsap.fromTo(
      heading.querySelectorAll(".line-mask > span"),
      { yPercent: 112 },
      {
        yPercent: 0,
        duration: 1.05,
        stagger: 0.1,
        ease: motionEasings.cinematic,
        scrollTrigger: { trigger: heading, start: "top 80%", once: true },
      },
    );
  });

  const copy = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-reveal]"));
  if (copy.length) {
    gsap.set(copy, { y: 24, autoAlpha: 0 });
    ScrollTrigger.batch(copy, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: motionEasings.enter,
          overwrite: true,
        }),
    });
  }

  animateImages(root);
}
