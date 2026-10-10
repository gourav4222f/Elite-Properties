import type { Metadata } from "next";
import Image from "next/image";

import { Faq } from "@/components/page/faq";
import { IntentLink } from "@/components/page/intent-link";
import { NextChapter } from "@/components/page/next-chapter";
import { PageHero } from "@/components/page/page-hero";
import { PageMotion } from "@/components/page/page-motion";
import { SectionHead } from "@/components/page/section-head";
import { Contact } from "@/components/sections/contact/contact";
import { contactDetails } from "@/data/contact";
import { contactFaqs } from "@/data/faqs";
import { chapters, nextChapter } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Elite Properties what you are looking for in Vrindavan or Mathura, and arrange a conversation or a private visit.",
};

const nextSteps = [
  {
    number: "01",
    title: "We call you back",
    description: "Someone from the team reads your enquiry and calls you to talk it through, at a time that suits you.",
  },
  {
    number: "02",
    title: "We understand the brief",
    description: "What you need, how you will use it, your budget and timing. Nothing is assumed, and nothing is pushed.",
  },
  {
    number: "03",
    title: "We come back with options",
    description: "A short, considered set of next steps: properties worth seeing, a visit plan, or simply honest advice.",
  },
] as const;

export default function ContactPage() {
  return (
    <PageMotion>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title={chapters.contact.title}
        offset={[1]}
        intro={
          <p>
            Whether you are buying, selling, renting or simply exploring, the first step is a conversation. Tell
            us a little, and we will take it from there.
          </p>
        }
        meta={[contactDetails.serviceAreas, contactDetails.visits, "No obligation"]}
        image={{ ...chapters.contact.image, position: "center 45%" }}
      />

      <Contact
        id="enquiry"
        label="01 / Send an enquiry"
        title={["Tell us", "a little."]}
        intro="Share as much or as little as you like. A name and a phone number are all we need to call you back."
      />

      <section className="pg-section pg-band pg-band--surface after-enquiry" aria-labelledby="after-enquiry-title">
        <SectionHead
          id="after-enquiry-title"
          label="02 / What happens next"
          title={["After you", "get in touch."]}
          offset={[1]}
        />
        <div className="step-track step-track--three">
          <span className="step-track-line" data-rule aria-hidden="true" />
          <ol className="step-list">
            {nextSteps.map((step) => (
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
      </section>

      <section className="pg-band pg-band--forest visit" data-header-ivory aria-labelledby="visit-title">
        <figure className="pg-image visit-image" data-image="up" data-parallax="6">
          <Image
            src="/images/commercial/reception-lobby-marble-desk.webp"
            alt="Calm reception lobby with a marble desk and sculptural lighting"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </figure>
        <div className="visit-copy">
          <div className="section-rule" data-reveal>
            <span>03 / Meet us</span>
            <i />
          </div>
          <h2 id="visit-title" className="visit-title" data-reveal-lines>
            <span className="line-mask">
              <span>Come and</span>
            </span>
            <span className="line-mask">
              <span>say hello.</span>
            </span>
          </h2>
          <p className="visit-intro" data-reveal>
            Meetings and site visits are by appointment, so the right person is there to meet you, whether you
            are local or travelling in from Delhi NCR.
          </p>
          <dl className="visit-details">
            <div data-reveal>
              <dt>Office</dt>
              <dd>
                {contactDetails.office.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </dd>
            </div>
            <div data-reveal>
              <dt>We cover</dt>
              <dd>{contactDetails.serviceAreas}</dd>
            </div>
            <div data-reveal>
              <dt>Visits</dt>
              <dd>{contactDetails.visits}</dd>
            </div>
            {contactDetails.phone ? (
              <div data-reveal>
                <dt>Call</dt>
                <dd>
                  <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>{contactDetails.phone}</a>
                </dd>
              </div>
            ) : null}
            {contactDetails.email ? (
              <div data-reveal>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
                </dd>
              </div>
            ) : null}
          </dl>
          <div className="pg-actions" data-reveal>
            <IntentLink href="/vrindavan#neighbourhoods" label="Get to know the area" />
          </div>
        </div>
      </section>

      <section className="pg-section questions" aria-labelledby="contact-questions-title">
        <div className="pg-sticky-grid">
          <div className="pg-sticky">
            <SectionHead
              id="contact-questions-title"
              label="04 / Before you write"
              title={["A few", "answers."]}
            />
            <div className="pg-actions" data-reveal>
              <IntentLink href="/privacy" label="Read our privacy notice" />
            </div>
          </div>
          <Faq items={contactFaqs} />
        </div>
      </section>

      <NextChapter chapter={nextChapter("contact")} />
    </PageMotion>
  );
}
