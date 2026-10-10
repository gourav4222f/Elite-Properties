export interface PlaceReason {
  id: string;
  number: string;
  title: string;
  summary: string;
  tags: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface DriveTime {
  place: string;
  value: string;
  unit: string;
}

export const placeReasons: readonly PlaceReason[] = [
  {
    id: "rooted",
    number: "01",
    title: "Rooted",
    summary:
      "Live among neighbours who share a pace of life shaped by faith, family and the festivals that bring the city together.",
    tags: "Temples · Ghats · Community",
    image: {
      src: "/images/lifestyle/family-walking-residential-park.png",
      alt: "Family walking together along a tree-lined residential path",
    },
  },
  {
    id: "connected",
    number: "02",
    title: "Connected",
    summary:
      "Mathura Junction, NH-19 and the Yamuna Expressway keep Agra and Delhi NCR within a comfortable journey.",
    tags: "Rail · NH-19 · Yamuna Expressway",
    image: {
      src: "/images/infrastructure/metro-train-railway-station.webp",
      alt: "Passenger train arriving at a modern railway platform",
    },
  },
  {
    id: "growing",
    number: "03",
    title: "Growing",
    summary:
      "New residential communities, retail and commercial frontage are reshaping the Mathura–Vrindavan corridor.",
    tags: "Residential · Retail · Commercial",
    image: {
      src: "/images/commercial/shopping-mall-high-rise-complex.webp",
      alt: "Contemporary retail building beside a residential tower",
    },
  },
  {
    id: "greener",
    number: "04",
    title: "Greener",
    summary:
      "Quieter addresses with gardens, terraces and open skies, with the conveniences of a growing city still close by.",
    tags: "Gardens · Terraces · Open skies",
    image: {
      src: "/images/lifestyle/rooftop-garden-terrace-aerial.webp",
      alt: "Aerial view of a planted rooftop garden terrace",
    },
  },
] as const;

// Approximate road journeys from central Vrindavan; confirm before relying on them.
export const driveTimes: readonly DriveTime[] = [
  { place: "Mathura Junction", value: "30", unit: "min" },
  { place: "Agra", value: "1.5", unit: "hrs" },
  { place: "Noida", value: "2.5", unit: "hrs" },
  { place: "New Delhi", value: "3", unit: "hrs" },
] as const;
