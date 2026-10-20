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

export default async function PropertiesPage({ searchParams }: PageProps<"/properties">) {
  const { category } = await searchParams;
  const initialFilter = listingFilters.find((option) => option.id === category)?.id ?? "all";

  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          eyebrow="Properties / Vrindavan · Mathura"
          counter="01 / 04"
          kicker={`${listings.length} listings · ${listingFilters.length - 1} categories`}
          titleLines={["Every kind", "of place."]}
          intro="Homes, commercial spaces, plots and rentals, chosen for where they are and how they will be lived in."
          actions={[
            { label: "View listings", href: "#listings" },
            { label: "Enquire", href: "#contact", variant: "glass" },
          ]}
          dockLabel="Browse by category"
          image={{
            src: "/images/properties/residential-complex-night-exterior.jpg",
            alt: "Long residential complex lit up along a quiet street at night",
          }}
        />
        {/* Keyed so a footer link to another category starts the grid fresh. */}
        <PropertiesExplorer key={initialFilter} initialFilter={initialFilter} />
        <Contact eyebrow="03 / Contact" />
      </main>
      <Footer />
    </>
  );
}
