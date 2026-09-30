import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const motionDurations = {
  fast: 0.24,
  base: 0.48,
  slow: 0.8,
  cinematic: 1.2,
} as const;

export const motionEasings = {
  standard: "power2.out",
  enter: "power3.out",
  exit: "power2.in",
  cinematic: "power4.inOut",
} as const;

export { gsap, ScrollTrigger };
