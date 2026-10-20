import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
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
        <PageHero
          eyebrow="Contact / Elite Properties"
          counter="04 / 04"
          kicker="Site visits by appointment"
          titleLines={["Let's", "talk."]}
          intro="A home, a plot, a rental or a place for your business: tell us what you need and the right person will call you back."
          actions={[
            { label: "Send an enquiry", href: "#contact" },
            { label: "Visit us", href: "#visit", variant: "glass" },
          ]}
          dockLabel="Start your enquiry"
          image={{
            src: "/images/lifestyle/happy-couple-outdoor-lifestyle.webp",
            alt: "Couple smiling together outdoors in soft evening light",
          }}
        />
        <Contact eyebrow="01 / Enquiry" />
        <ContactGuide />
        <ContactVisit />
        <ContactFaq />
      </main>
      <Footer />
    </>
  );
}
