export interface ContactDetails {
  office: readonly string[];
  serviceAreas: string;
  visits: string;
  /** Shown in the contact section and footer once provided, e.g. "+91 …". */
  phone?: string;
  /** Shown in the contact section and footer once provided. */
  email?: string;
}

export const contactDetails: ContactDetails = {
  office: ["Vrindavan", "Mathura, Uttar Pradesh"],
  serviceAreas: "Vrindavan · Mathura",
  visits: "Site visits by appointment",
};

export const enquiryInterests = [
  "Buying a property",
  "Renting a property",
  "Selling or letting",
  "Investment advice",
  "Property management",
] as const;

export type EnquiryInterest = (typeof enquiryInterests)[number];

export interface ContactStep {
  number: string;
  title: string;
  description: string;
}

export const contactSteps: readonly ContactStep[] = [
  {
    number: "01",
    title: "We listen",
    description: "A member of the team calls to understand what you need, where, and by when.",
  },
  {
    number: "02",
    title: "We shortlist",
    description: "You receive a focused set of options, including ones that are not listed publicly.",
  },
  {
    number: "03",
    title: "We visit together",
    description: "Site visits are arranged around your schedule, with someone who knows each property.",
  },
] as const;

export interface FrequentQuestion {
  question: string;
  answer: string;
}

export const frequentQuestions: readonly FrequentQuestion[] = [
  {
    question: "Which areas do you cover?",
    answer:
      "Vrindavan and Mathura, including the Chhatikara Road and Mathura–Vrindavan Road corridors. If you are considering somewhere nearby, ask and we will tell you honestly whether we can help.",
  },
  {
    question: "I live outside Vrindavan. Can you still help?",
    answer:
      "Yes. Many enquiries come from Delhi NCR and further afield. We share shortlists ahead of time and arrange visits around the days you can be here.",
  },
  {
    question: "Are all of your properties listed on this website?",
    answer:
      "No. Some owners prefer not to advertise publicly. Tell us what you are looking for and we will include suitable off-market options in your shortlist.",
  },
  {
    question: "Can you help with a home loan and the paperwork?",
    answer:
      "Where required, we assist with the property finance process and coordinate the documentation and legal-assistance steps through to registration.",
  },
  {
    question: "Do you manage properties for owners?",
    answer:
      "Yes. Property management covers finding tenants, following up on rent and upkeep, and keeping you updated if you do not live nearby.",
  },
] as const;
