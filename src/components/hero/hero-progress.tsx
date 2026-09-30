import type { RefObject } from "react";

interface HeroProgressProps {
  fillRef: RefObject<HTMLSpanElement | null>;
  numberRef: RefObject<HTMLSpanElement | null>;
}

export function HeroProgress({ fillRef, numberRef }: HeroProgressProps) {
  return (
    <div className="hero-progress" aria-hidden="true">
      <span ref={numberRef} className="hero-progress-number">01</span>
      <span className="hero-progress-track"><span ref={fillRef} /></span>
      <span className="hero-progress-total">08</span>
    </div>
  );
}
