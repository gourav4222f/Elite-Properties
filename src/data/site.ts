/**
 * The site reads as one story told in chapters. Navigation, the page-turn curtain and the
 * "next chapter" band at the foot of each page all come from this map.
 */
export type ChapterKey = "home" | "about" | "vrindavan" | "properties" | "services" | "contact";

export interface Chapter {
  key: ChapterKey;
  href: string;
  label: string;
  /** What the chapter answers, shown above its title in the next-chapter band. */
  theme: string;
  title: readonly string[];
  summary: string;
  image: { src: string; alt: string };
}

export const chapters: Record<ChapterKey, Chapter> = {
  home: {
    key: "home",
    href: "/",
    label: "Home",
    theme: "Back to the beginning",
    title: ["Find your", "place."],
    summary: "Return to the start of the story, from the first step through the gate.",
    image: {
      src: "/images/properties/gated-community-entrance-sunset.png",
      alt: "Landscaped residential entrance in warm evening light",
    },
  },
  about: {
    key: "about",
    href: "/about",
    label: "About",
    theme: "Who we are",
    title: ["Rooted in", "Vrindavan."],
    summary: "A local property partner, and the principles behind every recommendation we make.",
    image: {
      src: "/images/interiors/window-curtain-indoor-plant.webp",
      alt: "Soft curtains framing a small plant by a bright window",
    },
  },
  vrindavan: {
    key: "vrindavan",
    href: "/vrindavan",
    label: "Vrindavan",
    theme: "Where",
    title: ["A place with", "a pull of its own."],
    summary: "The neighbourhoods, connections and everyday life that make the region worth choosing.",
    image: {
      src: "/images/lifestyle/family-walking-residential-park.png",
      alt: "Family walking together along a tree-lined residential path",
    },
  },
  properties: {
    key: "properties",
    href: "/properties",
    label: "Properties",
    theme: "What",
    title: ["Places worth", "your attention."],
    summary: "A considered selection of homes, plots and commercial spaces across Vrindavan and Mathura.",
    image: {
      src: "/images/interiors/luxury-drawing-room-sofa-dining-area.jpg",
      alt: "Calm drawing room with a sectional sofa beside a dining table under brass pendants",
    },
  },
  services: {
    key: "services",
    href: "/services",
    label: "Services",
    theme: "How",
    title: ["From search", "to signature."],
    summary: "Shortlists, visits, finance, paperwork and management, coordinated by one local team.",
    image: {
      src: "/images/commercial/commercial-lobby-marble-floor-glass-wall.webp",
      alt: "Sunlit lobby with a marble floor and tall glass walls",
    },
  },
  contact: {
    key: "contact",
    href: "/contact",
    label: "Contact",
    theme: "Begin",
    title: ["Let's find", "your place."],
    summary: "Tell us what you are looking for, and we will take it from there.",
    image: {
      src: "/images/interiors/green-velvet-chair-closeup.webp",
      alt: "Close view of green woven upholstery and a wooden tabletop",
    },
  },
};

/** The order a visitor is guided through the inner pages. */
const storyOrder: readonly ChapterKey[] = ["home", "about", "vrindavan", "properties", "services", "contact"];

export function nextChapter(key: ChapterKey): Chapter {
  const index = storyOrder.indexOf(key);
  return chapters[storyOrder[(index + 1) % storyOrder.length]];
}

export const primaryNavigation = (["properties", "vrindavan", "services", "about", "contact"] as const).map(
  (key) => chapters[key],
);

/** The chapter a path belongs to, used for the active link and the page-turn caption. */
export function chapterForPath(pathname: string): Chapter | null {
  if (pathname === "/") return chapters.home;
  const match = Object.values(chapters).find((chapter) => chapter.href !== "/" && pathname.startsWith(chapter.href));
  return match ?? null;
}
