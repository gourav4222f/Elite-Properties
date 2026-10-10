"use client";

import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { contactDetails, enquiryInterests, type EnquiryInterest } from "@/data/contact";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  ENQUIRE_EVENT,
  normalizeEnquiry,
  validateEnquiry,
  type EnquireDetail,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/enquiry";
import { gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { revealOnScroll } from "@/lib/reveal";

type FormStatus = "idle" | "sending" | "sent" | "error";

function FieldError({ field, errors }: { field: EnquiryField; errors: EnquiryErrors }) {
  return (
    <span className="contact-error" id={`enquiry-${field}-error`}>
      {errors[field] ?? ""}
    </span>
  );
}

interface ContactProps {
  id?: string;
  label?: string;
  title?: readonly string[];
  intro?: string;
  /** Pre-fills the enquiry, e.g. on a property's own page. */
  property?: string;
  interest?: EnquiryInterest;
}

const DEFAULT_INTRO =
  "Tell us what you are looking for, whether it is a home, a plot or a place for your business, and we will take it from there.";

export function Contact({
  id = "contact",
  label = "07 / Contact",
  title = ["Let's find", "your place."],
  intro = DEFAULT_INTRO,
  property: initialProperty = "",
  interest: initialInterest = enquiryInterests[0],
}: ContactProps = {}) {
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [interest, setInterest] = useState<EnquiryInterest>(initialInterest);
  const [property, setProperty] = useState(initialProperty);
  const [sentName, setSentName] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(root);
      if (!reducedMotion) revealOnScroll(root);
    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  // "Enquire" links elsewhere on the page hand over the property they came from.
  useEffect(() => {
    const handleEnquire = (event: Event) => {
      const { property: title, interest: nextInterest } = (event as CustomEvent<EnquireDetail>).detail;
      setProperty(title);
      if (nextInterest) setInterest(nextInterest);
      setStatus((current) => (current === "sent" ? "idle" : current));
    };

    window.addEventListener(ENQUIRE_EVENT, handleEnquire);
    return () => window.removeEventListener(ENQUIRE_EVENT, handleEnquire);
  }, []);

  useEffect(() => {
    if (status !== "sent" || reducedMotion || !confirmationRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".line-mask > span",
        { yPercent: 112 },
        { yPercent: 0, duration: 1, stagger: 0.1, ease: motionEasings.cinematic },
      );
      gsap.fromTo(
        "[data-confirmation-copy]",
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, delay: 0.3, ease: motionEasings.enter },
      );
    }, confirmationRef.current);
    return () => context.revert();
  }, [status, reducedMotion]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const enquiry = normalizeEnquiry({ ...Object.fromEntries(new FormData(form)), property });
    const nextErrors = validateEnquiry(enquiry);
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(nextErrors) as EnquiryField[])[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; errors?: EnquiryErrors };

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        setStatus("error");
        return;
      }

      setSentName(enquiry.name.split(" ")[0]);
      setProperty("");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const describedBy = (field: EnquiryField) => (errors[field] ? `enquiry-${field}-error` : undefined);

  return (
    <section ref={rootRef} id={id} className="contact" aria-labelledby={`${id}-title`} data-motion-owner>
      <div className="contact-heading">
        <div className="section-rule" data-reveal>
          <span>{label}</span>
          <i />
        </div>
        <h2 id={`${id}-title`} className="contact-title" data-reveal-lines>
          <MaskedLines lines={title} />
        </h2>
        <p className="contact-intro" data-reveal>
          {intro}
        </p>

        <dl className="contact-details">
          <div data-reveal>
            <dt>Office</dt>
            <dd>
              {contactDetails.office.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </dd>
          </div>
          <div data-reveal>
            <dt>Areas</dt>
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
      </div>

      <div className="contact-panel">
        {status === "sent" ? (
          <div ref={confirmationRef} className="contact-confirmation" role="status">
            <p className="contact-confirmation-kicker" data-confirmation-copy>
              Enquiry received
            </p>
            <p className="contact-confirmation-title">
              <MaskedLines lines={[`Thank you${sentName ? `, ${sentName}` : ""}.`, "We'll be in touch."]} />
            </p>
            <p className="contact-confirmation-copy" data-confirmation-copy>
              Your details are with the Elite Properties team. Expect a call to talk through what you are
              looking for.
            </p>
            <button
              type="button"
              className="finder-submit"
              data-confirmation-copy
              onClick={() => setStatus("idle")}
            >
              <span className="intent-link-swap">
                <span>Send another enquiry</span>
                <span aria-hidden="true">Send another enquiry</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate aria-describedby="enquiry-status">
            {property ? (
              <div className="contact-regarding">
                <span>Regarding</span>
                <strong>{property}</strong>
                <button type="button" onClick={() => setProperty("")} aria-label={`Remove ${property} from this enquiry`}>
                  <X aria-hidden="true" size={14} strokeWidth={1.5} />
                </button>
              </div>
            ) : null}

            <div className="contact-fields">
              <label className="finder-field contact-field" data-reveal>
                <span>Your name</span>
                <span className="finder-select-wrap contact-input-wrap">
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy("name")}
                  />
                </span>
                <FieldError field="name" errors={errors} />
              </label>

              <label className="finder-field contact-field" data-reveal>
                <span>Phone</span>
                <span className="finder-select-wrap contact-input-wrap">
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={describedBy("phone")}
                  />
                </span>
                <FieldError field="phone" errors={errors} />
              </label>

              <label className="finder-field contact-field" data-reveal>
                <span>
                  Email <em>Optional</em>
                </span>
                <span className="finder-select-wrap contact-input-wrap">
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={describedBy("email")}
                  />
                </span>
                <FieldError field="email" errors={errors} />
              </label>

              <label className="finder-field contact-field" data-reveal>
                <span>I need help with</span>
                <span className="finder-select-wrap contact-input-wrap">
                  <select
                    name="interest"
                    value={interest}
                    onChange={(event) => setInterest(event.target.value as EnquiryInterest)}
                    aria-invalid={Boolean(errors.interest)}
                    aria-describedby={describedBy("interest")}
                  >
                    {enquiryInterests.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
                </span>
                <FieldError field="interest" errors={errors} />
              </label>

              <label className="finder-field contact-field contact-field-wide" data-reveal>
                <span>
                  Tell us more <em>Optional</em>
                </span>
                <span className="finder-select-wrap contact-input-wrap">
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Location, budget, timing, anything that matters to you"
                  />
                </span>
              </label>

              <label className="contact-honeypot" aria-hidden="true">
                Company
                <input name="company" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <button className="finder-submit contact-submit" type="submit" disabled={status === "sending"} data-reveal>
              <span className="intent-link-swap">
                <span>{status === "sending" ? "Sending…" : "Send enquiry"}</span>
                <span aria-hidden="true">{status === "sending" ? "Sending…" : "Send enquiry"}</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
            <p id="enquiry-status" className="finder-status" aria-live="polite">
              {status === "error"
                ? "Something went wrong sending your enquiry. Please check your details and try again."
                : Object.keys(errors).length > 0
                  ? "Please check the highlighted fields."
                  : ""}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
