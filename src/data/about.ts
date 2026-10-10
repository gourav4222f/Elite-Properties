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

export const aboutPhilosophy = {
  lead: "Finding property in Vrindavan shouldn't mean piecing together advice from too many places.",
  paragraphs: [
    "Buyers end up juggling brokers, builders, banks and paperwork, often from another city. Owners want someone they can trust with a property they rarely see. And the best opportunities are rarely the ones advertised the loudest.",
    "Elite Properties works as one local partner instead: people who know the ground, ask the right questions, and stay with you from the first conversation to long after the keys change hands.",
  ],
} as const;

export interface Expectation {
  number: string;
  title: string;
  description: string;
}

export const workingWithUs: readonly Expectation[] = [
  {
    number: "01",
    title: "A first conversation",
    description:
      "We start by listening: what you need, how you will use the space, your timeline and your budget. There is no pressure and no obligation.",
  },
  {
    number: "02",
    title: "A considered shortlist",
    description:
      "A small number of options genuinely worth your time, each with honest notes, rather than a long list to sort through on your own.",
  },
  {
    number: "03",
    title: "Visits on your schedule",
    description:
      "Viewings are planned around you, including for buyers travelling in from Delhi NCR and further afield.",
  },
  {
    number: "04",
    title: "Through to the keys",
    description:
      "Finance, documentation and handover steps are coordinated with you, and management support is there afterwards.",
  },
] as const;

export const coverage = {
  types: ["Apartments & villas", "Plots & land", "Commercial spaces", "Residential & commercial rentals"],
  areas: ["Central Vrindavan", "Raman Reti", "Chhatikara Road", "Mathura–Vrindavan Road", "Mathura"],
} as const;
