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
