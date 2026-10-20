"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * The preference right now. In development it follows `?motion=reduce` instead, so both
 * paths can be checked without changing system settings.
 */
export function readPrefersReducedMotion() {
  if (process.env.NODE_ENV === "development") {
    return new URLSearchParams(window.location.search).get("motion") === "reduce";
  }
  return window.matchMedia(QUERY).matches;
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const updatePreference = () => setPrefersReducedMotion(readPrefersReducedMotion());

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}
