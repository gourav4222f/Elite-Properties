import { selectedSpaces } from "@/data/selected-spaces";

import { EditorialImage } from "./editorial-image";

export function OutsideInsideTransition() {
  return (
    <section className="outside-inside" aria-labelledby="outside-inside-title">
      <div className="outside-inside-sticky">
        <EditorialImage
          image={selectedSpaces.crossing.exterior}
          className="crossing-exterior"
          reveal="open"
          depth="background"
        />
        <h3 id="outside-inside-title" className="outside-inside-title">
          <span className="spaces-line-mask"><span>From the</span></span>
          <span className="spaces-line-mask"><span>outside in.</span></span>
        </h3>
        <EditorialImage
          image={selectedSpaces.crossing.interior}
          className="crossing-interior"
          reveal="open"
          depth="foreground"
        />
      </div>
    </section>
  );
}
