"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { PageHero } from "@/components/layout/page-hero";
import { enquireAbout, ListingCard, propertyFacts } from "@/components/sections/selected-properties/listing-card";
import { listings, propertyStatusLabels, propertyTypeLabels } from "@/data/listings";
import { propertyJourney } from "@/data/property-journey";
import { propertiesHref } from "@/data/navigation";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useViewCursor } from "@/hooks/use-view-cursor";
import { gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { animateImage } from "@/lib/image-motion";
import { revealOnScroll } from "@/lib/reveal";
import type { Property } from "@/types/property";

const supportStages = propertyJourney.filter((stage) =>
  (["visit", "finance", "documentation", "manage"] as const).some((id) => id === stage.id),
);

/** Splits a title into two balanced lines for the masked reveal. */
function titleLines(title: string) {
  const words = title.split(" ");
  if (words.length < 2) return [title];
  const split = Math.ceil(words.length / 2);
  return [words.slice(0, split).join(" "), words.slice(split).join(" ")];
}

function propertyFactList(property: Property) {
  return [
    { label: "Type", value: propertyTypeLabels[property.type] },
    { label: "Purpose", value: property.purpose === "rent" ? "For rent" : "For sale" },
    { label: "Area", value: property.area },
    property.bedrooms ? { label: "Bedrooms", value: `${property.bedrooms} BHK` } : null,
    property.bathrooms ? { label: "Bathrooms", value: String(property.bathrooms) } : null,
    { label: "Status", value: propertyStatusLabels[property.status] },
  ].filter((fact): fact is { label: string; value: string } => fact !== null);
}

interface PropertyDetailProps {
  property: Property;
  related: readonly Property[];
}

export function PropertyDetail({ property, related }: PropertyDetailProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const position = listings.findIndex((item) => item.id === property.id);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(".property-support");
      if (reducedMotion) return;

      revealOnScroll(body);

      body.querySelectorAll<HTMLElement>("[data-rule]").forEach((rule, index) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            delay: (index % 4) * 0.08,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: rule, start: "top 90%", once: true },
          },
        );
      });

      body.querySelectorAll<HTMLElement>("[data-listing-frame]").forEach((listingFrame) => {
        animateImage(listingFrame, { reveal: "up", parallax: 4 });
      });
    });

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  useViewCursor(relatedRef, cursorRef, !reducedMotion);

  return (
    <>
      <PageHero
        eyebrow={
          <Link className="property-back" href={propertiesHref("all")}>
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={1.5} />
            All properties
          </Link>
        }
        counter={`Listing ${String(position + 1).padStart(2, "0")} / ${String(listings.length).padStart(2, "0")}`}
        kicker={
          <span className="property-hero-meta">
            <span className="listing-status" data-status={property.status}>
              {propertyStatusLabels[property.status]}
            </span>
            {property.location}
          </span>
        }
        titleLines={titleLines(property.title)}
        intro={`${propertyFacts(property).slice(1).join(" · ")} · ${property.priceLabel}. Floor plans, pricing and private visits on request.`}
        actions={[
          { label: "Arrange a visit", href: "#contact", onClick: () => enquireAbout(property) },
          { label: "Overview", href: "#overview", variant: "glass" },
        ]}
        dockLabel="Property details"
        image={{ src: property.images[0], alt: property.description }}
      />

      <div ref={bodyRef}>
        <section id="overview" className="property-overview" aria-labelledby="property-overview-title">
          <div className="section-rule" data-reveal>
            <span>01 / Overview</span>
            <i />
          </div>
          <h2 id="property-overview-title" className="sr-only">
            Overview
          </h2>

          <dl className="property-facts">
            {propertyFactList(property).map((fact) => (
              <div key={fact.label} className="property-fact">
                <span className="property-fact-rule" data-rule aria-hidden="true" />
                <dt data-reveal>{fact.label}</dt>
                <dd data-reveal>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="property-overview-body">
            <p className="property-lead" data-reveal>
              {property.description}
            </p>
            <div className="property-highlights">
              <h3 className="property-highlights-title" data-reveal>
                Highlights
              </h3>
              <ul>
                {property.amenities.map((amenity, index) => (
                  <li key={amenity} data-reveal>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {amenity}
                  </li>
                ))}
              </ul>
              <p className="property-note" data-reveal>
                Pricing, availability and floor plans are shared on request. Details may change; please confirm
                before relying on them.
              </p>
            </div>
          </div>
        </section>

        <section className="property-support" aria-labelledby="property-support-title">
          <div className="section-rule" data-reveal>
            <span>02 / How we help</span>
            <i />
          </div>
          <h2 id="property-support-title" className="property-support-title" data-reveal-lines>
            <MaskedLines lines={["From first visit", "to the keys."]} offset={[1]} />
          </h2>
          <ol className="about-principles" aria-label="How we help with this property">
            {supportStages.map((stage, index) => (
              <li className="about-principle" key={stage.id}>
                <span className="about-principle-rule" data-rule aria-hidden="true" />
                <span className="about-principle-number" data-reveal>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 data-reveal>{stage.serviceLabel ?? stage.label}</h3>
                <p data-reveal>{stage.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {related.length > 0 ? (
          <section ref={relatedRef} className="related-properties" aria-labelledby="related-title">
            <div className="related-header">
              <div className="section-rule" data-reveal>
                <span>03 / More properties</span>
                <i />
              </div>
              <h2 id="related-title" className="related-title" data-reveal-lines>
                <MaskedLines lines={["You may also", "consider."]} offset={[1]} />
              </h2>
            </div>
            <ul className="related-grid">
              {related.map((item) => (
                <ListingCard
                  key={item.id}
                  property={item}
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                />
              ))}
            </ul>
            <div ref={cursorRef} className="view-cursor" aria-hidden="true">
              View <ArrowUpRight size={12} strokeWidth={1.5} />
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
