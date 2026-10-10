import type { ReactNode } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { cn } from "@/lib/utils";

interface SectionHeadProps {
  label: string;
  title: readonly string[];
  offset?: readonly number[];
  intro?: ReactNode;
  id?: string;
  className?: string;
}

/** A chapter opening within a page: rule, masked display title and an introduction. */
export function SectionHead({ label, title, offset = [], intro, id, className }: SectionHeadProps) {
  return (
    <header className={cn("section-head", className)}>
      <div className="section-rule" data-reveal>
        <span>{label}</span>
        <i />
      </div>
      <h2 id={id} className="section-head-title" data-reveal-lines>
        <MaskedLines lines={title} offset={offset} />
      </h2>
      {intro ? (
        <div className="section-head-intro" data-reveal>
          {intro}
        </div>
      ) : null}
    </header>
  );
}
