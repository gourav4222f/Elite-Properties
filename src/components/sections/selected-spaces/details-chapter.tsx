import { selectedSpaces } from "@/data/selected-spaces";

import { EditorialImage } from "./editorial-image";

export function DetailsChapter() {
  return (
    <section className="spaces-chapter details-chapter" aria-labelledby="details-title">
      <EditorialImage
        image={selectedSpaces.details.chair}
        className="details-chair"
        reveal="vertical"
        depth="foreground"
      />
      <div className="spaces-chapter-copy details-copy" data-chapter-copy>
        <p>04 / Details</p>
        <h3 id="details-title">The difference<br />is in the<br />details.</h3>
        <span>Material. Light. Texture. Craft.</span>
      </div>
      <EditorialImage
        image={selectedSpaces.details.curtain}
        className="details-curtain"
        reveal="horizontal"
        depth="midground"
      />
      <EditorialImage
        image={selectedSpaces.details.vanity}
        className="details-vanity"
        reveal="vertical"
        depth="foreground"
      />
    </section>
  );
}
