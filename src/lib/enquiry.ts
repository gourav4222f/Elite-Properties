import { enquiryInterests, type EnquiryInterest } from "@/data/contact";

export interface Enquiry {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
  property: string;
  /** Honeypot: real visitors never see or fill this field. */
  company: string;
}

export type EnquiryField = "name" | "phone" | "email" | "interest";
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

const LIMITS: Record<keyof Enquiry, number> = {
  name: 120,
  phone: 24,
  email: 160,
  interest: 60,
  message: 1200,
  property: 120,
  company: 120,
};

export function normalizeEnquiry(raw: unknown): Enquiry {
  const source = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const read = (key: keyof Enquiry) => String(source[key] ?? "").trim().slice(0, LIMITS[key]);

  return {
    name: read("name"),
    phone: read("phone"),
    email: read("email"),
    interest: read("interest"),
    message: read("message"),
    property: read("property"),
    company: read("company"),
  };
}

export function validateEnquiry(enquiry: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const phoneDigits = enquiry.phone.replace(/\D/g, "");

  if (enquiry.name.length < 2) errors.name = "Please tell us your name.";
  if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    errors.phone = "Please enter a phone number we can reach you on.";
  }
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    errors.email = "Please check your email address.";
  }
  if (!enquiryInterests.includes(enquiry.interest as EnquiryInterest)) {
    errors.interest = "Please choose what you need help with.";
  }

  return errors;
}

export const ENQUIRE_EVENT = "elite:enquire";

export interface EnquireDetail {
  property: string;
  interest?: EnquiryInterest;
}

/** Lets any "Enquire" link pre-fill the contact form with the property it came from. */
export function requestEnquiry(detail: EnquireDetail) {
  window.dispatchEvent(new CustomEvent<EnquireDetail>(ENQUIRE_EVENT, { detail }));
}
