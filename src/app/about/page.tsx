import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { AboutStory } from "@/components/pages/about/about-story";
import { AboutValues } from "@/components/pages/about/about-values";
import { ServiceAreas } from "@/components/pages/about/service-areas";
import { Contact } from "@/components/sections/contact/contact";
import { aboutIntroduction } from "@/data/about";

export const metadata: Metadata = {
  title: "About",
  description: aboutIntroduction,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          eyebrow="About / Elite Properties"
          titleLines={["Local roots.", "Considered", "advice."]}
          offset={[1]}
          intro={aboutIntroduction}
          image={{
            src: "/images/interiors/luxury-drawing-room-sofa-dining-area.jpg",
            alt: "Spacious drawing room with connected sofa and dining areas",
          }}
        />
        <AboutStory />
        <AboutValues />
        <ServiceAreas />
        <Contact eyebrow="04 / Contact" />
      </main>
      <Footer />
    </>
  );
}
