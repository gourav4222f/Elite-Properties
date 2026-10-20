"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { frequentQuestions } from "@/data/contact";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/reveal";
import { cn } from "@/lib/utils";

export function ContactFaq() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const context = gsap.context(() => revealOnScroll(root), root);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="faq" aria-labelledby="faq-title">
      <div className="faq-heading">
        <div className="section-rule" data-reveal>
          <span>04 / Questions</span>
          <i />
        </div>
        <h2 id="faq-title" className="faq-title" data-reveal-lines>
          <MaskedLines lines={["Before you", "call us."]} />
        </h2>
      </div>

      <ul className="faq-list">
        {frequentQuestions.map((item, index) => {
          const open = openIndex === index;
          return (
            <li key={item.question} className={cn("faq-item", open && "is-open")} data-reveal>
              <h3>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={open}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span>{item.question}</span>
                  <Plus aria-hidden="true" size={20} strokeWidth={1.25} />
                </button>
              </h3>
              <div
                id={`faq-answer-${index}`}
                className="faq-answer"
                inert={!open}
                // Content below moves as an answer opens, so trigger positions are re-measured.
                onTransitionEnd={(event) => {
                  if (event.propertyName === "grid-template-rows") ScrollTrigger.refresh();
                }}
              >
                <div>
                  <p>{item.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
