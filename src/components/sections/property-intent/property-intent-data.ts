export const propertyTypes = [
  "Residential",
  "Commercial",
  "Plot",
  "Land",
  "Agricultural Property",
] as const;

export const propertyLocations = ["Vrindavan", "Mathura"] as const;

export const budgetOptions = [
  { value: "any", label: "Any Budget" },
  { value: "under-50-lakh", label: "Under ₹50 Lakh" },
  { value: "50-lakh-1-crore", label: "₹50 Lakh – ₹1 Crore" },
  { value: "1-crore-2-crore", label: "₹1 Crore – ₹2 Crore" },
  { value: "2-crore-plus", label: "₹2 Crore+" },
] as const;

export const propertyCategories = {
  residential: {
    number: "01",
    label: "Residential",
    headline: ["A place", "to call", "yours."],
    description: "Homes and residential opportunities selected around the way you want to live.",
    image: "/images/properties/luxury-apartment-building-sunset-balconies.png",
    imageAlt: "Contemporary residential building with planted balconies at sunset",
    href: "/properties?category=residential",
    cta: "Explore residential",
    metadata: "Residential / Sale",
  },
  commercial: {
    number: "02",
    label: "Commercial",
    headline: ["Space", "for", "ambition."],
    description: "Commercial spaces for businesses, investment and long-term opportunity.",
    image: "/images/commercial/commercial-complex-evening-view.webp",
    imageAlt: "Contemporary commercial complex photographed at dusk",
    href: "/properties?category=commercial",
    cta: "Explore commercial",
    metadata: "Commercial / Investment",
  },
  land: {
    number: "03",
    label: "Plots & Land",
    headline: ["Space to", "build", "something yours."],
    description: "Explore plots, land and opportunities for what comes next.",
    image: "/images/properties/aerial-view-luxury-residential-building-greenery.jpg",
    imageAlt: "Aerial view across a green development landscape in Vrindavan",
    href: "/properties?category=land",
    cta: "Explore land",
    metadata: "Plots / Land",
  },
  rental: {
    number: "04",
    label: "Rental",
    headline: ["Find", "what fits", "now."],
    description: "Residential and commercial rental options for where life or work takes you next.",
    image: "/images/interiors/living-room-modern-apartment-interior.webp",
    imageAlt: "Quiet modern apartment living room with neutral furnishings",
    href: "/properties?category=rental",
    cta: "Explore rentals",
    metadata: "Rental / Lease",
  },
} as const;
