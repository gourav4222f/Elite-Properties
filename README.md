# Elite Properties

Production foundation for the Elite Properties website in Vrindavan, Mathura.

## Development

```bash
npm run dev
```

Open `http://localhost:3000` to view the cinematic scroll-driven hero.

## Pages

The site reads as one story in chapters. `src/data/site.ts` holds the chapter map that drives the navigation, the page-turn curtain and the "next chapter" band that closes every page; each page's opening image is the one its preceding chapter shows.

| Route | Page | Story role |
| --- | --- | --- |
| `/` | `app/page.tsx` | The cinematic opening |
| `/about` | `app/about/page.tsx` | Who we are: philosophy, principles, coverage, working with us |
| `/vrindavan` | `app/vrindavan/page.tsx` | Where: reasons, neighbourhoods (`#central-vrindavan` …), connections, everyday life, outlook |
| `/properties` | `app/properties/page.tsx` | What: the collection with category and city filters, types, off-market |
| `/properties/[slug]` | `app/properties/[slug]/page.tsx` | One property: facts, overview, gallery, neighbourhood, enquiry (`#enquire`), similar listings |
| `/services` | `app/services/page.tsx` | How: six services (`#buying-selling` …), the journey, questions |
| `/contact` | `app/contact/page.tsx` | Begin: enquiry form (`#enquiry`), next steps, visits, questions |
| `/privacy` | `app/privacy/page.tsx` | Privacy notice |
| any other | `app/not-found.tsx` | Chapter index |

Property pages are generated at build time from `src/data/properties.json`; add a listing there (with `neighbourhood`, `overview` and `gallery`) and its page, card and filters follow. The Properties filters live in the address bar (`/properties?category=rental&location=mathura`), so the homepage finder, the footer and shared links all open the same view.

Inner pages are server components wrapped in `components/page/page-motion.tsx`, which applies the homepage's motion language through data attributes (documented in that file). Their styles live in `src/styles/pages.css`.

## Homepage structure

| Section | Component | Anchor |
| --- | --- | --- |
| Cinematic hero | `components/hero/hero-sequence.tsx` | – |
| 01 What we do + property finder | `sections/property-intent` | `#properties`, `#property-finder` |
| 02 Why Vrindavan | `sections/why-vrindavan` | `#vrindavan` |
| 03 About | `sections/about` | `#about` |
| 04 How we help | `sections/property-journey` | `#services` |
| 05 Selected spaces | `sections/selected-spaces` | `#selected-spaces` |
| 06 Selected properties | `sections/selected-properties` | `#selected-properties` |
| 07 Contact | `sections/contact` | `#contact` |
| Footer | `components/layout/footer.tsx` | – |

Content lives in `src/data` (`properties.json`, `vrindavan.ts`, `about.ts`, `services.ts`, `faqs.ts`, `contact.ts`). The listings, gallery images, drive times, neighbourhood sketches and contact details are starting content: confirm or replace them before launch. The privacy notice (`app/privacy/page.tsx`) describes the site as built and should be reviewed by someone qualified before launch. Add `phone` and `email` to `src/data/contact.ts` and they appear in the contact section and footer.

## Enquiries

The contact form validates in the browser and posts to `POST /api/enquiry` (`src/app/api/enquiry/route.ts`), which validates again and currently writes each enquiry to the server log. Connect the marked delivery point in that file to email or a CRM before going live. "Enquire" links on listings pre-fill the form with the property they came from.

## Motion

- Lenis drives smooth scrolling through GSAP's ticker. It hands positions to ScrollTrigger only while it is animating the scroll itself; native touch and keyboard scrolling reach ScrollTrigger directly, so each scroll is processed once.
- Every scroll-linked animation uses `getScrub()` (`src/lib/gsap.ts`): it follows wheel input directly (Lenis already smooths it) and adds a light lerp for native touch scrolling.
- In-page `#hash` links (including `/contact#enquiry` while on `/contact`) are handled once in `smooth-scroll-provider.tsx` so they glide to the exact section, honouring `scroll-margin-top`.
- Links to another page turn it (`components/layout/page-transition.tsx`): an ink curtain rises with the destination chapter's name, the route changes beneath it, and the new page's opening plays as the curtain lifts. Back and forward keep the browser's own scroll restoration; reduced-motion visitors navigate without the curtain.
- Images share one treatment in `src/lib/image-motion.ts`. Mark the clipping frame with `data-image="up" | "left" | "none"` and optionally `data-parallax="n"`. The frame opens with a clip as it enters while the photograph settles from a gentle zoom, waiting for the image to decode first. The photograph then drifts `n`% of its height, overscaled so its edges never show (60% of that on phones).
- Copy and headline reveals for the later sections share `src/lib/reveal.ts` (`data-reveal`, `data-reveal-lines`).
- Dark bands register with `createIvoryHeaderZone` (`src/lib/header-tone.ts`) so the fixed header stays legible.
- Every animated section has a `prefers-reduced-motion` path that leaves content static and fully visible.

## Hero frame sequence

The hero renders `public/frames/frame_0001.webp` through `frame_0720.webp` in one canvas.

- A Web Worker (`src/workers/frame-loader.worker.ts`) fetches and decodes frames with `createImageBitmap` and transfers them to the page, so the main thread only draws. Browsers without worker decoding fall back to decoding on the page.
- The first 24 frames are loader-critical. Next, the worker builds a low-resolution keyframe for every 12th frame, a stand-in shown while a full frame is still loading, so the footage keeps pace with the scroll even on a first visit over a slow connection. The remaining frames are then fetched into the HTTP cache, coarse to fine, without decoding.
- Near the playhead, frames ahead in the direction of travel are decoded first. The window reaches further the faster the scroll and thins out with distance.
- Decoded frames are bounded (64 on desktop, 40 on phones, 24 on low-memory devices) and released when the main thread is idle.
- The canvas is drawn at most once per frame, after the scroll update and the story timeline. Its backing store is capped near the 1280×720 source resolution.
- The story timeline follows the scroll directly (no extra scrub smoothing) and is pre-initialised behind the loader.
- The stage stays pinned while the first section slides over it, receding and dimming underneath.
- `/frames/*` is served with a week-long `Cache-Control` (see `next.config.ts`); if the frames are re-exported, rename the folder or shorten that header.

Desktop uses approximately `700vh` of scroll distance. Tablet and mobile use approximately `500vh`, measured in stable `svh` units so the toolbar collapsing on mobile never shifts scroll positions. Reduced-motion visitors receive a static representative frame and normal page flow.

## Quality checks

```bash
npm run lint
npm run build
```

