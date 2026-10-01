export type JourneyStageId =
  | "discover"
  | "shortlist"
  | "visit"
  | "finance"
  | "documentation"
  | "manage";

export interface JourneyStageData {
  id: JourneyStageId;
  number: string;
  label: string;
  serviceLabel?: string;
  headline: readonly string[];
  secondaryHeadline?: string;
  description: string;
  metadata?: readonly string[];
}

export const propertyJourney: readonly JourneyStageData[] = [
  {
    id: "discover",
    number: "01",
    label: "Discover",
    headline: ["Tell us what", "you're looking for."],
    description:
      "Start with your priorities: property type, location, budget and how you plan to use the space.",
    metadata: ["Residential", "Commercial", "Plots & Land", "Rental"],
  },
  {
    id: "shortlist",
    number: "02",
    label: "Shortlist",
    headline: ["Less searching.", "Better options."],
    description:
      "Suitable options can be narrowed around your priorities so you can focus on properties worth considering.",
  },
  {
    id: "visit",
    number: "03",
    label: "Visit",
    headline: ["See it", "for yourself."],
    description:
      "Coordinate property visits and experience suitable options on the ground before making your decision.",
  },
  {
    id: "finance",
    number: "04",
    label: "Finance",
    serviceLabel: "Loan assistance",
    headline: ["Make the numbers", "work too."],
    description:
      "Where required, Elite Properties can assist with navigating the property finance process and connecting the relevant steps.",
  },
  {
    id: "documentation",
    number: "05",
    label: "Documentation",
    serviceLabel: "Documentation & legal-assistance coordination",
    headline: ["From interest", "to ownership."],
    description:
      "Get support coordinating the documentation and transaction-related steps that come with moving a property decision forward.",
  },
  {
    id: "manage",
    number: "06",
    label: "Manage",
    serviceLabel: "Property management",
    headline: ["And after", "the keys?"],
    secondaryHeadline: "We're still here.",
    description:
      "Property management support can help owners stay connected with their property beyond the transaction.",
  },
] as const;
