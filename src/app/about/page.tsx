import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { IntentLink } from "@/components/page/intent-link";
import { NextChapter } from "@/components/page/next-chapter";
import { PageHero } from "@/components/page/page-hero";
import { PageMotion } from "@/components/page/page-motion";
import { ReadingStatement } from "@/components/page/reading-statement";
import { SectionHead } from "@/components/page/section-head";
import { aboutIntroduction, aboutPhilosophy, aboutStatement, coverage, principles, workingWithUs } from "@/data/about";
import { chapters, nextChapter } from "@/data/site";
import { neighbourhoods } from "@/data/vrindavan";

export const metadata: Metadata = {
  title: "About",
  description:
    "Elite Properties is a Vrindavan-based property partner for buyers, sellers, investors and tenants across Vrindavan and Mathura.",
};

export default function AboutPage() {
  return (
    <PageMotion>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title={chapters.about.title}
        offset={[1]}
        intro={<p>{aboutIntroduction}</p>}
        meta={["Vrindavan · Mathura", "Buying · Selling · Renting", "One local team"]}
        image={{ ...chapters.about.image, position: "center 40%" }}
      />

      <section className="pg-section about-why" aria-labelledby="about-why-title">
        <SectionHead
          id="about-why-title"
          label="01 / Why we exist"
          title={["One local", "partner."]}
          offset={[1]}
        />
        <div className="about-why-body">
          <p className="about-why-lead" data-reveal>
            {aboutPhilosophy.lead}
          </p>
          <div className="about-why-copy">
            {aboutPhilosophy.paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <ReadingStatement className="about-why-statement" text={aboutStatement} />
      </section>

      <section className="pg-section pg-band pg-band--forest about-values" data-header-ivory aria-labelledby="about-values-title">
        <div className="pg-sticky-grid">
          <div className="pg-sticky">
            <SectionHead
              id="about-values-title"
              label="02 / What we stand for"
              title={["Four", "principles."]}
              intro={<p>The commitments behind every shortlist, visit and recommendation we make.</p>}
            />
          </div>
          <ol className="about-values-list">
            {principles.map((principle) => (
              <li className="about-value" key={principle.number}>
                <span className="pg-rule" data-rule aria-hidden="true" />
                <span className="about-value-number" data-reveal>
                  {principle.number}
                </span>
                <h3 className="about-value-title" data-reveal-lines>
                  <span className="line-mask">
                    <span>{principle.title}</span>
                  </span>
                </h3>
                <p className="about-value-copy" data-reveal>
                  {principle.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pg-section about-ground" aria-labelledby="about-ground-title">
        <div className="about-ground-media">
          <figure className="pg-image about-ground-primary" data-image="up" data-parallax="6">
            <Image
              src="/images/lifestyle/happy-couple-outdoor-lifestyle.webp"
              alt="Couple smiling together outdoors in soft evening light"
              fill
              sizes="(max-width: 767px) 100vw, 42vw"
            />
          </figure>
          <figure className="pg-image about-ground-secondary" data-image="left" data-parallax="4">
            <Image
              src="/images/properties/aerial-view-luxury-residential-building-greenery.jpg"
              alt="Aerial view of homes set among dense greenery"
              fill
              sizes="(max-width: 767px) 70vw, 26vw"
            />
          </figure>
        </div>
        <div className="about-ground-copy">
          <SectionHead
            id="about-ground-title"
            label="03 / Where we work"
            title={["We know", "the ground."]}
            intro={
              <p>
                We live and work here. Knowing how each neighbourhood feels day to day, which projects
                are moving and who is behind them shapes every recommendation we make.
              </p>
            }
          />
          <div className="about-coverage">
            <div data-reveal>
              <h3 className="pg-kicker">What we handle</h3>
              <ul className="pg-list">
                {coverage.types.map((type) => (
                  <li key={type}>{type}</li>
                ))}
              </ul>
            </div>
            <div data-reveal>
              <h3 className="pg-kicker">Where</h3>
              <ul className="pg-list">
                {neighbourhoods.map((area) => (
                  <li key={area.id}>
                    <Link className="pg-list-link" href={`/vrindavan#${area.id}`}>
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pg-section pg-band pg-band--surface about-together" aria-labelledby="about-together-title">
        <SectionHead
          id="about-together-title"
          label="04 / Working with us"
          title={["What to", "expect."]}
          offset={[1]}
          intro={<p>However you start, the shape of working together stays the same: unhurried, clear and close.</p>}
        />
        <div className="step-track">
          <span className="step-track-line" data-rule aria-hidden="true" />
          <ol className="step-list">
          {workingWithUs.map((step) => (
            <li className="step" key={step.number}>
              <span className="step-node" aria-hidden="true" />
              <span className="step-number" data-reveal>
                {step.number}
              </span>
              <h3 className="step-title" data-reveal>
                {step.title}
              </h3>
              <p className="step-copy" data-reveal>
                {step.description}
              </p>
            </li>
          ))}
          </ol>
        </div>
        <div className="pg-actions" data-reveal>
          <IntentLink href="/services" label="See how we help" />
          <IntentLink href="/contact" label="Start a conversation" />
        </div>
      </section>

      <NextChapter chapter={nextChapter("about")} />
    </PageMotion>
  );
}
