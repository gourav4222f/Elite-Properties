import type { RefObject } from "react";

interface HeroCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  reducedMotion: boolean;
}

export function HeroCanvas({ canvasRef, reducedMotion }: HeroCanvasProps) {
  return (
    <div className="hero-media" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-film-treatment" />
      {reducedMotion ? <div className="hero-static-scrim" /> : null}
    </div>
  );
}
