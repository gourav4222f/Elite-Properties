import type { FaqItem } from "@/components/page/faq";

export const serviceFaqs: readonly FaqItem[] = [
  {
    question: "How do your fees work?",
    answer:
      "Fees depend on the service and the transaction. We explain them clearly in our first conversation, before you commit to anything.",
  },
  {
    question: "Can you help if I live outside Vrindavan?",
    answer:
      "Yes. We can shortlist remotely, plan visits around your travel and keep you updated between them, so you only travel when it is worth it.",
  },
  {
    question: "Do you provide legal advice?",
    answer:
      "We coordinate documentation and work alongside qualified legal professionals, who provide the legal advice and checks for your transaction.",
  },
  {
    question: "Can you help me get a home loan?",
    answer:
      "We can help you navigate the process and connect you with lenders. Eligibility and approval decisions always rest with the lender.",
  },
  {
    question: "Do you manage properties for owners who live elsewhere?",
    answer:
      "Yes. Property management can include tenant coordination, maintenance and periodic checks, shaped around what you need.",
  },
] as const;

export const contactFaqs: readonly FaqItem[] = [
  {
    question: "What should I include in my enquiry?",
    answer:
      "Whatever helps: the kind of property, preferred area, budget range, timing and how you plan to use it. We will ask about the rest.",
  },
  {
    question: "Can I visit your office?",
    answer:
      "Visits are by appointment, so the right person is there to meet you. Mention it in your enquiry and we will arrange a time.",
  },
  {
    question: "I want to sell or let my property. Can you help?",
    answer:
      "Yes. Choose “Selling or letting” in the form and tell us about the property. We will talk through pricing, presentation and next steps.",
  },
  {
    question: "What happens to the details I share?",
    answer:
      "We use them only to respond to your enquiry and help with your property search. Our privacy notice explains this in full.",
  },
] as const;
