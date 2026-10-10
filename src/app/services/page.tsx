import { ArrowDownRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { Faq } from "@/components/page/faq";
import { IntentLink } from "@/components/page/intent-link";
import { NextChapter } from "@/components/page/next-chapter";
import { PageHero } from "@/components/page/page-hero";
import { PageMotion } from "@/components/page/page-motion";
import { SectionHead } from "@/components/page/section-head";
import { serviceFaqs } from "@/data/faqs";
import { propertyJourney } from "@/data/property-journey";
import { services } from "@/data/services";
import { chapters, nextChapter } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Buying and selling, rentals, site visits, loan assistance, documentation coordination and property management in Vrindavan and Mathura.",
};

// Two chapters change the light, so the long page breathes: one dark, one warm.
const bandFor: Record<number, string | undefined> = { 2: "forest", 4: "surface" };

export default function ServicesPage() {
  return (
    <PageMotion>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        title={chapters.services.title}
        offset={[1]}
        intro={
          <p>
            Shortlists, visits, finance, paperwork and management, coordinated by one local team, so you never
            have to piece it together yourself.
          </p>
        }
        meta={["Six services", "Buyers · Sellers · Tenants · Owners", "Vrindavan · Mathura"]}
        image={{ ...chapters.services.image, position: "center 70%" }}
      />

      <section className="pg-section service-overview" aria-labelledby="service-overview-title">
        <SectionHead id="service-overview-title" label="01 / What we do" title={["Six ways", "we help."]} offset={[1]} />
        <ol className="service-rows">
          {services.map((service) => (
            <li key={service.id}>
              <a className="service-row" href={`#${service.id}`}>
                <span className="pg-rule" data-rule aria-hidden="true" />
                <span className="service-row-number">{service.number}</span>
                <span className="service-row-label" data-reveal>
                  {service.label}
                </span>
                <span className="service-row-summary" data-reveal>
                  {service.summary}
                </span>
                <ArrowDownRight className="service-row-arrow" aria-hidden="true" size={22} strokeWidth={1.25} />
              </a>
            </li>
          ))}
        </ol>
      </section>

      {services.map((service, index) => {
        const band = bandFor[index];
        return (
          <section
            key={service.id}
            id={service.id}
            tabIndex={-1}
            className={cn(
              "pg-section service",
              index % 2 ? "service--reverse" : undefined,
              band ? `pg-band pg-band--${band}` : undefined,
            )}
            data-header-ivory={band === "forest" ? "" : undefined}
            aria-labelledby={`${service.id}-title`}
          >
            <span className="service-numeral" aria-hidden="true" data-drift="4">
              {service.number}
            </span>
            <figure className="pg-image service-image" data-image={index % 2 ? "left" : "up"} data-parallax="6">
              <Image src={service.image.src} alt={service.image.alt} fill sizes="(max-width: 767px) 100vw, 46vw" />
            </figure>
            <div className="service-copy">
              <div className="section-rule" data-reveal>
                <span>
                  {service.number} / {service.label}
                </span>
                <i />
              </div>
              <h2 id={`${service.id}-title`} className="service-title" data-reveal-lines>
                {service.title.map((line) => (
                  <span className="line-mask" key={line}>
                    <span>{line}</span>
                  </span>
                ))}
              </h2>
              <p className="service-summary" data-reveal>
                {service.summary}
              </p>
              <div className="service-includes" data-reveal>
                <h3 className="pg-kicker">What it includes</h3>
                <ul className="pg-list">
                  {service.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="pg-actions" data-reveal>
                <IntentLink href="/contact" label="Talk to us about this" ariaLabel={`Talk to us about ${service.label.toLowerCase()}`} />
              </div>
            </div>
          </section>
        );
      })}

      <section className="pg-section pg-band pg-band--ink process" data-header-ivory aria-labelledby="process-title">
        <SectionHead
          id="process-title"
          label="02 / How it fits together"
          title={["One journey,", "one team."]}
          offset={[1]}
          intro={
            <p>
              Most journeys follow the same path. You can join it at any point, and we coordinate whatever comes
              next.
            </p>
          }
        />
        <ol className="process-grid">
          {propertyJourney.map((stage) => (
            <li className="process-stage" key={stage.id}>
              <span className="pg-rule" data-rule aria-hidden="true" />
              <span className="process-number" data-reveal>
                {stage.number}
              </span>
              <h3 className="process-label" data-reveal>
                {stage.label}
              </h3>
              <p className="process-copy" data-reveal>
                {stage.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pg-section questions" aria-labelledby="questions-title">
        <div className="pg-sticky-grid">
          <div className="pg-sticky">
            <SectionHead
              id="questions-title"
              label="03 / Questions"
              title={["Good questions", "to ask."]}
              intro={<p>If yours is not here, ask us directly. There is no obligation in a conversation.</p>}
            />
            <div className="pg-actions" data-reveal>
              <IntentLink href="/contact" label="Ask us anything" />
            </div>
          </div>
          <Faq items={serviceFaqs} />
        </div>
      </section>

      <NextChapter chapter={nextChapter("services")} />
    </PageMotion>
  );
}
