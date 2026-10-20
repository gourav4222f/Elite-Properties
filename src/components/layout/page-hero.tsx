"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getScrub, gsap } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { animateImage } from "@/lib/image-motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  titleLines: readonly string[];
  /** Lines (by index) pushed toward the centre of the grid. */
  offset?: readonly number[];
  intro: string;
  image: {
    src: string;
    alt: string;
    position?: string;
  };
  /** Extra content beneath the introduction, such as key figures or quick links. */
  children?: ReactNode;
}

/**
 * The opening band of every inner page. The entrance runs in CSS so it plays on first
 * paint without waiting for hydration; scroll-linked drift is layered on with GSAP.
 */
export function PageHero({ eyebrow, titleLines, offset = [], intro, image, children }: PageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(root);
      if (reducedMotion) return;

      const frame = root.querySelector<HTMLElement>("[data-hero-frame]");
      if (frame) animateImage(frame, { reveal: "none", parallax: 7 });

      // The heading eases away a little slower than the page, opening depth over the photograph.
      gsap.to(".page-hero-head", {
        yPercent: -14,
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom 40%", scrub: getScrub() },
      });
    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="page-hero" aria-labelledby="page-title">
      <div className="page-hero-head">
        <div className="section-rule page-hero-fade">
          <span>{eyebrow}</span>
          <i />
        </div>
        <h1 id="page-title" className="page-hero-title">
          {titleLines.map((line, index) => (
            <span
              className={cn("line-mask", offset.includes(index) && "line-mask-offset")}
              key={line}
              style={{ "--line-index": index } as CSSProperties}
            >
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <div className="page-hero-aside">
          <p className="page-hero-intro page-hero-fade">{intro}</p>
          {children ? <div className="page-hero-extra page-hero-fade">{children}</div> : null}
        </div>
      </div>

      <figure className="page-hero-media" data-hero-frame>
        <div className="page-hero-media-settle">
          <div className="page-hero-media-drift" data-image-media>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              style={image.position ? { objectPosition: image.position } : undefined}
            />
          </div>
        </div>
      </figure>
    </section>
  );
}
