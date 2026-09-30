"use client";

import { useEffect, useRef, type ElementType } from "react";

import { gsap, motionDurations, motionEasings } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  as?: ElementType;
  children: string;
  className?: string;
  triggerOnScroll?: boolean;
}

export function TextReveal({
  as: Component = "span",
  children,
  className,
  triggerOnScroll = false,
}: TextRevealProps) {
  const root = useRef<HTMLElement | null>(null);
  const words = children.split(" ");

  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".text-reveal-word",
        { opacity: 0, yPercent: 75 },
        {
          opacity: 1,
          yPercent: 0,
          duration: motionDurations.slow,
          ease: motionEasings.enter,
          stagger: 0.045,
          scrollTrigger: triggerOnScroll
            ? { trigger: element, start: "top 82%", once: true }
            : undefined,
        },
      );
    }, element);

    return () => context.revert();
  }, [triggerOnScroll]);

  return (
    <Component ref={root} className={cn("text-reveal", className)} aria-label={children}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
          <span className="text-reveal-word inline-block">{word}</span>
          {index < words.length - 1 ? <>&nbsp;</> : null}
        </span>
      ))}
    </Component>
  );
}
