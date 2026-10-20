"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { aboutStatement, aboutStory } from "@/data/about";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getScrub, gsap } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/reveal";

const statementWords = aboutStatement.split(" ");

export function AboutStory() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => {
      revealOnScroll(root);

      // The statement reads itself in as it travels up the screen.
      gsap.fromTo(
        ".about-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: ".story-statement", start: "top 78%", end: "bottom 45%", scrub: getScrub() },
        },
      );
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} id="approach" className="story" aria-labelledby="story-title">
      <div className="section-rule" data-reveal>
        <span>01 / Our approach</span>
        <i />
      </div>
      <h2 id="story-title" className="sr-only">
        Our approach
      </h2>
      <p className="story-statement">
        {statementWords.map((word, index) => (
          <span className="about-word" key={`${word}-${index}`}>
            {word}{" "}
          </span>
        ))}
      </p>

      <div className="story-body">
        <figure className="story-image story-image-primary" data-image="up" data-parallax="6">
          <Image
            src="/images/interiors/master-bedroom-wardrobe-balcony-view.webp"
            alt="Bedroom opening onto a balcony with soft afternoon light"
            fill
            sizes="(max-width: 767px) 100vw, 42vw"
          />
        </figure>
        <div className="story-copy">
          {aboutStory.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} data-reveal>
              {paragraph}
            </p>
          ))}
        </div>
        <figure className="story-image story-image-secondary" data-image="left" data-parallax="4">
          <Image
            src="/images/interiors/dining-nook-wooden-panel-apartment.webp"
            alt="Dining nook with warm wooden wall panels and a pendant light"
            fill
            sizes="(max-width: 767px) 72vw, 30vw"
          />
        </figure>
      </div>
    </section>
  );
}
