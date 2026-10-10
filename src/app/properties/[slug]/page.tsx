import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { IntentLink } from "@/components/page/intent-link";
import { NextChapter } from "@/components/page/next-chapter";
import { PageHero } from "@/components/page/page-hero";
import { PageMotion } from "@/components/page/page-motion";
import { ReadingStatement } from "@/components/page/reading-statement";
import { SectionHead } from "@/components/page/section-head";
import { ListingCard } from "@/components/properties/listing-card";
import { Contact } from "@/components/sections/contact/contact";
import { listings, propertyFacts, propertyHref, propertyStatusLabels, propertyTypeLabels } from "@/data/listings";
import { driveTimes, neighbourhoods } from "@/data/vrindavan";
import type { Property } from "@/types/property";

export const dynamicParams = false;

export function generateStaticParams() {
  return listings.map((property) => ({ slug: property.slug }));
}

function findProperty(slug: string) {
  return listings.find((property) => property.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const property = findProperty((await params).slug);
  if (!property) return {};
  return {
    title: property.title,
    description: `${property.description} ${property.location}. ${property.priceLabel}.`,
  };
}

/** Display titles break across two lines, the longer half first. */
function titleLines(title: string) {
  const words = title.split(" ");
  const split = Math.ceil(words.length / 2);
  return [words.slice(0, split).join(" "), words.slice(split).join(" ")].filter(Boolean);
}

/** Properties most like this one: same purpose and type first, then the same purpose. */
function similarTo(property: Property) {
  const score = (other: Property) =>
    (other.type === property.type ? 2 : 0) + (other.purpose === property.purpose ? 1 : 0);
  return listings
    .filter((other) => other.id !== property.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 2);
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const property = findProperty((await params).slug);
  if (!property) notFound();

  const index = listings.indexOf(property);
  const next = listings[(index + 1) % listings.length];
  const area = neighbourhoods.find((candidate) => candidate.id === property.neighbourhood);
  const renting = property.purpose === "rent";
  const facts = [
    { label: "Price", value: property.priceLabel },
    { label: "Type", value: `${propertyTypeLabels[property.type]} · ${renting ? "For rent" : "For sale"}` },
    { label: "Area", value: property.area },
    property.bedrooms ? { label: "Bedrooms", value: String(property.bedrooms) } : null,
    property.bathrooms ? { label: "Bathrooms", value: String(property.bathrooms) } : null,
    { label: "Status", value: propertyStatusLabels[property.status] },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));
  const [lead, ...overview] = property.overview ?? [property.description];

  return (
    <PageMotion>
      <PageHero
        variant="image"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: property.title },
        ]}
        title={titleLines(property.title)}
        offset={[1]}
        intro={
          <>
            <p className="page-hero-location">{property.location}</p>
            <p>{property.description}</p>
          </>
        }
        meta={propertyFacts(property)}
        image={{ src: property.images[0], alt: `${property.title}, ${property.location}` }}
      >
        <div className="page-hero-actions" data-hero-fade>
          <IntentLink href="#enquire" label="Arrange a visit" />
          <span className="page-hero-price">{property.priceLabel}</span>
        </div>
      </PageHero>

      <section className="pg-section estate-overview" aria-labelledby="estate-overview-title">
        <dl className="estate-facts" data-reveal>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="estate-overview-grid">
          <div className="section-rule" data-reveal>
            <span>01 / Overview</span>
            <i />
          </div>
          <h2 id="estate-overview-title" className="sr-only">
            About {property.title}
          </h2>
          <ReadingStatement className="estate-lead" text={lead} />
          <div className="estate-copy">
            {overview.map((paragraph) => (
              <p key={paragraph} data-reveal>
                {paragraph}
              </p>
            ))}
            <div className="estate-highlights" data-reveal>
              <h3 className="pg-kicker">Highlights</h3>
              <ul className="pg-list">
                {property.amenities.map((amenity) => (
                  <li key={amenity}>{amenity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {property.gallery?.length ? (
        <section className="pg-section estate-gallery" aria-labelledby="estate-gallery-title">
          <SectionHead id="estate-gallery-title" label="02 / A closer look" title={["Inside", "and around."]} offset={[1]} />
          <ul className="gallery-grid">
            {property.gallery.map((image, position) => (
              <li className={`gallery-item gallery-item-${(position % 4) + 1}`} key={image.src}>
                <figure>
                  <span className="pg-image gallery-image" data-image={position % 2 ? "left" : "up"} data-parallax={position % 2 ? 4 : 6}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={position % 4 === 0 || position % 4 === 3 ? "(max-width: 767px) 100vw, 58vw" : "(max-width: 767px) 100vw, 36vw"}
                    />
                  </span>
                  <figcaption data-reveal>{image.alt}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="pg-note" data-reveal>
            Images are representative of the specification and finish. We share current photographs and plans on
            request.
          </p>
        </section>
      ) : null}

      {area ? (
        <section className="pg-band pg-band--ink estate-place" data-header-ivory aria-labelledby="estate-place-title">
          <div className="estate-place-head">
            <div className="section-rule" data-reveal>
              <span>03 / The neighbourhood</span>
              <i />
            </div>
            <h2 id="estate-place-title" className="estate-place-title" data-reveal-lines>
              {titleLines(area.name).map((line) => (
                <span className="line-mask" key={line}>
                  <span>{line}</span>
                </span>
              ))}
            </h2>
          </div>
          <div className="estate-place-copy">
            <p className="estate-place-character" data-reveal>
              {area.character}
            </p>
            <p data-reveal>{area.detail}</p>
            <p className="pg-tags" data-reveal>
              {area.suits}
            </p>
            <div className="pg-actions" data-reveal>
              <IntentLink href={`/vrindavan#${area.id}`} label="Explore the area" />
            </div>
          </div>
          <ul className="place-drive-times estate-times" aria-label="Approximate drive times from central Vrindavan">
            {driveTimes.map((time) => (
              <li key={time.place} data-reveal>
                <span className="place-drive-value">
                  <span data-count={time.value}>{time.value}</span>
                  <small>{time.unit}</small>
                </span>
                <span className="place-drive-place">{time.place}</span>
              </li>
            ))}
          </ul>
          <p className="place-connect-note estate-times-note" data-reveal>
            Approximate road journeys from central Vrindavan. Times vary with traffic and route.
          </p>
        </section>
      ) : null}

      <Contact
        id="enquire"
        label="04 / Enquire"
        title={["Arrange", "a visit."]}
        intro={`Tell us when suits you, and anything you would like to know about ${property.title} beforehand. We will confirm availability, pricing and a time to visit.`}
        property={property.title}
        interest={renting ? "Renting a property" : "Buying a property"}
      />

      <section className="pg-section estate-similar" aria-labelledby="estate-similar-title">
        <SectionHead
          id="estate-similar-title"
          label="05 / You may also like"
          title={["More places", "worth seeing."]}
          offset={[1]}
        />
        <ul className="listings-grid similar-grid">
          {similarTo(property).map((other, position) => (
            <ListingCard key={other.id} property={other} index={position} />
          ))}
        </ul>
        <div className="pg-actions similar-actions" data-reveal>
          <IntentLink href="/properties" label="View all properties" />
        </div>
      </section>

      <NextChapter
        kicker="Next property"
        chapter={{
          href: propertyHref(next),
          label: next.title,
          theme: next.location,
          title: titleLines(next.title),
          summary: next.description,
          image: { src: next.images[0], alt: next.title },
        }}
      />
    </PageMotion>
  );
}
