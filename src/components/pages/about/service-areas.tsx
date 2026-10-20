"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { serviceAreas } from "@/data/about";
import { driveTimes } from "@/data/vrindavan";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/reveal";

export function ServiceAreas() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => revealOnScroll(root), root);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="areas" aria-labelledby="areas-title">
      <div className="section-rule" data-reveal>
        <span>03 / Where we work</span>
        <i />
      </div>
      <h2 id="areas-title" className="areas-title" data-reveal-lines>
        <MaskedLines lines={["Two cities,", "known well."]} offset={[1]} />
      </h2>

      <ul className="areas-list">
        {serviceAreas.map((area) => (
          <li key={area.id} className="area">
            <figure className="area-image" data-image="up" data-parallax="6">
              <Image src={area.image.src} alt={area.image.alt} fill sizes="(max-width: 767px) 100vw, 46vw" />
            </figure>
            <div className="area-copy">
              <span className="area-number" data-reveal>
                {area.number}
              </span>
              <h3 className="area-name" data-reveal>
                {area.name}
              </h3>
              <p data-reveal>{area.description}</p>
              <p className="area-highlights" data-reveal>
                {area.highlights}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="areas-drive">
        <p className="areas-drive-kicker" data-reveal>
          From central Vrindavan, approximately
        </p>
        <ul className="areas-drive-times">
          {driveTimes.map((time) => (
            <li key={time.place} data-reveal>
              <span className="areas-drive-value">
                {time.value}
                <small>{time.unit}</small>
              </span>
              <span className="areas-drive-place">{time.place}</span>
            </li>
          ))}
        </ul>
        <Link className="intent-link" href="/properties" data-reveal>
          <span className="intent-link-swap">
            <span>See properties in both cities</span>
            <span aria-hidden="true">See properties in both cities</span>
          </span>
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
