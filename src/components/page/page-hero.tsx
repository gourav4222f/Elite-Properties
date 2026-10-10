import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  /** The trail above the title; the last crumb is the current page. */
  crumbs: readonly Crumb[];
  title: readonly string[];
  /** Lines (by index) pushed toward the centre, as on the homepage titles. */
  offset?: readonly number[];
  intro?: ReactNode;
  /** Short facts set beside the introduction. */
  meta?: readonly string[];
  image?: { src: string; alt: string; position?: string };
  /** "type": an editorial opening on ivory with an image band; "image": a full-bleed photograph. */
  variant?: "type" | "image";
  children?: ReactNode;
}

/** The opening of every inner page, in the same voice as the homepage chapters. */
export function PageHero({ crumbs, title, offset = [], intro, meta, image, variant = "type", children }: PageHeroProps) {
  const trail = (
    <nav className="page-hero-crumbs" aria-label="Breadcrumb" data-hero-fade>
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={crumb.label} aria-current={index === crumbs.length - 1 ? "page" : undefined}>
            {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
          </li>
        ))}
      </ol>
      <i aria-hidden="true" />
    </nav>
  );

  if (variant === "image" && image) {
    return (
      <header className="page-hero page-hero--image" data-header-ivory>
        <figure className="page-hero-backdrop" data-hero-image data-parallax="5">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="100vw"
            style={{ objectPosition: image.position ?? "center" }}
          />
        </figure>
        <div className="page-hero-content">
          {trail}
          <h1 className="page-hero-title" data-hero-lines>
            <MaskedLines lines={title} offset={offset} />
          </h1>
          <div className="page-hero-aside">
            {intro ? <div className="page-hero-intro" data-hero-fade>{intro}</div> : null}
            {meta?.length ? (
              <ul className="page-hero-meta" data-hero-fade>
                {meta.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {children}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={cn("page-hero page-hero--type", !image && "page-hero--plain")}>
      <div className="page-hero-content">
        {trail}
        <h1 className="page-hero-title" data-hero-lines>
          <MaskedLines lines={title} offset={offset} />
        </h1>
        <div className="page-hero-aside">
          {intro ? <div className="page-hero-intro" data-hero-fade>{intro}</div> : null}
          {meta?.length ? (
            <ul className="page-hero-meta" data-hero-fade>
              {meta.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {children}
        </div>
      </div>
      {image ? (
        <figure className="page-hero-band" data-hero-image data-parallax="6">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="100vw"
            style={{ objectPosition: image.position ?? "center" }}
          />
        </figure>
      ) : null}
    </header>
  );
}
