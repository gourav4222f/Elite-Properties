import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { IntentLink } from "@/components/page/intent-link";
import { NextChapter } from "@/components/page/next-chapter";
import { PageHero } from "@/components/page/page-hero";
import { PageMotion } from "@/components/page/page-motion";
import { SectionHead } from "@/components/page/section-head";
import { CollectionLink } from "@/components/properties/collection-link";
import { PropertyBrowser, PropertyBrowserFallback } from "@/components/properties/property-browser";
import { propertyCategories } from "@/components/sections/property-intent/property-intent-data";
import { listings } from "@/data/listings";
import { chapters, nextChapter } from "@/data/site";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Homes, plots and commercial spaces for sale and rent across Vrindavan and Mathura, with private visits on request.",
};

const categories = Object.entries(propertyCategories) as [
  keyof typeof propertyCategories,
  (typeof propertyCategories)[keyof typeof propertyCategories],
][];

export default function PropertiesPage() {
  return (
    <PageMotion>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
        title={chapters.properties.title}
        offset={[1]}
        intro={
          <p>
            A considered selection of homes, plots and commercial spaces across Vrindavan and Mathura. Each one
            comes with honest notes, and a private visit whenever you are ready.
          </p>
        }
        meta={[`${String(listings.length).padStart(2, "0")} current listings`, "For sale & for rent", "Visits by appointment"]}
        image={{ ...chapters.properties.image, position: "center 62%" }}
      />

      <section id="collection" className="pg-section collection" aria-labelledby="collection-title" tabIndex={-1}>
        <SectionHead
          id="collection-title"
          label="01 / Current listings"
          title={["What's", "available now."]}
          offset={[1]}
          intro={<p>Filter by what you need and where. Prices are shared on request, alongside availability.</p>}
        />
        <Suspense fallback={<PropertyBrowserFallback />}>
          <PropertyBrowser />
        </Suspense>
      </section>

      <section className="pg-section pg-band pg-band--surface types" aria-labelledby="types-title">
        <SectionHead
          id="types-title"
          label="02 / By type"
          title={["Start with", "what you need."]}
          offset={[1]}
        />
        <ul className="type-tiles">
          {categories.map(([id, category], index) => (
            <li className="type-tile" key={id}>
              <CollectionLink category={id} className="type-tile-link">
                <span className="pg-image type-tile-image" data-image={index % 2 ? "left" : "up"} data-parallax="4">
                  <Image src={category.image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw" />
                </span>
                <span className="type-tile-number" data-reveal>
                  {category.number}
                </span>
                <span className="type-tile-title" data-reveal>
                  {category.label}
                </span>
                <span className="type-tile-copy" data-reveal>
                  {category.description}
                </span>
                <span className="intent-link type-tile-cta" data-reveal>
                  <span className="intent-link-swap">
                    <span>{category.cta}</span>
                    <span aria-hidden="true">{category.cta}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </span>
              </CollectionLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="pg-band pg-band--forest quiet" data-header-ivory aria-labelledby="quiet-title">
        <div className="quiet-copy">
          <div className="section-rule" data-reveal>
            <span>03 / Off-market</span>
            <i />
          </div>
          <h2 id="quiet-title" className="quiet-title" data-reveal-lines>
            <span className="line-mask">
              <span>Not every door</span>
            </span>
            <span className="line-mask">
              <span>is listed.</span>
            </span>
          </h2>
          <p className="quiet-intro" data-reveal>
            Some owners prefer discretion, and some opportunities move before they are ever advertised. Share
            your brief, and we will look on your behalf.
          </p>
          <div className="pg-actions" data-reveal>
            <IntentLink href="/contact" label="Share your brief" />
            <IntentLink href="/services#buying-selling" label="How we search" />
          </div>
        </div>
        <figure className="pg-image quiet-image" data-image="left" data-parallax="5">
          <Image
            src="/images/interiors/lobby-staircase-indoor-plants.webp"
            alt="Quiet lobby with a staircase and indoor plants"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </figure>
      </section>

      <NextChapter chapter={nextChapter("properties")} />
    </PageMotion>
  );
}
