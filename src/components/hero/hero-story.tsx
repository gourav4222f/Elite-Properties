import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ScrollIndicator } from "@/components/hero/scroll-indicator";

function MaskedLine({ children }: { children: ReactNode }) {
  return <span className="chapter-line"><span>{children}</span></span>;
}

function StoryLabel({ children }: { children: ReactNode }) {
  return <p className="chapter-label">{children}</p>;
}

export function HeroStory() {
  return (
    <div className="hero-story">
      <section className="hero-chapter chapter-intro is-initial" data-chapter="intro" aria-labelledby="hero-title">
        <div className="chapter-local-scrim chapter-local-scrim-left light" />
        <div className="chapter-content intro-content">
          <StoryLabel>Elite Properties · Vrindavan</StoryLabel>
          <h1 id="hero-title" className="hero-display intro-title" aria-label="Find Your Place in Vrindavan.">
            <MaskedLine>Find your</MaskedLine>
            <MaskedLine>place.</MaskedLine>
          </h1>
          <p className="intro-categories">Residential · Commercial · Land · Investment</p>
        </div>
        <ScrollIndicator />
      </section>

      <section className="hero-chapter chapter-discover tone-ivory" data-chapter="discover" aria-labelledby="discover-title">
        <div className="chapter-local-scrim chapter-local-scrim-left" />
        <div className="chapter-content discover-content">
          <StoryLabel>01 / Discover</StoryLabel>
          <h2 id="discover-title" className="hero-display chapter-title">
            <MaskedLine>Every journey</MaskedLine>
            <MaskedLine>begins with</MaskedLine>
            <MaskedLine>a place.</MaskedLine>
          </h2>
        </div>
      </section>

      <section className="hero-chapter chapter-explore tone-ivory" data-chapter="explore" aria-labelledby="explore-title">
        <div className="chapter-local-scrim chapter-local-scrim-right" />
        <div className="chapter-content explore-content">
          <StoryLabel>02 / Explore</StoryLabel>
          <h2 id="explore-title" className="hero-display chapter-title">
            <MaskedLine>See more</MaskedLine>
            <MaskedLine>than four</MaskedLine>
            <MaskedLine>walls.</MaskedLine>
          </h2>
          <p className="chapter-support">Location. Lifestyle. Potential.</p>
        </div>
      </section>

      <section className="hero-chapter chapter-perspective tone-ink" data-chapter="perspective" aria-labelledby="perspective-title">
        <div className="chapter-local-scrim chapter-local-scrim-left light" />
        <div className="chapter-content perspective-content">
          <StoryLabel>Local knowledge / Real opportunity</StoryLabel>
          <h2 id="perspective-title" className="hero-display chapter-title">
            <MaskedLine>Property,</MaskedLine>
            <MaskedLine>with</MaskedLine>
            <MaskedLine>perspective.</MaskedLine>
          </h2>
        </div>
        <div className="perspective-metadata" aria-hidden="true">
          <span>Residential</span>
          <span>Commercial</span>
          <span>Land</span>
        </div>
      </section>

      <section className="hero-chapter chapter-experience tone-ink" data-chapter="experience" aria-labelledby="experience-title">
        <div className="chapter-local-scrim chapter-local-scrim-left light" />
        <div className="chapter-content experience-content">
          <StoryLabel>03 / Experience</StoryLabel>
          <h2 id="experience-title" className="sr-only">A home is not measured in square feet.</h2>
          <div className="experience-first hero-display" aria-hidden="true">
            <MaskedLine>A property is</MaskedLine>
            <MaskedLine>measured in</MaskedLine>
            <MaskedLine>square feet.</MaskedLine>
          </div>
          <div className="experience-second hero-display" aria-hidden="true">
            <MaskedLine>A home</MaskedLine>
            <MaskedLine>isn&apos;t.</MaskedLine>
          </div>
          <div className="mobile-experience hero-display" aria-hidden="true">
            <MaskedLine>A home isn&apos;t</MaskedLine>
            <MaskedLine>measured in</MaskedLine>
            <MaskedLine>square feet.</MaskedLine>
          </div>
        </div>
      </section>

      <section className="hero-chapter chapter-belong tone-ink" data-chapter="belong" aria-labelledby="belong-title">
        <div className="chapter-local-scrim chapter-local-scrim-center light" />
        <h2 id="belong-title" className="sr-only">Space to live, grow, and belong.</h2>
        <div className="belong-statements" aria-hidden="true">
          <p className="belong-statement" data-belong-statement="live"><MaskedLine>Space to live.</MaskedLine></p>
          <p className="belong-statement" data-belong-statement="grow"><MaskedLine>Space to grow.</MaskedLine></p>
          <p className="belong-statement" data-belong-statement="belong"><MaskedLine>Space to belong.</MaskedLine></p>
        </div>
      </section>

      <section className="hero-chapter chapter-brand tone-ink" data-chapter="brand" aria-labelledby="brand-title">
        <div className="chapter-local-scrim chapter-local-scrim-left light" />
        <div className="chapter-content brand-content">
          <StoryLabel>Elite Properties / Vrindavan</StoryLabel>
          <h2 id="brand-title" className="hero-display chapter-title">
            <MaskedLine>Local expertise.</MaskedLine>
            <MaskedLine>Considered</MaskedLine>
            <MaskedLine>property.</MaskedLine>
          </h2>
          <p className="chapter-support">Residential · Commercial · Plots · Land · Rental</p>
        </div>
      </section>

      <section className="hero-chapter chapter-final tone-ink" data-chapter="final" aria-labelledby="final-title">
        <div className="chapter-local-scrim chapter-local-scrim-left light" />
        <div className="chapter-content final-content">
          <StoryLabel>Elite Properties</StoryLabel>
          <h2 id="final-title" className="hero-display final-title">
            <MaskedLine>Find your</MaskedLine>
            <MaskedLine>place.</MaskedLine>
          </h2>
          <p className="final-location">Vrindavan · Mathura</p>
          <div className="final-actions">
            <Link className="hero-primary-cta" href="/properties">
              <span className="cta-swap" aria-hidden="true">
                <span>Explore properties</span>
                <span>Explore properties</span>
              </span>
              <span className="sr-only">Explore properties</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </Link>
            <Link className="hero-secondary-action" href="/contact">Talk to a property expert</Link>
          </div>
        </div>
        <div className="continue-indicator" aria-hidden="true">
          <ArrowDown size={14} strokeWidth={1.5} />
          <span>Continue</span>
        </div>
      </section>
    </div>
  );
}
