"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { ListingFilter } from "@/data/listings";
import { scrollToTarget } from "@/lib/smooth-scroll";

interface CollectionLinkProps {
  category: ListingFilter;
  className?: string;
  children: ReactNode;
}

/**
 * Filters the collection on this page and glides back up to it, rather than reloading the
 * route. Modified clicks still open the filtered page as an ordinary link.
 */
export function CollectionLink({ category, className, children }: CollectionLinkProps) {
  const href = `/properties?category=${category}`;

  return (
    <Link
      className={className}
      href={href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const query = new URLSearchParams(window.location.search);
        query.set("category", category);
        window.history.replaceState(null, "", `/properties?${query}`);
        const collection = document.getElementById("collection");
        if (collection) scrollToTarget(collection);
      }}
    >
      {children}
    </Link>
  );
}
