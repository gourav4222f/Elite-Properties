import type { Property, PropertyStatus, PropertyType } from "@/types/property";

import properties from "./properties.json";

export const listings = properties as Property[];

export type ListingFilter = "all" | "residential" | "commercial" | "land" | "rental";

export const listingFilters: readonly { id: ListingFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "land", label: "Plots & Land" },
  { id: "rental", label: "Rental" },
];

export function matchesFilter(property: Property, filter: ListingFilter) {
  if (filter === "residential") {
    return property.purpose === "sale" && (property.type === "apartment" || property.type === "villa");
  }
  if (filter === "commercial") return property.type === "commercial";
  if (filter === "land") return property.type === "plot";
  if (filter === "rental") return property.purpose === "rent";
  return true;
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: "Apartment",
  villa: "Villa",
  plot: "Plot",
  commercial: "Commercial",
};

export const propertyStatusLabels: Record<PropertyStatus, string> = {
  available: "Available",
  upcoming: "Coming soon",
  reserved: "Reserved",
  sold: "Sold",
};

export function propertyHref(property: Property) {
  return `/properties/${property.slug}`;
}

/** The short facts shown on a card and in a property's opening. */
export function propertyFacts(property: Property) {
  return [
    `${propertyTypeLabels[property.type]} · ${property.purpose === "rent" ? "For rent" : "For sale"}`,
    property.bedrooms ? `${property.bedrooms} BHK` : null,
    property.area,
  ].filter((fact): fact is string => Boolean(fact));
}

export interface PropertySearch {
  intent?: string;
  type?: string;
  location?: string;
  budget?: string;
}

/** Turns the finder's plain-language choices into the Properties page filters. */
export function propertySearchHref({ intent, type, location, budget }: PropertySearch) {
  const query = new URLSearchParams();
  const kind = (type ?? "").toLowerCase();
  const category =
    intent === "rent"
      ? "rental"
      : kind === "commercial"
        ? "commercial"
        : ["plot", "land", "agricultural property"].includes(kind)
          ? "land"
          : kind === "residential"
            ? "residential"
            : "";
  if (category) query.set("category", category);
  if (location) query.set("location", location.toLowerCase());
  if (budget && budget !== "any") query.set("budget", budget);
  const search = query.toString();
  return `/properties${search ? `?${search}` : ""}`;
}
