export interface Principle {
  number: string;
  title: string;
  description: string;
}

export const aboutStatement =
  "The right property begins with the right conversation: about how you live, what you are building, and where you want to be in ten years.";

export const aboutIntroduction =
  "Elite Properties is a Vrindavan-based property partner for buyers, sellers, investors and tenants across Vrindavan and Mathura. We bring local knowledge to every decision, from the first shortlist to long after the keys change hands.";

export const principles: readonly Principle[] = [
  {
    number: "01",
    title: "Local first",
    description:
      "We work where we live. Knowing the streets, the projects and the people behind them changes the advice you get.",
  },
  {
    number: "02",
    title: "Fewer, better options",
    description:
      "Shortlists are built around your priorities, so your time goes to properties genuinely worth seeing.",
  },
  {
    number: "03",
    title: "Straight answers",
    description:
      "Clear guidance on price, paperwork and process, including when a property is not the right fit.",
  },
  {
    number: "04",
    title: "Here after the keys",
    description:
      "Management and support for owners who want to stay connected to their property for the long term.",
  },
] as const;
