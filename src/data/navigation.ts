import type { ListingFilter } from "@/data/listings";

export interface NavigationLink {
  label: string;
  href: string;
}

export const primaryNavigation: readonly NavigationLink[] = [
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function propertiesHref(filter: ListingFilter) {
  return filter === "all" ? "/properties#listings" : `/properties?category=${filter}#listings`;
}
