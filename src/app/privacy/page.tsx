import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page/page-hero";
import { PageMotion } from "@/components/page/page-motion";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Elite Properties uses the details you share through this website.",
};

const LAST_UPDATED = "10 October 2026";

const sections = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: [
      "Elite Properties is a property partner based in Vrindavan, working with buyers, sellers, investors and tenants across Vrindavan and Mathura. This notice explains how we use the details you share with us through this website.",
    ],
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: [
      "When you send an enquiry, we receive what you enter in the form: your name, phone number, and, if you choose to give them, your email address and a message. We also receive the kind of help you selected and, where relevant, the property you were viewing.",
      "We do not ask for financial, identity or other sensitive information through this website. Please do not include it in your message.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    list: [
      "To contact you about your enquiry and the properties or services you asked about.",
      "To arrange conversations, visits and the next steps you request.",
      "To keep a record of our correspondence with you.",
    ],
    body: [
      "We do not sell your details, and we do not use them to send marketing you have not asked for. Where we introduce you to others to help with your request, such as a lender or legal professional, we will tell you first.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    body: [
      "This website does not use advertising or analytics cookies, and it does not track you across other sites. Your browser may store small technical files, such as cached images, so pages load quickly.",
      "Like most websites, our hosting records basic technical information, such as your IP address and the pages requested, to keep the site secure and working. These logs are kept only as long as needed for that purpose.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: [
      "We keep enquiry details for as long as we are helping you, and for a reasonable period afterwards in case you come back to us, unless the law requires us to keep them longer. After that, they are deleted.",
    ],
  },
  {
    id: "your-choices",
    title: "Your choices",
    body: [
      "You can ask us what details we hold about you, ask us to correct them, or ask us to delete them and stop contacting you. Send your request through our contact page and we will respond promptly.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this notice",
    body: [
      "If we change how we use your details, we will update this page and the date below. Significant changes will be made clear on the website.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <PageMotion>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
        title={["Your details,", "handled with care."]}
        offset={[1]}
        intro={<p>A plain account of what we collect through this website, why, and the choices you have.</p>}
        meta={[`Last updated ${LAST_UPDATED}`]}
      />

      <section className="pg-section legal" aria-label="Privacy notice">
        <nav className="legal-index" aria-label="On this page" data-reveal>
          <p className="pg-kicker">On this page</p>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="legal-body">
          {sections.map((section, index) => (
            <section className="legal-section" id={section.id} key={section.id} tabIndex={-1} aria-labelledby={`${section.id}-title`}>
              <span className="pg-rule" data-rule aria-hidden="true" />
              <span className="legal-number" data-reveal>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 id={`${section.id}-title`} data-reveal>
                {section.title}
              </h2>
              {"list" in section ? (
                <ul className="pg-list" data-reveal>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.body.map((paragraph) => (
                <p key={paragraph} data-reveal>
                  {paragraph}
                </p>
              ))}
              {section.id === "your-choices" ? (
                <p data-reveal>
                  <Link className="legal-link" href="/contact#enquiry">
                    Contact Elite Properties
                  </Link>
                </p>
              ) : null}
            </section>
          ))}
          <p className="pg-note" data-reveal>
            Last updated {LAST_UPDATED}.
          </p>
        </div>
      </section>
    </PageMotion>
  );
}
