import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { propertyStatusLabels, propertyTypeLabels } from "@/data/listings";
import { requestEnquiry } from "@/lib/enquiry";
import type { Property } from "@/types/property";

export function propertyHref(property: Property) {
  return `/properties/${property.slug}`;
}

export function enquireAbout(property: Property) {
  requestEnquiry({
    property: property.title,
    interest: property.purpose === "rent" ? "Renting a property" : "Buying a property",
  });
}

export function propertyFacts(property: Property) {
  return [
    `${propertyTypeLabels[property.type]} · ${property.purpose === "rent" ? "For rent" : "For sale"}`,
    property.bedrooms ? `${property.bedrooms} BHK` : null,
    property.area,
  ].filter((fact): fact is string => Boolean(fact));
}

interface ListingCardProps {
  property: Property;
  sizes: string;
}

/**
 * One property in a listings grid. The photograph and title open the property's own page;
 * "Enquire" hands the property to the contact form further down the page.
 */
export function ListingCard({ property, sizes }: ListingCardProps) {
  return (
    <li className="listing-card" data-listing-card>
      <Link className="listing-media" href={propertyHref(property)} tabIndex={-1} aria-hidden="true" data-cursor-view>
        <span className="listing-media-frame" data-listing-frame>
          <Image src={property.images[0]} alt="" fill sizes={sizes} />
        </span>
        <span className="listing-status" data-status={property.status}>
          {propertyStatusLabels[property.status]}
        </span>
      </Link>
      <div className="listing-body">
        <p className="listing-location">{property.location}</p>
        <h3 className="listing-title">
          <Link href={propertyHref(property)}>{property.title}</Link>
        </h3>
        <p className="listing-description">{property.description}</p>
        <ul className="listing-facts" aria-label="Key facts">
          {propertyFacts(property).map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <div className="listing-footer">
          <span className="listing-price">{property.priceLabel}</span>
          <Link
            className="intent-link"
            href="#contact"
            aria-label={`Enquire about ${property.title}`}
            onClick={() => enquireAbout(property)}
          >
            <span className="intent-link-swap">
              <span>Enquire</span>
              <span aria-hidden="true">Enquire</span>
            </span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </li>
  );
}
