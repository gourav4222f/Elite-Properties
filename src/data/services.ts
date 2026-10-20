import type { EnquiryInterest } from "@/data/contact";

export interface ServiceOffering {
  id: string;
  number: string;
  title: string;
  summary: string;
  includes: readonly string[];
  interest: EnquiryInterest;
  image: {
    src: string;
    alt: string;
  };
}

export const services: readonly ServiceOffering[] = [
  {
    id: "buying",
    number: "01",
    title: "Buying a home",
    summary:
      "Apartments, villas and independent homes shortlisted around how you live, what you need nearby and what you want to spend.",
    includes: ["Requirement brief", "Curated shortlist", "Accompanied site visits", "Price and negotiation guidance"],
    interest: "Buying a property",
    image: {
      src: "/images/interiors/bedroom-chandelier-luxury-interior.webp",
      alt: "Calm bedroom with a sculptural chandelier and warm wall panels",
    },
  },
  {
    id: "selling",
    number: "02",
    title: "Selling & letting",
    summary:
      "Realistic pricing, careful presentation and qualified viewings, so your property reaches buyers and tenants who are ready to move.",
    includes: ["Pricing advice", "Listing preparation", "Qualified viewings", "Offer and agreement support"],
    interest: "Selling or letting",
    image: {
      src: "/images/properties/luxury-apartment-building-sunset-balconies.png",
      alt: "Apartment building with planted balconies at sunset",
    },
  },
  {
    id: "rentals",
    number: "03",
    title: "Rentals & leasing",
    summary:
      "Furnished and unfurnished homes, and commercial space on lease, matched to your timing and the way you plan to use it.",
    includes: ["Residential rentals", "Commercial leases", "Viewing coordination", "Agreement support"],
    interest: "Renting a property",
    image: {
      src: "/images/interiors/open-kitchen-dining-area-apartment.webp",
      alt: "Open kitchen and dining area in a modern apartment",
    },
  },
  {
    id: "commercial",
    number: "04",
    title: "Commercial property",
    summary:
      "Offices, showrooms, clinics and retail frontage along the corridors where Vrindavan and Mathura are growing.",
    includes: ["Frontage and footfall review", "Office and showroom options", "Purchase or lease", "Fit-out coordination"],
    interest: "Buying a property",
    image: {
      src: "/images/commercial/modern-office-building-dusk-facade.webp",
      alt: "Contemporary office building facade lit at dusk",
    },
  },
  {
    id: "land",
    number: "05",
    title: "Plots & land",
    summary:
      "Residential plots in gated communities and larger land parcels, with the groundwork checked before you commit.",
    includes: ["Residential plots", "Gated communities", "Land parcels", "Title and approval checks"],
    interest: "Buying a property",
    image: {
      src: "/images/properties/aerial-view-luxury-residential-building-greenery.jpg",
      alt: "Aerial view of a residential building surrounded by greenery",
    },
  },
  {
    id: "investment",
    number: "06",
    title: "Investment advice",
    summary:
      "A local view on where demand is heading, which projects hold their value and how a purchase fits your wider plans.",
    includes: ["Market and micro-location view", "Rental yield outlook", "Project comparison", "Exit considerations"],
    interest: "Investment advice",
    image: {
      src: "/images/commercial/commercial-building-white-facade-corner.webp",
      alt: "White sculpted commercial building on a street corner",
    },
  },
  {
    id: "finance",
    number: "07",
    title: "Finance & documentation",
    summary:
      "Loan assistance and coordination of the documentation and legal steps that move a decision through to ownership.",
    includes: ["Loan assistance", "Document checklist", "Legal-assistance coordination", "Registration support"],
    interest: "Buying a property",
    image: {
      src: "/images/commercial/commercial-lobby-marble-floor-glass-wall.webp",
      alt: "Sunlit lobby with marble floors and tall glass walls",
    },
  },
  {
    id: "management",
    number: "08",
    title: "Property management",
    summary:
      "For owners who live elsewhere: tenants, upkeep and the day-to-day handled, so your property stays cared for.",
    includes: ["Tenant finding", "Rent and upkeep follow-up", "Periodic inspections", "Owner updates"],
    interest: "Property management",
    image: {
      src: "/images/interiors/entrance-foyer-wardrobe-unit.webp",
      alt: "Apartment entrance foyer with a lit built-in wardrobe",
    },
  },
] as const;
