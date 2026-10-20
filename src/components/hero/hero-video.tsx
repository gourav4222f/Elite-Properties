import type { RefObject } from "react";

import { HERO_VIDEO } from "@/lib/hero-video";

interface HeroVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  reducedMotion: boolean;
}

export function HeroVideo({ videoRef, reducedMotion }: HeroVideoProps) {
  return (
    <div className="hero-media" aria-hidden="true">
      {reducedMotion ? null : (
        // The source is attached by useScrollVideo once the whole film has downloaded.
        <video
          ref={videoRef}
          className="hero-video"
          poster={HERO_VIDEO.poster}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
        />
      )}
      <div className="hero-film-treatment" />
      {reducedMotion ? <div className="hero-static-scrim" /> : null}
    </div>
  );
}
