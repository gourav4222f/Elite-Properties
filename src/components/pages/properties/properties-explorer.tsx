"use client";

import { useState } from "react";

import { SelectedProperties } from "@/components/sections/selected-properties/selected-properties";
import type { ListingFilter } from "@/data/listings";
import { scrollToTarget } from "@/lib/smooth-scroll";

import { CategoryIndex } from "./category-index";

const LISTINGS_ID = "listings";

/** Owns the listings filter so the category panels above can steer the grid below. */
export function PropertiesExplorer({ initialFilter }: { initialFilter: ListingFilter }) {
  const [filter, setFilter] = useState<ListingFilter>(initialFilter);

  const showCategory = (next: ListingFilter) => {
    setFilter(next);
    const listings = document.getElementById(LISTINGS_ID);
    if (listings) scrollToTarget(listings);
  };

  return (
    <>
      <CategoryIndex active={filter} onSelect={showCategory} />
      <SelectedProperties
        id={LISTINGS_ID}
        eyebrow="02 / All listings"
        titleLines={["Available", "right now."]}
        intro="Every property we can currently share publicly, across Vrindavan and Mathura. Filter by category, open any listing for the details, or ask us about a private visit."
        filter={filter}
        onFilterChange={setFilter}
      />
    </>
  );
}
