"use client";

import { useEffect, useRef } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { propertyJourney } from "@/data/property-journey";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getScrub, gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { revealOnScroll } from "@/lib/reveal";

export function ServicesProcess() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(root);
      if (reducedMotion) return;

      revealOnScroll(root);

      // The route line fills as the section passes, checkpoint by checkpoint.
      gsap.fromTo(
        ".process-route > span",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".process-steps", start: "top 85%", end: "bottom 60%", scrub: getScrub() },
        },
      );

      gsap.fromTo(
        ".process-step-dot",
        { scale: 0 },
        {
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: motionEasings.enter,
          scrollTrigger: { trigger: ".process-steps", start: "top 80%", once: true },
        },
      );
    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="process" aria-labelledby="process-title">
      <div className="section-rule" data-reveal>
        <span>02 / How it works</span>
        <i />
      </div>
      <div className="process-head">
        <h2 id="process-title" className="process-title" data-reveal-lines>
          <MaskedLines lines={["From search", "to signature."]} offset={[1]} />
        </h2>
        <p className="process-intro" data-reveal>
          One team from the first conversation to the day you move in, and for as long as you need us after.
        </p>
      </div>

      <div className="process-route" aria-hidden="true">
        <span />
      </div>
      <ol className="process-steps">
        {propertyJourney.map((stage) => (
          <li key={stage.id} className="process-step">
            <span className="process-step-dot" aria-hidden="true" />
            <span className="process-step-number" data-reveal>
              {stage.number}
            </span>
            <h3 data-reveal>{stage.label}</h3>
            {stage.serviceLabel ? (
              <p className="process-step-service" data-reveal>
                {stage.serviceLabel}
              </p>
            ) : null}
            <p className="process-step-description" data-reveal>
              {stage.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
