"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import {
  listingFilters,
  listings,
  matchesFilter,
  propertyStatusLabels,
  propertyTypeLabels,
  type ListingFilter,
} from "@/data/listings";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useViewCursor } from "@/hooks/use-view-cursor";
import { requestEnquiry } from "@/lib/enquiry";
import { gsap, motionEasings, ScrollTrigger } from "@/lib/gsap";
import { animateImage } from "@/lib/image-motion";
import { revealOnScroll } from "@/lib/reveal";
import type { Property } from "@/types/property";

function enquireAbout(property: Property) {
  requestEnquiry({
    property: property.title,
    interest: property.purpose === "rent" ? "Renting a property" : "Buying a property",
  });
}

function ListingCard({ property, index }: { property: Property; index: number }) {
  const wide = index % 4 === 0 || index % 4 === 3;
  const facts = [
    `${propertyTypeLabels[property.type]} · ${property.purpose === "rent" ? "For rent" : "For sale"}`,
    property.bedrooms ? `${property.bedrooms} BHK` : null,
    property.area,
  ].filter(Boolean);

  return (
    <li className="listing-card" data-listing-card>
      <Link
        className="listing-media"
        href="#contact"
        tabIndex={-1}
        aria-hidden="true"
        data-cursor-view
        onClick={() => enquireAbout(property)}
      >
        <span className="listing-media-frame" data-listing-frame>
          <Image
            src={property.images[0]}
            alt=""
            fill
            sizes={wide ? "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 56vw" : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 34vw"}
          />
        </span>
        <span className="listing-status" data-status={property.status}>
          {propertyStatusLabels[property.status]}
        </span>
      </Link>
      <div className="listing-body">
        <p className="listing-location">{property.location}</p>
        <h3 className="listing-title">{property.title}</h3>
        <p className="listing-description">{property.description}</p>
        <ul className="listing-facts" aria-label="Key facts">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <div className="listing-footer">
          <span className="listing-price">{property.priceLabel}</span>
          <Link
            className="intent-link"
            href="#contact"
            aria-label={`Enquire about ${property.title}`}
            onClick={() => enquireAbout(property)}
          >
            <span className="intent-link-swap">
              <span>Enquire</span>
              <span aria-hidden="true">Enquire</span>
            </span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </li>
  );
}

export function SelectedProperties() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const firstPassRef = useRef(true);
  const reducedMotion = usePrefersReducedMotion();
  const [filter, setFilter] = useState<ListingFilter>("all");
  const visible = listings.filter((property) => matchesFilter(property, filter));

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => revealOnScroll(root), root);
    return () => context.revert();
  }, [reducedMotion]);

  // Card imagery is rebuilt whenever the visible set changes: the first pass reveals on
  // scroll, later passes settle cards in place, and every pass keeps the parallax.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || reducedMotion) return;
    const firstPass = firstPassRef.current;
    firstPassRef.current = false;

    const context = gsap.context(() => {
      grid.querySelectorAll<HTMLElement>("[data-listing-frame]").forEach((frame) => {
        animateImage(frame, { reveal: firstPass ? "up" : "none", parallax: 4 });
      });

      if (firstPass) {
        grid.querySelectorAll<HTMLElement>(".listing-body").forEach((body) => {
          gsap.fromTo(
            body,
            { y: 26, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              delay: 0.2,
              ease: motionEasings.enter,
              scrollTrigger: { trigger: body, start: "top 94%", once: true },
            },
          );
        });
        return;
      }

      gsap.fromTo(
        grid.querySelectorAll("[data-listing-card]"),
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: motionEasings.enter, clearProps: "transform" },
      );
    }, grid);

    // The grid's height changed, so everything below re-measures its trigger positions.
    if (!firstPass) ScrollTrigger.refresh();
    return () => context.revert();
  }, [filter, reducedMotion]);

  useViewCursor(rootRef, cursorRef, !reducedMotion);

  const selectFilter = (next: ListingFilter) => {
    if (next === filter) return;
    const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-listing-card]");

    if (reducedMotion || !cards?.length) {
      setFilter(next);
      if (reducedMotion) requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    gsap.to(cards, {
      autoAlpha: 0,
      y: -14,
      duration: 0.26,
      stagger: 0.03,
      ease: motionEasings.exit,
      overwrite: true,
      onComplete: () => setFilter(next),
    });
  };

  return (
    <section ref={rootRef} id="selected-properties" className="listings" aria-labelledby="listings-title">
      <header className="listings-header">
        <div className="section-rule" data-reveal>
          <span>06 / Selected properties</span>
          <i />
        </div>
        <h2 id="listings-title" className="listings-title" data-reveal-lines>
          <MaskedLines lines={["Places worth", "your attention."]} offset={[1]} />
        </h2>
        <p className="listings-intro" data-reveal>
          A considered selection across Vrindavan and Mathura. Ask us about availability, pricing and
          private visits.
        </p>
        <div className="listings-toolbar" data-reveal>
          <div className="listings-filter" role="group" aria-label="Filter properties by category">
            {listingFilters.map((option) => {
              const count = listings.filter((property) => matchesFilter(property, option.id)).length;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={filter === option.id}
                  className={filter === option.id ? "is-active" : undefined}
                  onClick={() => selectFilter(option.id)}
                >
                  {option.label}
                  <sup>{String(count).padStart(2, "0")}</sup>
                </button>
              );
            })}
          </div>
          <p className="listings-count" aria-live="polite">
            Showing {String(visible.length).padStart(2, "0")} of {String(listings.length).padStart(2, "0")}
          </p>
        </div>
      </header>

      <ul ref={gridRef} className="listings-grid">
        {visible.map((property, index) => (
          <ListingCard key={property.id} property={property} index={index} />
        ))}
      </ul>

      <div className="listings-more" data-reveal>
        <p>Not every opportunity is listed publicly. Tell us what you are looking for.</p>
        <Link className="intent-link" href="#contact">
          <span className="intent-link-swap">
            <span>Share your requirements</span>
            <span aria-hidden="true">Share your requirements</span>
          </span>
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </Link>
      </div>

      <div ref={cursorRef} className="view-cursor" aria-hidden="true">
        Enquire <ArrowUpRight size={12} strokeWidth={1.5} />
      </div>
    </section>
  );
}
