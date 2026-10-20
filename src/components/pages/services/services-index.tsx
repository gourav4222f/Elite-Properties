"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { services, type ServiceOffering } from "@/data/services";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { requestEnquiry } from "@/lib/enquiry";
import { gsap, motionEasings, ScrollTrigger } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/reveal";
import { cn } from "@/lib/utils";

function enquireAbout(service: ServiceOffering) {
  requestEnquiry({ property: service.title, interest: service.interest });
}

export function ServicesIndex() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      // The service crossing the middle of the screen owns the pinned photograph; above the
      // list, the first one does, even after a jump back to the top.
      ScrollTrigger.create({
        trigger: ".services-list",
        start: "top 55%",
        onLeaveBack: () => setActive(0),
      });
      root.querySelectorAll<HTMLElement>("[data-service]").forEach((service, index) => {
        ScrollTrigger.create({
          trigger: service,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });

      if (reducedMotion) return;
      revealOnScroll(root);

      root.querySelectorAll<HTMLElement>("[data-service-rule]").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: rule, start: "top 88%", once: true },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  const current = services[active];

  return (
    <section ref={rootRef} className="services-index" aria-labelledby="services-index-title">
      <header className="services-index-header">
        <div className="section-rule" data-reveal>
          <span>01 / What we do</span>
          <i />
        </div>
        <h2 id="services-index-title" className="services-index-title" data-reveal-lines>
          <MaskedLines lines={["Eight ways", "we can help."]} offset={[1]} />
        </h2>
        <p className="services-index-intro" data-reveal>
          Use one service or all of them. Most clients start with a conversation and let the rest follow from
          what they need.
        </p>
      </header>

      <div className="services-stage">
        <div className="services-visual" aria-hidden="true">
          <div className="services-visual-frame">
            {/* Later photographs sit above earlier ones, so opening or closing one wipes in either direction. */}
            {services.map((service, index) => (
              <div key={service.id} className={cn("services-visual-image", index <= active && "is-shown")}>
                <Image src={service.image.src} alt="" fill sizes="38vw" />
              </div>
            ))}
          </div>
          <div className="services-visual-caption">
            <span>{current.number}</span>
            <span key={current.id} className="services-visual-title">
              {current.title}
            </span>
            <span>{String(services.length).padStart(2, "0")}</span>
          </div>
          <div className="services-visual-progress">
            <span style={{ transform: `scaleX(${(active + 1) / services.length})` }} />
          </div>
        </div>

        <ol className="services-list">
          {services.map((service, index) => (
            <li
              key={service.id}
              id={service.id}
              className={cn("service-item", index === active && "is-active")}
              data-service
            >
              <span className="service-rule" data-service-rule aria-hidden="true" />
              <span className="service-number" data-reveal>
                {service.number}
              </span>
              <h3 className="service-title" data-reveal>
                {service.title}
              </h3>
              <figure className="service-thumb" data-image="up" data-parallax="4">
                <Image src={service.image.src} alt={service.image.alt} fill sizes="(max-width: 767px) 100vw, 60vw" />
              </figure>
              <p className="service-summary" data-reveal>
                {service.summary}
              </p>
              <ul className="service-includes" aria-label={`${service.title} includes`} data-reveal>
                {service.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="intent-link service-link" href="#contact" onClick={() => enquireAbout(service)} data-reveal>
                <span className="intent-link-swap">
                  <span>Talk to us about this</span>
                  <span aria-hidden="true">Talk to us about this</span>
                </span>
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
