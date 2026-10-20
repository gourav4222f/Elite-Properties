"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { enquireAbout, ListingCard } from "@/components/sections/selected-properties/listing-card";
import { propertyStatusLabels, propertyTypeLabels } from "@/data/listings";
import { propertyJourney } from "@/data/property-journey";
import { propertiesHref } from "@/data/navigation";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useViewCursor } from "@/hooks/use-view-cursor";
import { getScrub, gsap, motionEasings } from "@/lib/gsap";
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
  const heroRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const hero = heroRef.current;
    const body = bodyRef.current;
    if (!hero || !body) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(hero);
      createIvoryHeaderZone(".property-support");
      if (reducedMotion) return;

      const frame = hero.querySelector<HTMLElement>("[data-hero-frame]");
      if (frame) animateImage(frame, { reveal: "none", parallax: 9 });

      gsap.to(".property-hero-content", {
        yPercent: -18,
        autoAlpha: 0.2,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: getScrub() },
      });

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

  const lines = titleLines(property.title);

  return (
    <>
      <section ref={heroRef} className="property-hero" aria-labelledby="page-title">
        <figure className="property-hero-media" data-hero-frame>
          <div className="page-hero-media-settle">
            <div className="page-hero-media-drift" data-image-media>
              <Image src={property.images[0]} alt={property.description} fill priority sizes="100vw" />
            </div>
          </div>
        </figure>

        <div className="property-hero-content">
          <Link className="property-back page-hero-fade" href={propertiesHref("all")}>
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={1.5} />
            All properties
          </Link>

          <div className="property-hero-meta page-hero-fade">
            <span className="listing-status" data-status={property.status}>
              {propertyStatusLabels[property.status]}
            </span>
            <span>{property.location}</span>
          </div>

          <h1 id="page-title" className="property-hero-title">
            {lines.map((line, index) => (
              <span className="line-mask" key={line} style={{ "--line-index": index } as CSSProperties}>
                <span>{line}</span>
              </span>
            ))}
          </h1>

          <div className="property-hero-footer page-hero-fade">
            <span className="property-hero-price">{property.priceLabel}</span>
            <Link className="intent-link" href="#contact" onClick={() => enquireAbout(property)}>
              <span className="intent-link-swap">
                <span>Arrange a visit</span>
                <span aria-hidden="true">Arrange a visit</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      <div ref={bodyRef}>
        <section className="property-overview" aria-labelledby="property-overview-title">
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
