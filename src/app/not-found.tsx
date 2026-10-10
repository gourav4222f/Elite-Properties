import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page/page-hero";
import { PageMotion } from "@/components/page/page-motion";
import { chapters } from "@/data/site";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <PageMotion>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Not found" }]}
        title={["This page has", "moved on."]}
        offset={[1]}
        intro={
          <p>
            The address may have changed, or the page is no longer here. Every chapter of the story is still a
            click away.
          </p>
        }
      />

      <nav className="pg-section lost" aria-label="Chapters">
        <ol className="lost-list">
          {Object.values(chapters).map((chapter, index) => (
            <li key={chapter.key}>
              <Link className="lost-link" href={chapter.href}>
                <span className="pg-rule" data-rule aria-hidden="true" />
                <span className="lost-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="lost-label" data-reveal>
                  {chapter.label}
                </span>
                <span className="lost-theme" data-reveal>
                  {chapter.summary}
                </span>
                <ArrowUpRight className="lost-arrow" aria-hidden="true" size={22} strokeWidth={1.25} />
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </PageMotion>
  );
}
