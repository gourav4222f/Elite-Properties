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
  const changingRef = useRef(false);
  const revealTriggersRef = useRef<ScrollTrigger[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const [filter, setFilter] = useState<ListingFilter>("all");
  const visible = listings.filter((property) => matchesFilter(property, filter));

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => {
      revealOnScroll(root);

      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-listing-card]"));
      gsap.set(root.querySelectorAll("[data-listing-frame]"), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(root.querySelectorAll(".listing-body"), { y: 26, autoAlpha: 0 });

      revealTriggersRef.current = ScrollTrigger.batch(cards, {
        start: "top 86%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((card, index) => {
            gsap.to(card.querySelector("[data-listing-frame]"), {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.2,
              delay: index * 0.12,
              ease: motionEasings.cinematic,
            });
            gsap.to(card.querySelector(".listing-body"), {
              y: 0,
              autoAlpha: 1,
              duration: 0.85,
              delay: 0.25 + index * 0.12,
              ease: motionEasings.enter,
            });
          });
        },
      });
    }, root);

    return () => {
      revealTriggersRef.current = [];
      context.revert();
    };
  }, [reducedMotion]);

  // New cards settle in after a filter change, then trigger positions below are re-measured.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!changingRef.current || !grid) return;
    changingRef.current = false;

    // Every card is now in view by choice, so the first-pass scroll reveals are retired.
    revealTriggersRef.current.forEach((trigger) => trigger.kill());
    revealTriggersRef.current = [];
    gsap.set(grid.querySelectorAll("[data-listing-frame]"), { clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(grid.querySelectorAll(".listing-body"), { autoAlpha: 1, y: 0 });
    gsap.fromTo(
      grid.querySelectorAll("[data-listing-card]"),
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: motionEasings.enter, clearProps: "transform" },
    );
    ScrollTrigger.refresh();
  }, [filter]);

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
      onComplete: () => {
        changingRef.current = true;
        setFilter(next);
      },
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
