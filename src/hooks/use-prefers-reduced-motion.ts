"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const motionOverride = new URLSearchParams(window.location.search).get("motion");
    const isDevelopment = process.env.NODE_ENV === "development";
    const updatePreference = () => {
      if (isDevelopment) {
        setPrefersReducedMotion(motionOverride === "reduce");
        return;
      }

      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}
