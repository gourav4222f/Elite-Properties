export type SelectedSpaceImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  sizes: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
};

export const selectedSpaces = {
  arrive: {
    entrance: {
      id: "arrival-entrance",
      src: "/images/properties/gated-community-entrance-sunset.png",
      alt: "Landscaped residential entrance in warm evening light",
      caption: "Arrival / Landscape / Architecture",
      sizes: "(max-width: 767px) 100vw, 68vw",
      objectPosition: "center center",
      mobileObjectPosition: "58% center",
    },
    aerial: {
      id: "arrival-aerial",
      src: "/images/properties/aerial-view-luxury-residential-building-greenery.jpg",
      alt: "Contemporary residential building surrounded by dense greenery",
      caption: "Architecture among greenery",
      sizes: "(max-width: 767px) 72vw, 31vw",
      objectPosition: "center center",
      mobileObjectPosition: "58% center",
    },
  },
  crossing: {
    exterior: {
      id: "crossing-exterior",
      src: "/images/properties/luxury-apartment-building-sunset-balconies.png",
      alt: "Contemporary apartment building with planted balconies at dusk",
      sizes: "(max-width: 767px) 78vw, 48vw",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
    },
    interior: {
      id: "crossing-interior",
      src: "/images/interiors/living-room-modern-apartment-interior.webp",
      alt: "Contemporary living room with neutral seating and soft daylight",
      sizes: "(max-width: 767px) 88vw, 52vw",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
    },
  },
  live: {
    drawingRoom: {
      id: "live-drawing-room",
      src: "/images/interiors/luxury-drawing-room-sofa-dining-area.webp",
      alt: "Spacious drawing room with connected sofa and dining areas",
      sizes: "100vw",
      objectPosition: "center center",
      mobileObjectPosition: "68% center",
    },
    bedroom: {
      id: "live-bedroom",
      src: "/images/interiors/master-bedroom-wooden-panel-design.webp",
      alt: "Bedroom with warm wooden wall panels and integrated lighting",
      caption: "Material / Rest / Quiet",
      sizes: "(max-width: 767px) 78vw, 36vw",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
    },
    kitchen: {
      id: "live-kitchen",
      src: "/images/interiors/kitchen-dining-table-pendant-lights.webp",
      alt: "Modern kitchen dining area with pendant lights",
      sizes: "(max-width: 767px) 62vw, 25vw",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
    },
  },
  work: {
    exterior: {
      id: "work-exterior",
      src: "/images/commercial/commercial-complex-evening-view.webp",
      alt: "Modern commercial complex with geometric facade at evening",
      caption: "Commercial architecture / Evening",
      sizes: "(max-width: 767px) 100vw, 62vw",
      objectPosition: "center center",
      mobileObjectPosition: "55% center",
    },
    lobby: {
      id: "work-lobby",
      src: "/images/commercial/commercial-lobby-marble-floor-glass-wall.webp",
      alt: "Sunlit commercial lobby with marble floor and tall glass walls",
      sizes: "(max-width: 767px) 76vw, 34vw",
      objectPosition: "center center",
      mobileObjectPosition: "58% center",
    },
  },
  details: {
    chair: {
      id: "detail-chair",
      src: "/images/interiors/green-velvet-chair-closeup.webp",
      alt: "Close view of green woven upholstery and a wooden tabletop",
      caption: "Texture / Fabric / Shadow",
      sizes: "(max-width: 767px) 68vw, 27vw",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
    },
    curtain: {
      id: "detail-curtain",
      src: "/images/interiors/window-curtain-indoor-plant.webp",
      alt: "Soft curtains framing a small plant by a bright window",
      sizes: "(max-width: 767px) 86vw, 39vw",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
    },
    vanity: {
      id: "detail-vanity",
      src: "/images/interiors/bathroom-vanity-mirror-apartment.webp",
      alt: "Minimal bathroom vanity with an illuminated mirror",
      caption: "Light / Surface / Detail",
      sizes: "(max-width: 767px) 58vw, 24vw",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
    },
  },
} as const satisfies Record<string, Record<string, SelectedSpaceImage>>;
