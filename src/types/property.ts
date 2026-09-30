export type PropertyType =
  | "apartment"
  | "villa"
  | "plot"
  | "commercial";

export type PropertyPurpose = "sale" | "rent";
export type PropertyStatus = "available" | "reserved" | "sold" | "upcoming";

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  location: string;
  price: number | null;
  priceLabel: string;
  area: string;
  bedrooms: number | null;
  bathrooms: number | null;
  featured: boolean;
  images: string[];
  description: string;
  amenities: string[];
  status: PropertyStatus;
}

export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface Location {
  id: string;
  name: string;
  district: string;
  state: string;
  description: string;
}
