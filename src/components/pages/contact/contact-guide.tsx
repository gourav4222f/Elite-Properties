"use client";

import { useEffect, useRef } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { contactSteps } from "@/data/contact";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, motionEasings } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/reveal";

export function ContactGuide() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => {
      revealOnScroll(root);
      root.querySelectorAll<HTMLElement>("[data-rule]").forEach((rule, index) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            delay: (index % 3) * 0.08,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: rule, start: "top 90%", once: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="contact-guide" aria-labelledby="contact-guide-title">
      <div className="section-rule" data-reveal>
        <span>02 / What happens next</span>
        <i />
      </div>
      <h2 id="contact-guide-title" className="contact-guide-title" data-reveal-lines>
        <MaskedLines lines={["Three steps", "to your shortlist."]} offset={[1]} />
      </h2>

      <ol className="contact-steps">
        {contactSteps.map((step) => (
          <li key={step.number} className="contact-step">
            <span className="contact-step-rule" data-rule aria-hidden="true" />
            <span className="contact-step-number" data-reveal>
              {step.number}
            </span>
            <h3 data-reveal>{step.title}</h3>
            <p data-reveal>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
