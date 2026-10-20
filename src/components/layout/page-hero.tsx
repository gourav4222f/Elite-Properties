"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getScrub, gsap } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { animateImage } from "@/lib/image-motion";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

export interface PageHeroAction {
  label: string;
  href: string;
  variant?: "solid" | "glass";
  onClick?: () => void;
}

interface PageHeroProps {
  /** Sits on the rule beneath the header, left. */
  eyebrow: ReactNode;
  /** Sits on the rule beneath the header, right, e.g. "02 / 04". */
  counter?: string;
  /** A short line above the title. */
  kicker: ReactNode;
  titleLines: readonly string[];
  intro: string;
  actions?: readonly PageHeroAction[];
  /** Label of the floating pill that carries visitors on to the first section. */
  dockLabel?: string;
  image: {
    src: string;
    alt: string;
    position?: string;
  };
}

/**
 * The opening screen of every inner page: a full-bleed photograph with the title anchored
 * bottom-left and the introduction and actions bottom-right. The entrance runs in CSS so it
 * plays on first paint without waiting for hydration; scroll-linked drift is layered on with GSAP.
 */
export function PageHero({
  eyebrow,
  counter,
  kicker,
  titleLines,
  intro,
  actions = [],
  dockLabel = "Scroll to explore",
  image,
}: PageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(root);
      if (reducedMotion) return;

      const frame = root.querySelector<HTMLElement>("[data-hero-frame]");
      if (frame) animateImage(frame, { reveal: "none", parallax: 8 });

      // The copy eases away a little faster than the page, so the photograph is left behind last.
      gsap.to(".page-hero-body", {
        yPercent: -10,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom 30%", scrub: getScrub() },
      });
    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  const continueBelow = () => {
    const next = rootRef.current?.nextElementSibling;
    if (next instanceof HTMLElement) scrollToTarget(next);
  };

  return (
    <section ref={rootRef} className="page-hero" aria-labelledby="page-title">
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

      <div className="page-hero-bar page-hero-fade">
        <div className="page-hero-bar-label">{eyebrow}</div>
        {counter ? <span>{counter}</span> : null}
      </div>

      <div className="page-hero-body">
        <div className="page-hero-main">
          <div className="page-hero-kicker page-hero-fade">{kicker}</div>
          <h1 id="page-title" className="page-hero-title">
            {titleLines.map((line, index) => (
              <span className="line-mask" key={line} style={{ "--line-index": index } as CSSProperties}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
        </div>

        <div className="page-hero-side">
          <p className="page-hero-intro page-hero-fade">{intro}</p>
          {actions.length ? (
            <div className="page-hero-actions page-hero-fade">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  className={cn("hero-pill", action.variant === "glass" ? "hero-pill-glass" : "hero-pill-solid")}
                  href={action.href}
                  onClick={action.onClick}
                >
                  {action.label}
                  {action.variant === "glass" ? null : <ArrowRight aria-hidden="true" size={15} strokeWidth={1.5} />}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <button type="button" className="page-hero-dock page-hero-fade" onClick={continueBelow}>
        <span className="page-hero-dock-label">{dockLabel}</span>
        <span className="page-hero-dock-icon" aria-hidden="true">
          <ArrowDown size={16} strokeWidth={1.5} />
        </span>
      </button>
    </section>
  );
}
