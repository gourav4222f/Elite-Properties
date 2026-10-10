"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { whenPageShown } from "@/components/layout/page-transition";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getScrub, gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { animateImage } from "@/lib/image-motion";
import { ownedBy, revealOnScroll } from "@/lib/reveal";

/**
 * The `<main>` of every inner page. Pages stay server-rendered and describe their motion with
 * data attributes; this applies the same language the homepage uses:
 *
 * - `[data-hero-lines]`, `[data-hero-fade]`, `[data-hero-image]`: the opening, played once the
 *   page is visible
 * - `[data-reveal-lines]`, `[data-reveal]`, `[data-image]`: scroll reveals (see `revealOnScroll`)
 * - `[data-rule]`: hairlines draw in from the left
 * - `[data-count]`: figures count up to their value once in view
 * - `[data-read]`: a statement's `.read-word`s brighten as it travels up the screen
 * - `[data-drift="n"]`: oversized type drifts n% sideways across its pass
 * - `[data-header-ivory]`: dark bands that turn the fixed header ivory
 */
export function PageMotion({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let active = true;

    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-header-ivory]").forEach((zone) => createIvoryHeaderZone(zone));
      if (reducedMotion) return;

      const heroLines = root.querySelectorAll("[data-hero-lines] .line-mask > span");
      const heroFade = root.querySelectorAll("[data-hero-fade]");
      const heroImages = root.querySelectorAll<HTMLElement>("[data-hero-image]");
      gsap.set(heroLines, { yPercent: 112 });
      gsap.set(heroFade, { autoAlpha: 0, y: 18 });
      heroImages.forEach((frame) => {
        animateImage(frame, { reveal: "none", parallax: Number(frame.dataset.parallax) || 0 });
        gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
      });

      whenPageShown().then(() => {
        if (!active) return;
        context.add(() => {
          gsap.to(heroLines, { yPercent: 0, duration: 1.15, stagger: 0.1, ease: "power4.out" });
          gsap.to(heroFade, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 0.35, ease: motionEasings.enter });
          heroImages.forEach((frame) => {
            const media = frame.querySelector("img");
            gsap.to(frame, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.4,
              delay: 0.15,
              ease: "power3.inOut",
              onComplete: () => {
                gsap.set(frame, { clearProps: "clipPath" });
              },
            });
            if (media) gsap.from(media, { scale: "+=0.14", duration: 2.1, delay: 0.15, ease: "expo.out" });
          });
        });
      });

      revealOnScroll(root);

      // Listing cards outside the collection browser, e.g. similar properties.
      ownedBy(root, "[data-listing-frame]").forEach((frame) => animateImage(frame, { reveal: "up", parallax: 4 }));
      ownedBy(root, ".listing-body").forEach((body) => {
        gsap.fromTo(
          body,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            delay: 0.2,
            ease: motionEasings.enter,
            scrollTrigger: { trigger: body, start: "top 94%", once: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-rule]").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: rule, start: "top 92%", once: true },
          },
        );
      });

      ownedBy(root, "[data-count]").forEach((value) => {
        const target = Number(value.dataset.count);
        const decimals = value.dataset.count?.includes(".") ? 1 : 0;
        const counter = { value: 0 };
        value.textContent = counter.value.toFixed(decimals);
        gsap.to(counter, {
          value: target,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: () => {
            value.textContent = counter.value.toFixed(decimals);
          },
          scrollTrigger: { trigger: value, start: "top 88%", once: true },
        });
      });

      ownedBy(root, "[data-read]").forEach((statement) => {
        gsap.fromTo(
          statement.querySelectorAll(".read-word"),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: statement, start: "top 78%", end: "bottom 42%", scrub: getScrub() },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-drift]").forEach((word) => {
        const amount = Number(word.dataset.drift) || 6;
        gsap.fromTo(
          word,
          { xPercent: -amount },
          {
            xPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: word, start: "top bottom", end: "bottom top", scrub: getScrub() },
          },
        );
      });
    }, root);

    return () => {
      active = false;
      context.revert();
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((value) => {
        value.textContent = value.dataset.count ?? "";
      });
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <main ref={rootRef} id="main-content" className={className}>
      {children}
    </main>
  );
}
