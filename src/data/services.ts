export interface ServiceDetail {
  id: string;
  number: string;
  label: string;
  title: readonly string[];
  summary: string;
  includes: readonly string[];
  image: { src: string; alt: string };
}

export const services: readonly ServiceDetail[] = [
  {
    id: "buying-selling",
    number: "01",
    label: "Buying & selling",
    title: ["Buy well.", "Sell right."],
    summary:
      "Advice grounded in the local market, whether you are buying your first home here or selling a property you have held for years.",
    includes: [
      "Requirement and budget planning",
      "Shortlists matched to your priorities",
      "Pricing guidance and negotiation",
      "Listings presented with care for sellers",
    ],
    image: {
      src: "/images/interiors/luxury-living-room-chandelier-curtains.jpg",
      alt: "Generous living room with a chandelier and floor-length curtains",
    },
  },
  {
    id: "rentals",
    number: "02",
    label: "Rentals & leasing",
    title: ["Find what", "fits, for now."],
    summary:
      "Residential and commercial rentals, with expectations and paperwork made clear for tenants and landlords alike.",
    includes: [
      "Tenant and landlord matching",
      "Viewing coordination",
      "Rental agreements coordinated",
      "Move-in and handover checks",
    ],
    image: {
      src: "/images/interiors/bedroom-chandelier-luxury-interior.webp",
      alt: "Calm bedroom with pendant lighting and panelled walls",
    },
  },
  {
    id: "site-visits",
    number: "03",
    label: "Site visits",
    title: ["See it for", "yourself."],
    summary:
      "Visits planned around your schedule, so a weekend trip from the city is spent seeing properties, not chasing appointments.",
    includes: [
      "Visit routes planned in advance",
      "Accompanied viewings",
      "Neighbourhood walk-throughs",
      "Notes and comparisons after each visit",
    ],
    image: {
      src: "/images/interiors/entrance-foyer-wardrobe-unit.webp",
      alt: "Entrance foyer with a built-in wardrobe and warm lighting",
    },
  },
  {
    id: "loan-assistance",
    number: "04",
    label: "Loan assistance",
    title: ["Make the numbers", "work too."],
    summary:
      "Help navigating home-loan and finance steps, and connecting you with the right people at the right time. Approval decisions rest with the lender.",
    includes: [
      "Budget and eligibility conversations",
      "Introductions to lenders",
      "Document checklists",
      "Timelines aligned with the purchase",
    ],
    image: {
      src: "/images/commercial/office-meeting-room-glass-windows.webp",
      alt: "Meeting room with a long table beside tall glass windows",
    },
  },
  {
    id: "documentation",
    number: "05",
    label: "Documentation & legal coordination",
    title: ["From interest", "to ownership."],
    summary:
      "Coordination of the documents, checks and registrations that move a decision forward, working alongside qualified legal professionals.",
    includes: [
      "Document collection and review coordination",
      "Title and approval checks with legal partners",
      "Agreement and registration scheduling",
      "A clear checklist at every stage",
    ],
    image: {
      src: "/images/commercial/reception-lobby-marble-desk.webp",
      alt: "Calm reception lobby with a marble desk and sculptural lighting",
    },
  },
  {
    id: "property-management",
    number: "06",
    label: "Property management",
    title: ["And after", "the keys?"],
    summary:
      "Ongoing support for owners who live elsewhere, or who simply want their property looked after properly.",
    includes: ["Tenant management", "Maintenance coordination", "Periodic property checks", "Rent collection support"],
    image: {
      src: "/images/interiors/master-bedroom-wardrobe-balcony-view.webp",
      alt: "Bedroom with fitted wardrobes opening onto a balcony",
    },
  },
] as const;
