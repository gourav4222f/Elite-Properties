"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef } from "react";

import { gsap, motionDurations, motionEasings } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface ImageRevealProps extends ImageProps {
  frameClassName?: string;
}

export function ImageReveal({ className, frameClassName, alt, ...props }: ImageRevealProps) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: motionDurations.cinematic,
          ease: motionEasings.cinematic,
          scrollTrigger: { trigger: element, start: "top 82%", once: true },
        },
      );
      gsap.fromTo(
        ".image-reveal-media",
        { scale: 1.08 },
        {
          scale: 1,
          duration: motionDurations.cinematic,
          ease: motionEasings.cinematic,
          scrollTrigger: { trigger: element, start: "top 82%", once: true },
        },
      );
    }, element);

    return () => context.revert();
  }, []);

  return (
    <div ref={frame} className={cn("relative overflow-hidden", frameClassName)}>
      <Image
        {...props}
        alt={alt}
        className={cn("image-reveal-media object-cover", className)}
      />
    </div>
  );
}
