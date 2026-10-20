"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { contactDetails } from "@/data/contact";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { revealOnScroll } from "@/lib/reveal";

export function ContactVisit() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(root);
      if (!reducedMotion) revealOnScroll(root);
    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <section ref={rootRef} id="visit" className="visit" aria-labelledby="visit-title">
      <figure className="visit-media" data-image="none" data-parallax="10">
        <Image
          src="/images/properties/gated-community-entrance-sunset.png"
          alt="Landscaped residential entrance in warm evening light"
          fill
          sizes="100vw"
        />
      </figure>
      <div className="visit-content">
        <p className="visit-kicker" data-reveal>
          Visit
        </p>
        <h2 id="visit-title" className="visit-title" data-reveal-lines>
          <MaskedLines lines={["See it", "for yourself."]} offset={[1]} />
        </h2>
        <dl className="visit-details">
          <div data-reveal>
            <dt>Office</dt>
            <dd>
              {contactDetails.office.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </dd>
          </div>
          <div data-reveal>
            <dt>Visits</dt>
            <dd>{contactDetails.visits}</dd>
          </div>
          <div data-reveal>
            <dt>Areas</dt>
            <dd>{contactDetails.serviceAreas}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
