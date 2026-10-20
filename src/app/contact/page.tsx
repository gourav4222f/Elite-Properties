import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContactFaq } from "@/components/pages/contact/contact-faq";
import { ContactGuide } from "@/components/pages/contact/contact-guide";
import { ContactVisit } from "@/components/pages/contact/contact-visit";
import { Contact } from "@/components/sections/contact/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Elite Properties what you are looking for in Vrindavan or Mathura: a home, a plot, a rental or a place for your business.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Contact eyebrow="01 / Contact Elite Properties" titleAs="h1" />
        <ContactGuide />
        <ContactVisit />
        <ContactFaq />
      </main>
      <Footer />
    </>
  );
}
