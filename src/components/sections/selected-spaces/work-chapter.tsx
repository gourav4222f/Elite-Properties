import { selectedSpaces } from "@/data/selected-spaces";

import { EditorialImage } from "./editorial-image";

export function WorkChapter() {
  return (
    <section className="spaces-chapter work-chapter" aria-labelledby="work-title">
      <div className="work-rule work-rule-top" aria-hidden="true" />
      <div className="spaces-chapter-copy work-copy" data-chapter-copy>
        <p>03 / Work</p>
        <h3 id="work-title">Space<br />for<br />ambition.</h3>
        <span>Places designed for business, possibility and what comes next.</span>
      </div>
      <EditorialImage
        image={selectedSpaces.work.exterior}
        className="work-primary"
        reveal="horizontal"
        depth="midground"
      />
      <EditorialImage
        image={selectedSpaces.work.lobby}
        className="work-secondary"
        reveal="vertical"
        depth="foreground"
      />
      <div className="work-rule work-rule-bottom" aria-hidden="true" />
    </section>
  );
}
