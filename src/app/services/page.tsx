import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { ServicesIndex } from "@/components/pages/services/services-index";
import { ServicesProcess } from "@/components/pages/services/services-process";
import { Contact } from "@/components/sections/contact/contact";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Buying, selling, rentals, commercial property, plots, investment advice, finance and documentation support, and property management in Vrindavan and Mathura.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          eyebrow="Services / Elite Properties"
          titleLines={["Every step,", "handled."]}
          offset={[1]}
          intro="Advice, search, visits, finance, paperwork and management under one roof, so a property decision feels considered rather than complicated."
          image={{
            src: "/images/interiors/luxury-living-room-chandelier-curtains.jpg",
            alt: "Bright living room with layered curtains, soft seating and a chandelier",
          }}
        >
          <ul className="page-hero-links" aria-label="Jump to a service">
            {services.map((service) => (
              <li key={service.id}>
                <a href={`#${service.id}`}>
                  <span>{service.number}</span>
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </PageHero>
        <ServicesIndex />
        <ServicesProcess />
        <Contact eyebrow="03 / Contact" />
      </main>
      <Footer />
    </>
  );
}
