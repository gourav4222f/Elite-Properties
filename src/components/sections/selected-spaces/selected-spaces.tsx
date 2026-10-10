"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, motionEasings, ScrollTrigger } from "@/lib/gsap";
import { getHeaderLine, setHeaderTone } from "@/lib/header-tone";

import { ArriveChapter } from "./arrive-chapter";
import { DetailsChapter } from "./details-chapter";
import { LiveChapter } from "./live-chapter";
import { OutsideInsideTransition } from "./outside-inside-transition";
import { SpacesIntro } from "./spaces-intro";
import { WorkChapter } from "./work-chapter";

export function SelectedSpaces() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const syncHeaderTone = () => {
        const work = root.querySelector<HTMLElement>(".work-chapter");
        if (!work) return;
        const workBounds = work.getBoundingClientRect();
        const headerLine = getHeaderLine();
        setHeaderTone(workBounds.top <= headerLine && workBounds.bottom > headerLine ? "ivory" : "ink");
      };

      ScrollTrigger.create({
        trigger: root,
        start: () => `top ${getHeaderLine()}px`,
        end: () => `bottom ${getHeaderLine()}px`,
        onEnter: syncHeaderTone,
        onEnterBack: syncHeaderTone,
        onUpdate: syncHeaderTone,
        onRefresh: (self) => {
          if (self.isActive) syncHeaderTone();
        },
        onLeave: () => setHeaderTone("ink"),
        onLeaveBack: () => setHeaderTone("ivory"),
      });

      if (reducedMotion) return;

      gsap.fromTo(
        ".spaces-intro .spaces-line-mask > span",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.05,
          stagger: 0.11,
          ease: motionEasings.cinematic,
          scrollTrigger: { trigger: ".spaces-intro", start: "top 68%", once: true },
        },
      );

      gsap.fromTo(
        ".spaces-intro [data-spaces-reveal]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: motionEasings.enter,
          scrollTrigger: { trigger: ".spaces-intro", start: "top 70%", once: true },
        },
      );

      root.querySelectorAll<HTMLElement>("[data-image-reveal]").forEach((figure) => {
        const direction = figure.dataset.imageReveal;
        if (direction === "open") return;
        const from = direction === "horizontal" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)";
        gsap.fromTo(
          figure.querySelector(".spaces-image-frame"),
          { clipPath: from },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.15,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: figure, start: "top 84%", once: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-chapter-copy]").forEach((copy) => {
        gsap.fromTo(
          copy.children,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: motionEasings.enter,
            scrollTrigger: { trigger: copy, start: "top 78%", once: true },
          },
        );
      });

      gsap.fromTo(
        ".spaces-giant-type",
        { xPercent: -4 },
        {
          xPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: ".arrive-chapter", start: "top bottom", end: "bottom top", scrub: 0.5 },
        },
      );

      gsap.fromTo(
        ".live-full-bleed .spaces-image-media",
        { scale: 1.06 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".spaces-full-bleed", start: "top bottom", end: "bottom top", scrub: 0.45 },
        },
      );

      gsap.fromTo(
        ".spaces-outro .spaces-line-mask > span",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.1,
          ease: motionEasings.cinematic,
          scrollTrigger: { trigger: ".spaces-outro", start: "top 68%", once: true },
        },
      );

      gsap.fromTo(
        ".spaces-outro [data-spaces-reveal]",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: motionEasings.enter,
          scrollTrigger: { trigger: ".spaces-outro", start: "top 68%", once: true },
        },
      );

      media.add("(min-width: 48rem)", () => {
        root.querySelectorAll<HTMLElement>(".spaces-image[data-depth]").forEach((figure) => {
          const image = figure.querySelector<HTMLElement>(".spaces-image-media");
          if (!image || figure.classList.contains("live-full-bleed")) return;
          const amount = figure.dataset.depth === "foreground" ? 7 : figure.dataset.depth === "background" ? 3 : 5;
          gsap.fromTo(
            image,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: 0.45 },
            },
          );
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: ".outside-inside",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.45,
          },
        })
          .fromTo(".crossing-exterior", { yPercent: 0, scale: 1 }, { yPercent: -8, scale: 0.94, ease: "none" }, 0)
          .fromTo(".crossing-interior", { yPercent: 18, scale: 1.05 }, { yPercent: 0, scale: 1, ease: "none" }, 0)
          .fromTo(".outside-inside-title .spaces-line-mask > span", { yPercent: 110 }, { yPercent: 0, stagger: 0.08, ease: "none" }, 0.22);
      });

      media.add("(max-width: 47.999rem)", () => {
        root.querySelectorAll<HTMLElement>(".spaces-image[data-depth]").forEach((figure) => {
          const image = figure.querySelector<HTMLElement>(".spaces-image-media");
          if (!image || figure.classList.contains("live-full-bleed")) return;
          gsap.fromTo(
            image,
            { yPercent: -2 },
            {
              yPercent: 2,
              ease: "none",
              scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: 0.5 },
            },
          );
        });

        gsap.fromTo(
          ".crossing-interior",
          { yPercent: 12 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: ".outside-inside", start: "top 70%", end: "bottom bottom", scrub: 0.45 },
          },
        );
      });

    }, root);

    return () => {
      media.revert();
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="selected-spaces"
      className={`selected-spaces${reducedMotion ? " is-reduced" : ""}`}
      aria-labelledby="selected-spaces-title"
    >
      <SpacesIntro />
      <ArriveChapter />
      <OutsideInsideTransition />
      <LiveChapter />
      <WorkChapter />
      <DetailsChapter />

      <div className="spaces-outro">
        <div className="spaces-outro-edge" aria-hidden="true" />
        <p data-spaces-reveal>Next / Selected properties</p>
        <h2>
          <span className="spaces-line-mask"><span>Ready to see</span></span>
          <span className="spaces-line-mask"><span>what&apos;s available?</span></span>
        </h2>
        <span data-spaces-reveal>Explore selected opportunities across residential, commercial and land.</span>
        <Link href="#selected-properties" className="spaces-cta" data-spaces-reveal>
          Explore properties <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
