"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";

import { ScrollTrigger } from "@/lib/gsap";

export interface FaqItem {
  question: string;
  answer: string;
}

/** Questions that open one at a time; the page re-measures once a panel settles. */
export function Faq({ items }: { items: readonly FaqItem[] }) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div className="faq-item" data-open={expanded} data-reveal key={item.question}>
            <h3>
              <button
                type="button"
                id={`${id}-q${index}`}
                aria-expanded={expanded}
                aria-controls={`${id}-a${index}`}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>{item.question}</span>
                <Plus aria-hidden="true" size={20} strokeWidth={1.25} />
              </button>
            </h3>
            <div
              className="faq-panel"
              id={`${id}-a${index}`}
              role="region"
              aria-labelledby={`${id}-q${index}`}
              inert={!expanded}
              onTransitionEnd={(event) => {
                if (event.propertyName === "grid-template-rows") ScrollTrigger.refresh();
              }}
            >
              <div>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
