"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { propertyFacts, propertyHref, propertyStatusLabels } from "@/data/listings";
import { requestEnquiry } from "@/lib/enquiry";
import type { Property } from "@/types/property";

interface ListingCardProps {
  property: Property;
  index: number;
  /**
   * "inline" hands the property to a contact form on the same page;
   * "page" opens the enquiry on the property's own page.
   */
  enquire?: "inline" | "page";
}

export function ListingCard({ property, index, enquire = "page" }: ListingCardProps) {
  const wide = index % 4 === 0 || index % 4 === 3;
  const href = propertyHref(property);

  return (
    <li className="listing-card" data-listing-card>
      <Link className="listing-media" href={href} tabIndex={-1} aria-hidden="true" data-cursor-view>
        <span className="listing-media-frame" data-listing-frame>
          <Image
            src={property.images[0]}
            alt=""
            fill
            sizes={
              wide
                ? "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 56vw"
                : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 34vw"
            }
          />
        </span>
        <span className="listing-status" data-status={property.status}>
          {propertyStatusLabels[property.status]}
        </span>
      </Link>
      <div className="listing-body">
        <p className="listing-location">{property.location}</p>
        <h3 className="listing-title">
          <Link href={href}>{property.title}</Link>
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
            href={enquire === "inline" ? "#contact" : `${href}#enquire`}
            aria-label={`Enquire about ${property.title}`}
            onClick={
              enquire === "inline"
                ? () =>
                    requestEnquiry({
                      property: property.title,
                      interest: property.purpose === "rent" ? "Renting a property" : "Buying a property",
                    })
                : undefined
            }
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
