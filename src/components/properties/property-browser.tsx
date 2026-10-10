"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

import { ListingCard } from "@/components/properties/listing-card";
import { budgetOptions } from "@/components/sections/property-intent/property-intent-data";
import { listingFilters, listings, matchesFilter, type ListingFilter } from "@/data/listings";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useViewCursor } from "@/hooks/use-view-cursor";
import { gsap, motionEasings, ScrollTrigger } from "@/lib/gsap";
import { animateImage } from "@/lib/image-motion";
import { revealOnScroll } from "@/lib/reveal";
import type { Property } from "@/types/property";

type LocationFilter = "all" | "vrindavan" | "mathura";

const locationFilters: readonly { id: LocationFilter; label: string }[] = [
  { id: "all", label: "Everywhere" },
  { id: "vrindavan", label: "Vrindavan" },
  { id: "mathura", label: "Mathura" },
];

function readCategory(value: string | null): ListingFilter {
  return listingFilters.find((option) => option.id === value)?.id ?? "all";
}

function readLocation(value: string | null): LocationFilter {
  return locationFilters.find((option) => option.id === value)?.id ?? "all";
}

// The Mathura–Vrindavan Road serves both cities, so it answers to either.
function matchesLocation(property: Property, location: LocationFilter) {
  return location === "all" || property.location.toLowerCase().includes(location);
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The full collection, filtered by category and city. Filters live in the address bar, so the
 * homepage finder, footer links and shared URLs all open the same view.
 */
export function PropertyBrowser() {
  const params = useSearchParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const firstPassRef = useRef(true);
  const reducedMotion = usePrefersReducedMotion();

  const category = readCategory(params.get("category"));
  const location = readLocation(params.get("location"));
  const budget = budgetOptions.find((option) => option.value !== "any" && option.value === params.get("budget"));
  const visible = listings.filter((property) => matchesFilter(property, category) && matchesLocation(property, location));
  const viewKey = `${category}:${location}`;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const context = gsap.context(() => revealOnScroll(root), root);
    return () => context.revert();
  }, [reducedMotion]);

  // As on the homepage: the first pass reveals cards on scroll, later passes settle them in place.
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
        grid.querySelectorAll("[data-listing-card], [data-listings-empty]"),
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: motionEasings.enter, clearProps: "transform" },
      );
    }, grid);

    if (!firstPass) ScrollTrigger.refresh();
    return () => context.revert();
  }, [viewKey, reducedMotion]);

  useViewCursor(rootRef, cursorRef, !reducedMotion);

  const update = (changes: Record<string, string | null>) => {
    const query = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (!value || value === "all") query.delete(key);
      else query.set(key, value);
    });
    const search = query.toString();
    const apply = () => {
      window.history.replaceState(null, "", `/properties${search ? `?${search}` : ""}`);
      if (reducedMotion) requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    // Only a change to the visible set plays the exit; clearing the budget note does not.
    const nextKey = `${readCategory(query.get("category"))}:${readLocation(query.get("location"))}`;
    const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-listing-card], [data-listings-empty]");
    if (reducedMotion || nextKey === viewKey || !cards?.length) {
      apply();
      return;
    }
    gsap.to(cards, {
      autoAlpha: 0,
      y: -14,
      duration: 0.26,
      stagger: 0.03,
      ease: motionEasings.exit,
      overwrite: true,
      onComplete: apply,
    });
  };

  return (
    <div ref={rootRef} className="browser" data-motion-owner>
      <div className="browser-toolbar" data-reveal>
        <div className="listings-filter" role="group" aria-label="Filter properties by category">
          {listingFilters.map((option) => {
            const count = listings.filter(
              (property) => matchesFilter(property, option.id) && matchesLocation(property, location),
            ).length;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={category === option.id}
                className={category === option.id ? "is-active" : undefined}
                onClick={() => option.id !== category && update({ category: option.id })}
              >
                {option.label}
                <sup>{pad(count)}</sup>
              </button>
            );
          })}
        </div>
        <div className="browser-places" role="group" aria-label="Filter properties by city">
          {locationFilters.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={location === option.id}
              className={location === option.id ? "is-active" : undefined}
              onClick={() => option.id !== location && update({ location: option.id })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="browser-status" data-reveal>
        <p className="listings-count" aria-live="polite">
          Showing {pad(visible.length)} of {pad(listings.length)}
        </p>
        {budget ? (
          <p className="browser-budget">
            <span>Budget</span>
            <strong>{budget.label}</strong>
            <button type="button" onClick={() => update({ budget: null })} aria-label="Clear budget">
              <X aria-hidden="true" size={13} strokeWidth={1.5} />
            </button>
            <em>Prices are shared on request. Mention your budget when you enquire and we will match to it.</em>
          </p>
        ) : null}
      </div>

      <ul ref={gridRef} className="listings-grid browser-grid">
        {visible.length ? (
          visible.map((property, index) => <ListingCard key={property.id} property={property} index={index} />)
        ) : (
          <li className="browser-empty" data-listings-empty>
            <p className="browser-empty-title">Nothing listed here just now.</p>
            <p>
              Not every opportunity is advertised. Tell us what you are looking for and we will look on your
              behalf.
            </p>
            <div className="pg-actions">
              <button type="button" className="intent-link" onClick={() => update({ category: null, location: null })}>
                <span className="intent-link-swap">
                  <span>Show everything</span>
                  <span aria-hidden="true">Show everything</span>
                </span>
              </button>
              <Link className="intent-link" href="/contact">
                <span className="intent-link-swap">
                  <span>Share your requirements</span>
                  <span aria-hidden="true">Share your requirements</span>
                </span>
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </li>
        )}
      </ul>

      <div ref={cursorRef} className="view-cursor" aria-hidden="true">
        View <ArrowUpRight size={12} strokeWidth={1.5} />
      </div>
    </div>
  );
}

/** Shown while the browser reads the address bar: the whole collection, without motion. */
export function PropertyBrowserFallback() {
  return (
    <div className="browser">
      <ul className="listings-grid browser-grid">
        {listings.map((property, index) => (
          <ListingCard key={property.id} property={property} index={index} />
        ))}
      </ul>
    </div>
  );
}
