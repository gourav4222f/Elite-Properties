"use client";

import { ArrowDownRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { propertyCategories } from "@/components/sections/property-intent/property-intent-data";
import { listings, matchesFilter, type ListingFilter } from "@/data/listings";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/reveal";

const categories = (Object.keys(propertyCategories) as (keyof typeof propertyCategories)[]).map((id) => ({
  id: id satisfies ListingFilter,
  ...propertyCategories[id],
  count: listings.filter((property) => matchesFilter(property, id)).length,
}));

interface CategoryIndexProps {
  active: ListingFilter;
  onSelect: (filter: ListingFilter) => void;
}

export function CategoryIndex({ active, onSelect }: CategoryIndexProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => revealOnScroll(root), root);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="category-index" aria-labelledby="category-index-title">
      <header className="category-index-header">
        <div className="section-rule" data-reveal>
          <span>01 / Browse by category</span>
          <i />
        </div>
        <h2 id="category-index-title" className="category-index-title" data-reveal-lines>
          <MaskedLines lines={["Start with", "what you need."]} offset={[1]} />
        </h2>
      </header>

      <ul className="category-panels">
        {categories.map((category) => (
          <li key={category.id} className="category-panel" data-reveal>
            <button
              type="button"
              className="category-panel-button"
              aria-pressed={active === category.id}
              onClick={() => onSelect(category.id)}
            >
              <span className="category-panel-media" data-image="up" data-parallax="5">
                <Image src={category.image} alt="" fill sizes="(max-width: 767px) 100vw, 40vw" />
              </span>
              <span className="category-panel-shade" aria-hidden="true" />
              <span className="category-panel-top">
                <span>{category.number}</span>
                <span>
                  {String(category.count).padStart(2, "0")} {category.count === 1 ? "listing" : "listings"}
                </span>
              </span>
              <span className="category-panel-bottom">
                <span className="category-panel-label">{category.label}</span>
                <span className="category-panel-description">{category.description}</span>
                <span className="category-panel-cta">
                  View listings
                  <ArrowDownRight aria-hidden="true" size={15} strokeWidth={1.5} />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
