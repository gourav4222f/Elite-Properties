"use client";

import { useEffect, useRef } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { principles } from "@/data/about";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { revealOnScroll } from "@/lib/reveal";

export function AboutValues() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(root);
      if (reducedMotion) return;

      revealOnScroll(root);
      root.querySelectorAll<HTMLElement>(".about-principle-rule").forEach((rule, index) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            delay: index * 0.08,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: ".about-principles", start: "top 85%", once: true },
          },
        );
      });
    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="values" aria-labelledby="values-title">
      <div className="section-rule" data-reveal>
        <span>02 / How we work</span>
        <i />
      </div>
      <h2 id="values-title" className="values-title" data-reveal-lines>
        <MaskedLines lines={["Four things", "we hold to."]} offset={[1]} />
      </h2>
      <ol className="about-principles" aria-label="How we work">
        {principles.map((principle) => (
          <li className="about-principle" key={principle.number}>
            <span className="about-principle-rule" aria-hidden="true" />
            <span className="about-principle-number" data-reveal>
              {principle.number}
            </span>
            <h3 data-reveal>{principle.title}</h3>
            <p data-reveal>{principle.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
