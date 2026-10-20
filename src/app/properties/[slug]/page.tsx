import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PropertyDetail } from "@/components/pages/property/property-detail";
import { Contact } from "@/components/sections/contact/contact";
import { listings } from "@/data/listings";

function findProperty(slug: string) {
  return listings.find((property) => property.slug === slug);
}

export function generateStaticParams() {
  return listings.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const property = findProperty((await params).slug);
  if (!property) return {};

  return {
    title: property.title,
    description: `${property.description} ${property.location}.`,
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const property = findProperty((await params).slug);
  if (!property) notFound();

  // Closest matches first: same type, then same purpose, then the rest.
  const related = listings
    .filter((item) => item.id !== property.id)
    .map((item) => ({ item, score: (item.type === property.type ? 2 : 0) + (item.purpose === property.purpose ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);

  return (
    <>
      <Header />
      <main id="main-content">
        <PropertyDetail property={property} related={related} />
        <Contact
          eyebrow="04 / Enquire"
          initialProperty={property.title}
          initialInterest={property.purpose === "rent" ? "Renting a property" : "Buying a property"}
        />
      </main>
      <Footer />
    </>
  );
}
