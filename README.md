# Elite Properties

Production foundation for the Elite Properties website in Vrindavan, Mathura.

## Development

```bash
npm run dev
```

Open `http://localhost:3000` to view the cinematic scroll-driven hero.

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

Content lives in `src/data` (`properties.json`, `vrindavan.ts`, `about.ts`, `contact.ts`). The listings, drive times and contact details are starting content: confirm or replace them before launch. Add `phone` and `email` to `src/data/contact.ts` and they appear in the contact section and footer.

## Enquiries

The contact form validates in the browser and posts to `POST /api/enquiry` (`src/app/api/enquiry/route.ts`), which validates again and currently writes each enquiry to the server log. Connect the marked delivery point in that file to email or a CRM before going live. "Enquire" links on listings pre-fill the form with the property they came from.

## Motion

- Lenis drives smooth scrolling through GSAP's ticker; in-page `#hash` links are handled once in `smooth-scroll-provider.tsx` so they glide to the exact section.
- Scroll reveals for the later sections share `src/lib/reveal.ts` (`data-reveal`, `data-reveal-lines`, `data-reveal-image`, `data-parallax`).
- Dark bands register with `createIvoryHeaderZone` (`src/lib/header-tone.ts`) so the fixed header stays legible.
- Every animated section has a `prefers-reduced-motion` path that leaves content static and fully visible.

## Hero frame sequence

The hero renders `public/frames/frame_0001.webp` through `frame_0720.webp` in one canvas.

- Frames are fetched and decoded off the main thread with `createImageBitmap`, so drawing never blocks scrolling. Decode concurrency adapts to the device's cores.
- The first 24 frames are loader-critical. After that, frames ahead of the playhead (in the direction of travel) are decoded first, and the rest are fetched into the HTTP cache without decoding.
- Decoded frames are bounded (64 on desktop, 32 on phones and low-memory devices) and released as the playhead moves away.
- The canvas backing store is capped near the 1280×720 source resolution, since rendering finer adds cost without detail.
- Frames draw inside GSAP's tick, keeping the footage in step with the story text.
- `/frames/*` is served with a week-long `Cache-Control` (see `next.config.ts`); if the frames are re-exported, rename the folder or shorten that header.

Desktop uses approximately `700vh` of scroll distance. Tablet and mobile use approximately `500vh`, measured in stable `svh` units so the toolbar collapsing on mobile never shifts scroll positions. Reduced-motion visitors receive a static representative frame and normal page flow.

## Quality checks

```bash
npm run lint
npm run build
```

