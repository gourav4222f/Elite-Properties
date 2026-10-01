import { selectedSpaces } from "@/data/selected-spaces";

import { EditorialImage } from "./editorial-image";

export function ArriveChapter() {
  return (
    <section className="spaces-chapter arrive-chapter" aria-labelledby="arrive-title">
      <div className="spaces-giant-type" aria-hidden="true">Spaces</div>
      <EditorialImage
        image={selectedSpaces.arrive.entrance}
        className="arrive-primary"
        reveal="vertical"
        depth="midground"
      />
      <div className="spaces-chapter-copy arrive-copy" data-chapter-copy>
        <p>01 / Arrive</p>
        <h3 id="arrive-title">First<br />impressions<br />matter.</h3>
        <span>Architecture begins before you step inside.</span>
      </div>
      <EditorialImage
        image={selectedSpaces.arrive.aerial}
        className="arrive-secondary"
        reveal="horizontal"
        depth="foreground"
      />
    </section>
  );
}
