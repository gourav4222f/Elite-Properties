"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { contactDetails } from "@/data/contact";
import { primaryNavigation, propertiesHref } from "@/data/navigation";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getScrub, gsap } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { scrollToTarget } from "@/lib/smooth-scroll";

const exploreLinks = [{ label: "Home", href: "/" }, ...primaryNavigation];

const propertyLinks = [
  { label: "All properties", href: propertiesHref("all") },
  { label: "Residential", href: propertiesHref("residential") },
  { label: "Commercial", href: propertiesHref("commercial") },
  { label: "Plots & Land", href: propertiesHref("land") },
  { label: "Rental", href: propertiesHref("rental") },
];

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(root);
      if (reducedMotion) return;

      // The wordmark surfaces as the page runs out, closing on the brand.
      gsap.fromTo(
        ".footer-wordmark > span",
        { yPercent: 55 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: getScrub() },
        },
      );
    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <footer ref={rootRef} className="site-footer">
      <div className="footer-top">
        <p className="footer-tagline">
          Find your place
          <br />
          in Vrindavan.
        </p>

        <nav className="footer-nav" aria-label="Footer">
          <div>
            <p className="footer-heading">Explore</p>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link className="footer-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-heading">Properties</p>
            <ul>
              {propertyLinks.map((link) => (
                <li key={link.label}>
                  <Link className="footer-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-heading">Visit</p>
            <address>
              {contactDetails.office.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <span>{contactDetails.visits}</span>
              {contactDetails.phone ? (
                <a className="footer-link" href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>
                  {contactDetails.phone}
                </a>
              ) : null}
              {contactDetails.email ? (
                <a className="footer-link" href={`mailto:${contactDetails.email}`}>
                  {contactDetails.email}
                </a>
              ) : null}
            </address>
          </div>
        </nav>
      </div>

      <div className="footer-wordmark" aria-hidden="true">
        <span>Elite Properties</span>
      </div>

      <div className="footer-bottom">
        <p suppressHydrationWarning>© {new Date().getFullYear()} Elite Properties. All rights reserved.</p>
        <p>Vrindavan · Mathura</p>
        <button type="button" className="footer-top-link" onClick={() => scrollToTarget(0)}>
          Back to top
          <ArrowUp aria-hidden="true" size={14} strokeWidth={1.5} />
        </button>
      </div>
    </footer>
  );
}
