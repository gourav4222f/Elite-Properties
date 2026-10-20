import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";
import { PropertiesExplorer } from "@/components/pages/properties/properties-explorer";
import { Contact } from "@/components/sections/contact/contact";
import { listingFilters, listings } from "@/data/listings";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Residential, commercial, plots, land and rental properties across Vrindavan and Mathura, selected by Elite Properties.",
};

const cityCount = new Set(listings.map((property) => (property.location.includes("Mathura") ? "Mathura" : "Vrindavan"))).size;

const heroFigures = [
  { value: listings.length, label: "Current listings" },
  { value: listingFilters.length - 1, label: "Categories" },
  { value: cityCount, label: "Cities" },
];

export default async function PropertiesPage({ searchParams }: PageProps<"/properties">) {
  const { category } = await searchParams;
  const initialFilter = listingFilters.find((option) => option.id === category)?.id ?? "all";

  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          eyebrow="Properties / Vrindavan · Mathura"
          titleLines={["Every kind", "of place."]}
          offset={[1]}
          intro="Homes, commercial spaces, plots and rentals, chosen for where they are and how they will be lived in. Browse what is available now, or tell us what you are looking for."
          image={{
            src: "/images/properties/residential-complex-night-exterior.jpg",
            alt: "Long residential complex lit up along a quiet street at night",
          }}
        >
          <dl className="page-hero-figures">
            {heroFigures.map((figure) => (
              <div key={figure.label}>
                <dt>{figure.label}</dt>
                <dd>{String(figure.value).padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        </PageHero>
        {/* Keyed so a footer link to another category starts the grid fresh. */}
        <PropertiesExplorer key={initialFilter} initialFilter={initialFilter} />
        <Contact eyebrow="03 / Contact" />
      </main>
      <Footer />
    </>
  );
}
