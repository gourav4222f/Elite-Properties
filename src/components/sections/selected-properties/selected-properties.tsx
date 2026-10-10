"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { ListingCard } from "@/components/properties/listing-card";
import {
  listingFilters,
  listings,
  matchesFilter,
  type ListingFilter,
} from "@/data/listings";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useViewCursor } from "@/hooks/use-view-cursor";
import { gsap, motionEasings, ScrollTrigger } from "@/lib/gsap";
import { animateImage } from "@/lib/image-motion";
import { revealOnScroll } from "@/lib/reveal";

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
          <ListingCard key={property.id} property={property} index={index} enquire="inline" />
        ))}
      </ul>

      <div className="listings-more" data-reveal>
        <p>Not every opportunity is listed publicly. Tell us what you are looking for.</p>
        <div className="listings-more-links">
          <Link className="intent-link" href="/properties">
            <span className="intent-link-swap">
              <span>View all properties</span>
              <span aria-hidden="true">View all properties</span>
            </span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </Link>
          <Link className="intent-link" href="#contact">
            <span className="intent-link-swap">
              <span>Share your requirements</span>
              <span aria-hidden="true">Share your requirements</span>
            </span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div ref={cursorRef} className="view-cursor" aria-hidden="true">
        View <ArrowUpRight size={12} strokeWidth={1.5} />
      </div>
    </section>
  );
}
