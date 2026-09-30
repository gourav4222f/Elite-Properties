# Elite Properties

Production foundation for the Elite Properties website in Vrindavan, Mathura.

## Development

```bash
npm run dev
```

Open `http://localhost:3000` to view the cinematic scroll-driven hero.

## Hero frame sequence

The hero renders `public/frames/frame_0001.webp` through `frame_0720.webp` in one canvas. Frames are fetched with eight-request concurrency. The first 24 frames are loader-critical; the rest continue in the background. Decoded images are bounded with a nearby-frame cache so the browser does not retain all 720 frames in memory at once.

Desktop uses approximately `700vh` of scroll distance. Tablet and mobile use approximately `500vh`. Reduced-motion visitors receive a static representative frame and normal page flow.

## Quality checks

```bash
npm run lint
npm run build
```

Property, service, and location content is stored as local JSON under `src/data`.
