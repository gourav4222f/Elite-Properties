import type { Metadata } from "next";
import Image from "next/image";

import { IntentLink } from "@/components/page/intent-link";
import { NextChapter } from "@/components/page/next-chapter";
import { PageHero } from "@/components/page/page-hero";
import { PageMotion } from "@/components/page/page-motion";
import { SectionHead } from "@/components/page/section-head";
import { listings } from "@/data/listings";
import { chapters, nextChapter } from "@/data/site";
import { driveTimes, livingMoments, neighbourhoods, outlookNotes, placeReasons, routeStops } from "@/data/vrindavan";

export const metadata: Metadata = {
  title: "Vrindavan",
  description:
    "Why Vrindavan and Mathura: the neighbourhoods, connections and everyday life that make the region worth choosing.",
};

export default function VrindavanPage() {
  return (
    <PageMotion>
      <PageHero
        variant="image"
        crumbs={[{ label: "Home", href: "/" }, { label: "Vrindavan" }]}
        title={chapters.vrindavan.title}
        offset={[1]}
        intro={
          <p>
            A sacred city that is also a growing one. Vrindavan and Mathura bring together faith, family
            and a future still taking shape, with Delhi NCR and Agra within reach.
          </p>
        }
        meta={["Mathura district, Uttar Pradesh", "On the Yamuna", "Near NH-19 & the Yamuna Expressway"]}
        image={{ ...chapters.vrindavan.image, position: "center 55%" }}
      />

      <section className="pg-section place-why" aria-labelledby="place-why-title">
        <SectionHead
          id="place-why-title"
          label="01 / Why here"
          title={["Four reasons", "to choose it."]}
          offset={[1]}
          intro={
            <p>
              People come for the city&rsquo;s spirit and stay for a quality of life that is harder to find
              elsewhere.
            </p>
          }
        />
        <ol className="reason-cards">
          {placeReasons.map((reason, index) => (
            <li className="reason-card" key={reason.id}>
              <figure className="pg-image reason-card-image" data-image="up" data-parallax={index % 2 ? 5 : 3}>
                <Image src={reason.image.src} alt={reason.image.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw" />
              </figure>
              <span className="reason-card-number" data-reveal>
                {reason.number}
              </span>
              <h3 className="reason-card-title" data-reveal-lines>
                <span className="line-mask">
                  <span>{reason.title}</span>
                </span>
              </h3>
              <p className="reason-card-copy" data-reveal>
                {reason.summary}
              </p>
              <p className="pg-tags" data-reveal>
                {reason.tags}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="neighbourhoods" className="pg-section areas" aria-labelledby="areas-title" tabIndex={-1}>
        <p className="areas-word" aria-hidden="true" data-drift="8">
          Braj
        </p>
        <SectionHead
          id="areas-title"
          label="02 / Neighbourhoods"
          title={["Know the", "ground."]}
          offset={[1]}
          intro={
            <p>
              Each part of the region has its own character. A broad sketch of each, to help you decide
              where to look first.
            </p>
          }
        />
        <ol className="areas-list">
          {neighbourhoods.map((area) => {
            const count = listings.filter((property) => property.neighbourhood === area.id).length;
            return (
              <li className="area" id={area.id} key={area.id} tabIndex={-1}>
                <span className="pg-rule" data-rule aria-hidden="true" />
                <span className="area-number" data-reveal>
                  {area.number}
                </span>
                <h3 className="area-name" data-reveal-lines>
                  <span className="line-mask">
                    <span>{area.name}</span>
                  </span>
                </h3>
                <div className="area-copy" data-reveal>
                  <p className="area-character">{area.character}</p>
                  <p>{area.detail}</p>
                </div>
                <div className="area-meta" data-reveal>
                  <p className="pg-tags">{area.suits}</p>
                  {count ? (
                    <p className="area-count">
                      {count} {count === 1 ? "listing" : "listings"} here
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="pg-note" data-reveal>
          Neighbourhood descriptions are a general guide. Specific streets, projects and approvals vary, and
          we will talk you through them for any property you consider.
        </p>
      </section>

      <section className="routes" data-header-ivory aria-labelledby="routes-title">
        <figure className="routes-media" data-image="none" data-parallax="7">
          <Image
            src="/images/infrastructure/city-highway-flyover-night-aerial.jpg"
            alt=""
            fill
            sizes="100vw"
          />
        </figure>
        <div className="routes-content">
          <div className="section-rule" data-reveal>
            <span>03 / Getting here</span>
            <i />
          </div>
          <h2 id="routes-title" className="routes-title" data-reveal-lines>
            <span className="line-mask">
              <span>Close to</span>
            </span>
            <span className="line-mask line-mask-offset">
              <span>everything.</span>
            </span>
          </h2>
          <div className="route-line">
            <span className="route-line-track" data-rule aria-hidden="true" />
            <ol className="route-stops" aria-label="The corridor, from Vrindavan outward">
              {routeStops.map((stop) => (
                <li key={stop} data-reveal>
                  {stop}
                </li>
              ))}
            </ol>
          </div>
          <ul className="place-drive-times routes-times" aria-label="Approximate drive times from central Vrindavan">
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
          <p className="place-connect-note routes-note" data-reveal>
            Approximate road journeys from central Vrindavan. Times vary with traffic and route.
          </p>
        </div>
      </section>

      <section className="pg-section living" aria-labelledby="living-title">
        <SectionHead
          id="living-title"
          label="04 / Everyday life"
          title={["Life, at", "an easier pace."]}
          offset={[1]}
        />
        <ul className="living-grid">
          {livingMoments.map((moment, index) => (
            <li className={`living-item living-item-${index + 1}`} key={moment.title}>
              <figure className="pg-image living-image" data-image={index % 2 ? "left" : "up"} data-parallax={index % 2 ? 4 : 6}>
                <Image
                  src={moment.image.src}
                  alt={moment.image.alt}
                  fill
                  sizes={index === 0 || index === 3 ? "(max-width: 767px) 100vw, 56vw" : "(max-width: 767px) 100vw, 34vw"}
                />
              </figure>
              <div className="living-caption" data-reveal>
                <h3>{moment.title}</h3>
                <p>{moment.caption}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="pg-section pg-band pg-band--surface outlook" aria-labelledby="outlook-title">
        <SectionHead
          id="outlook-title"
          label="05 / The outlook"
          title={["Why now."]}
          intro={
            <p>
              The region is changing, and the reasons to look closely are practical as well as personal.
            </p>
          }
        />
        <ol className="outlook-notes">
          {outlookNotes.map((note, index) => (
            <li key={note.title}>
              <span className="pg-rule" data-rule aria-hidden="true" />
              <span className="outlook-number" data-reveal>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 data-reveal>{note.title}</h3>
              <p data-reveal>{note.description}</p>
            </li>
          ))}
        </ol>
        <div className="pg-actions outlook-actions" data-reveal>
          <p className="pg-note">
            This is general context, not investment advice. Every property deserves its own due diligence.
          </p>
          <IntentLink href="/contact" label="Talk it through with us" />
        </div>
      </section>

      <NextChapter chapter={nextChapter("vrindavan")} />
    </PageMotion>
  );
}
