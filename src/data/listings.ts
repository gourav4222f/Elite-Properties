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
