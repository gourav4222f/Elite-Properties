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

export const aboutStory: readonly string[] = [
  "Buying, selling or renting in a city like Vrindavan rarely follows a template. Families arrive for the temples and stay for the pace of life; businesses follow the visitors; investors watch the corridor to Mathura grow. Each brings a different set of questions.",
  "We keep our focus deliberately local, so the advice you get is grounded in the streets, the projects and the people behind them. That means fewer options, chosen with more care, and a clear view of the paperwork before anything is signed.",
];

export interface ServiceArea {
  id: string;
  number: string;
  name: string;
  description: string;
  highlights: string;
  image: {
    src: string;
    alt: string;
  };
}

export const serviceAreas: readonly ServiceArea[] = [
  {
    id: "vrindavan",
    number: "01",
    name: "Vrindavan",
    description:
      "Homes, plots and rentals close to the temples and ghats, and newer gated communities along Chhatikara Road.",
    highlights: "Residential · Plots · Rentals",
    image: {
      src: "/images/lifestyle/family-walking-residential-park.png",
      alt: "Family walking together along a tree-lined residential path",
    },
  },
  {
    id: "mathura",
    number: "02",
    name: "Mathura",
    description:
      "City apartments and commercial frontage, connected by Mathura Junction, NH-19 and the Yamuna Expressway.",
    highlights: "Apartments · Commercial · Investment",
    image: {
      src: "/images/infrastructure/city-highway-flyover-night-aerial.jpg",
      alt: "Aerial view of highway interchanges glowing at night",
    },
  },
] as const;
