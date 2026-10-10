import { selectedSpaces } from "@/data/selected-spaces";

import { EditorialImage } from "./editorial-image";

export function LiveChapter() {
  return (
    <section className="spaces-chapter live-chapter" aria-labelledby="live-title">
      <div className="spaces-chapter-copy live-copy" data-chapter-copy>
        <p>02 / Live</p>
        <h3 id="live-title">Made for<br />everyday<br />moments.</h3>
        <span>Light. Comfort. Space. Quiet.</span>
      </div>
      <EditorialImage
        image={selectedSpaces.live.bedroom}
        className="live-bedroom"
        reveal="vertical"
        depth="midground"
      />
      <EditorialImage
        image={selectedSpaces.live.kitchen}
        className="live-kitchen"
        reveal="horizontal"
        depth="foreground"
      />
      <div className="spaces-full-bleed">
        <EditorialImage
          image={selectedSpaces.live.drawingRoom}
          className="live-full-bleed"
          reveal="open"
          depth="background"
          parallax={0}
        />
        <p><span>Space,</span><span>felt differently.</span></p>
      </div>
    </section>
  );
}
