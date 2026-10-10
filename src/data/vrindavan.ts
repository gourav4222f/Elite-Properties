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

export interface Neighbourhood {
  id: string;
  number: string;
  name: string;
  character: string;
  detail: string;
  suits: string;
}

// Broad character sketches for orientation; specific streets and projects vary.
export const neighbourhoods: readonly Neighbourhood[] = [
  {
    id: "central-vrindavan",
    number: "01",
    name: "Central Vrindavan",
    character: "The old heart of the city, around its temples, ghats and the parikrama route.",
    detail:
      "Lanes, ashrams and long-established neighbourhoods, for those who want daily darshan within walking distance.",
    suits: "Devotees · Long stays · Heritage homes",
  },
  {
    id: "raman-reti",
    number: "02",
    name: "Raman Reti",
    character: "A lively, international neighbourhood around the ISKCON temple.",
    detail: "Guest houses, cafés and newer apartments, with steady demand from visitors and long-stay residents.",
    suits: "Second homes · Rentals · Community living",
  },
  {
    id: "chhatikara-road",
    number: "03",
    name: "Chhatikara Road",
    character: "The main approach into Vrindavan from NH-19.",
    detail: "Where many of the newer residential projects and commercial frontages are taking shape.",
    suits: "New apartments · Commercial · Investment",
  },
  {
    id: "mathura-vrindavan-road",
    number: "04",
    name: "Mathura–Vrindavan Road",
    character: "The corridor that links the two cities.",
    detail: "Growing residential communities and plots, with easy access to both Vrindavan and Mathura.",
    suits: "Families · Plots · Commuters",
  },
  {
    id: "mathura",
    number: "05",
    name: "Mathura",
    character: "The district headquarters and its railway junction.",
    detail: "Established markets, civic services and the region's main rail connections.",
    suits: "Commercial · Rentals · Everyday convenience",
  },
] as const;

export const routeStops = ["Vrindavan", "Chhatikara Road", "NH-19", "Mathura", "Yamuna Expressway"] as const;

export interface LivingMoment {
  title: string;
  caption: string;
  image: { src: string; alt: string };
}

export const livingMoments: readonly LivingMoment[] = [
  {
    title: "Green, walkable streets",
    caption: "Neighbourhoods planned around parks, trees and the evening walk.",
    image: {
      src: "/images/lifestyle/family-walking-residential-park.png",
      alt: "Family walking together along a tree-lined residential path",
    },
  },
  {
    title: "Terraces made for evenings",
    caption: "Open skies and planted terraces that make the most of the climate.",
    image: {
      src: "/images/lifestyle/rooftop-garden-terrace-aerial.webp",
      alt: "Aerial view of a planted rooftop garden terrace",
    },
  },
  {
    title: "Places to gather",
    caption: "Restaurants and cafés serving a city that welcomes visitors all year.",
    image: {
      src: "/images/commercial/restaurant-dining-hall-city-view.webp",
      alt: "Bright dining hall with tables set beside tall windows",
    },
  },
  {
    title: "Homes with light and calm",
    caption: "Interiors that trade the bustle outside for quiet within.",
    image: {
      src: "/images/interiors/living-room-balcony-city-view.webp",
      alt: "Living room opening onto a balcony with a city view",
    },
  },
] as const;

export const outlookNotes: readonly { title: string; description: string }[] = [
  {
    title: "Demand that is not seasonal",
    description:
      "Pilgrims, visitors and long-stay residents arrive throughout the year, supporting rentals and hospitality.",
  },
  {
    title: "Connections catching up",
    description: "Road links to Delhi NCR and Agra keep improving, widening who can live here and how often they visit.",
  },
  {
    title: "Room still to grow",
    description: "The corridors around the city still offer plots and frontage that central areas no longer can.",
  },
] as const;
