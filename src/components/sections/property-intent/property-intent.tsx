"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { turnPage } from "@/components/layout/page-transition";
import { propertySearchHref } from "@/data/listings";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useViewCursor } from "@/hooks/use-view-cursor";
import { getScrub, gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { animateImages } from "@/lib/image-motion";

import {
  budgetOptions,
  propertyCategories,
  propertyLocations,
  propertyTypes,
} from "./property-intent-data";

function LineHeadline({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line) => (
        <span className="intent-line" key={line}>
          <span>{line}</span>
        </span>
      ))}
    </>
  );
}

function EditorialLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="intent-link" href={href}>
      <span className="intent-link-swap">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
    </Link>
  );
}

function PropertyImage({
  src,
  alt,
  href,
  className,
  parallax,
  reveal = "up",
  sizes,
}: {
  src: string;
  alt: string;
  href: string;
  className: string;
  parallax: string;
  reveal?: "up" | "left";
  sizes: string;
}) {
  return (
    <Link
      className={`intent-image ${className}`}
      href={href}
      data-cursor-view
      data-image={reveal}
      data-parallax={parallax}
      aria-label={`View ${alt.toLowerCase()}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading="lazy"
      />
    </Link>
  );
}

export function PropertyIntent() {
  const rootRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [intent, setIntent] = useState<"buy" | "rent">("buy");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      [".commercial-chapter", ".property-finder"].forEach((selector) => createIvoryHeaderZone(selector));

      if (reducedMotion) {
        gsap.set("[data-intent-reveal], .intent-line > span", { clearProps: "all" });
        return;
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-intent-reveal]");
        gsap.fromTo(
          items,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.09,
            ease: motionEasings.enter,
            scrollTrigger: { trigger: group, start: "top 78%", once: true },
          },
        );

        const lines = group.querySelectorAll<HTMLElement>(".intent-line > span");
        if (lines.length) {
          gsap.fromTo(
            lines,
            { yPercent: 112 },
            {
              yPercent: 0,
              duration: 1.05,
              stagger: 0.08,
              ease: motionEasings.cinematic,
              scrollTrigger: { trigger: group, start: "top 76%", once: true },
            },
          );
        }
      });

      animateImages(root);

      gsap.fromTo(
        ".intent-graphic-word",
        { xPercent: -8 },
        {
          xPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: ".intent-graphic-word",
            start: "top bottom",
            end: "bottom top",
            scrub: getScrub(),
          },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-slow-number]").forEach((number) => {
        gsap.fromTo(
          number,
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: { trigger: number.parentElement, start: "top bottom", end: "bottom top", scrub: getScrub() },
          },
        );
      });

    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  useViewCursor(rootRef, cursorRef, !reducedMotion);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("Finding properties that match…");
    turnPage(
      propertySearchHref({
        intent,
        type: String(form.get("propertyType") ?? ""),
        location: String(form.get("location") ?? ""),
        budget: String(form.get("budget") ?? ""),
      }),
    );
  };

  const residential = propertyCategories.residential;
  const commercial = propertyCategories.commercial;
  const land = propertyCategories.land;
  const rental = propertyCategories.rental;

  return (
    <section ref={rootRef} id="properties" className="property-intent" aria-labelledby="property-intent-title">
      <div className="property-intro" data-reveal-group>
        <p className="intent-eyebrow" data-intent-reveal>01 / What we do</p>
        <h2 id="property-intent-title" className="property-intro-title">
          <span className="intent-line"><span>Not every property</span></span>
          <span className="intent-line intent-line-offset"><span>is the right property.</span></span>
        </h2>
        <p className="property-intro-support" data-intent-reveal>We help you find the one that is.</p>
      </div>

      <div className="intent-graphic-word" aria-hidden="true">Property</div>

      <article className="property-chapter residential-chapter" data-reveal-group>
        <div className="chapter-index" data-slow-number aria-hidden="true">{residential.number}</div>
        <PropertyImage src={residential.image} alt={residential.imageAlt} href={residential.href} className="residential-image" parallax="6" sizes="(max-width: 767px) 100vw, 58vw" />
        <div className="property-copy residential-copy">
          <p className="chapter-kicker" data-intent-reveal>{residential.number} / {residential.label}</p>
          <h3><LineHeadline lines={residential.headline} /></h3>
          <p className="chapter-description" data-intent-reveal>{residential.description}</p>
          <div className="chapter-footer" data-intent-reveal>
            <EditorialLink href={residential.href} label={residential.cta} />
            <span>{residential.metadata}</span>
          </div>
        </div>
      </article>

      <article className="property-chapter commercial-chapter" data-reveal-group>
        <div className="commercial-index" data-slow-number aria-hidden="true">{commercial.number}</div>
        <div className="property-copy commercial-copy">
          <p className="chapter-kicker" data-intent-reveal>{commercial.number} / {commercial.label}</p>
          <h3><LineHeadline lines={commercial.headline} /></h3>
          <p className="chapter-description" data-intent-reveal>{commercial.description}</p>
          <div className="chapter-footer" data-intent-reveal>
            <EditorialLink href={commercial.href} label={commercial.cta} />
            <span>{commercial.metadata}</span>
          </div>
        </div>
        <PropertyImage src={commercial.image} alt={commercial.imageAlt} href={commercial.href} className="commercial-image" parallax="5" reveal="left" sizes="(max-width: 767px) 100vw, 62vw" />
      </article>

      <article className="property-chapter land-chapter" data-reveal-group>
        <div className="property-copy land-copy">
          <p className="chapter-kicker" data-intent-reveal>{land.number} / {land.label}</p>
          <h3><LineHeadline lines={land.headline} /></h3>
        </div>
        <PropertyImage src={land.image} alt={land.imageAlt} href={land.href} className="land-image" parallax="4" sizes="(max-width: 767px) 100vw, 84vw" />
        <div className="land-notes" data-intent-reveal>
          <p className="chapter-description">{land.description}</p>
          <div className="chapter-footer">
            <EditorialLink href={land.href} label={land.cta} />
            <span>{land.metadata}</span>
          </div>
        </div>
      </article>

      <article className="property-chapter rental-chapter" data-reveal-group>
        <div className="rental-index" data-slow-number aria-hidden="true">{rental.number}</div>
        <div className="property-copy rental-copy">
          <p className="chapter-kicker" data-intent-reveal>{rental.number} / {rental.label}</p>
          <h3><LineHeadline lines={rental.headline} /></h3>
          <p className="chapter-description" data-intent-reveal>{rental.description}</p>
          <div className="chapter-footer" data-intent-reveal>
            <EditorialLink href={rental.href} label={rental.cta} />
            <span>{rental.metadata}</span>
          </div>
        </div>
        <PropertyImage src={rental.image} alt={rental.imageAlt} href={rental.href} className="rental-image" parallax="3" sizes="(max-width: 767px) 100vw, 38vw" />
      </article>

      <section id="property-finder" className="property-finder" aria-labelledby="property-finder-title" data-reveal-group>
        <div className="finder-heading">
          <p className="finder-kicker" data-intent-reveal>Ready to look?</p>
          <h2 id="property-finder-title"><LineHeadline lines={["Know what", "you're looking for?"]} /></h2>
          <p data-intent-reveal>Start with what matters to you.</p>
        </div>

        <form className="finder-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="finder-intent" data-intent-reveal>
            <legend>I&apos;m looking to</legend>
            <div role="radiogroup" aria-label="Property intent">
              {(["buy", "rent"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={intent === option}
                  className={intent === option ? "is-active" : undefined}
                  onClick={() => setIntent(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="finder-fields">
            <label className="finder-field" data-intent-reveal>
              <span>Property type</span>
              <span className="finder-select-wrap">
                <select name="propertyType" defaultValue="Residential" required>
                  {propertyTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
                <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
              </span>
            </label>

            <label className="finder-field" data-intent-reveal>
              <span>Location</span>
              <span className="finder-select-wrap">
                <select name="location" defaultValue="Vrindavan" required>
                  {propertyLocations.map((location) => <option key={location}>{location}</option>)}
                </select>
                <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
              </span>
            </label>

            <label className="finder-field" data-intent-reveal>
              <span>Budget</span>
              <span className="finder-select-wrap">
                <select name="budget" defaultValue="any" required>
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
              </span>
            </label>
          </div>

          <button className="finder-submit" type="submit" data-intent-reveal>
            <span className="intent-link-swap"><span>Find property</span><span aria-hidden="true">Find property</span></span>
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
          <p className="finder-status" aria-live="polite">{status}</p>
        </form>
      </section>

      <div ref={cursorRef} className="view-cursor" aria-hidden="true">View <ArrowUpRight size={12} strokeWidth={1.5} /></div>
    </section>
  );
}
