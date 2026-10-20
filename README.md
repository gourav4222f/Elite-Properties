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

- Lenis drives smooth scrolling through GSAP's ticker. It hands positions to ScrollTrigger only while it is animating the scroll itself; native touch and keyboard scrolling reach ScrollTrigger directly, so each scroll is processed once.
- Every scroll-linked animation uses `getScrub()` (`src/lib/gsap.ts`): it follows wheel input directly (Lenis already smooths it) and adds a light lerp for native touch scrolling.
- In-page `#hash` links are handled once in `smooth-scroll-provider.tsx` so they glide to the exact section.
- Images share one treatment in `src/lib/image-motion.ts`. Mark the clipping frame with `data-image="up" | "left" | "none"` and optionally `data-parallax="n"`. The frame opens with a clip as it enters while the photograph settles from a gentle zoom, waiting for the image to decode first. The photograph then drifts `n`% of its height, overscaled so its edges never show (60% of that on phones).
- Copy and headline reveals for the later sections share `src/lib/reveal.ts` (`data-reveal`, `data-reveal-lines`).
- Dark bands register with `createIvoryHeaderZone` (`src/lib/header-tone.ts`) so the fixed header stays legible.
- Every animated section has a `prefers-reduced-motion` path that leaves content static and fully visible.

## Hero film

The hero scrubs one video, `public/video/hero-1280.mp4` (phones and Save-Data connections get `hero-960.mp4`), in step with the scroll.

- The films are encoded for scrubbing: H.264 with a keyframe every 4 frames and no B-frames, so any seek decodes at most three frames. The `ffmpeg` command to re-encode them from `source/hero-scroll.mp4` is in `src/lib/hero-video.ts`.
- `useScrollVideo` (`src/hooks/use-scroll-video.ts`) downloads the whole film before scrubbing, reporting progress to the loader, and holds it in memory as a blob, so a seek never waits on the network. The download is reused when visitors return to the page.
- Only one seek runs at a time. When it lands, the next seek jumps straight to the current scroll position instead of working through every position in between, which is what keeps the picture from trailing the scroll.
- If the download is slow, the loader gives way after 9 seconds on the poster frame and the film takes over as soon as it arrives.
- The story timeline follows the scroll directly (no extra scrub smoothing) and is pre-initialised behind the loader.
- The stage stays pinned while the first section slides over it, receding and dimming underneath.
- `/video/*` is served with a week-long `Cache-Control` (see `next.config.ts`); if the film is re-encoded, rename the file or shorten that header.

Desktop uses approximately `700vh` of scroll distance. Tablet and mobile use approximately `500vh`, measured in stable `svh` units so the toolbar collapsing on mobile never shifts scroll positions. Reduced-motion visitors receive a static representative frame (`hero-still.webp`), the film is never downloaded, and the page flows normally.

## Quality checks

```bash
npm run lint
npm run build
```

