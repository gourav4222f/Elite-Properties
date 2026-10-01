import type { JourneyStageId } from "@/data/property-journey";

function DiscoverVisual() {
  return (
    <div className="journey-visual discover-visual" aria-hidden="true">
      {["Property type", "Location", "Budget", "Purpose"].map((label) => (
        <div className="requirement-row visual-piece" key={label}>
          <span>{label}</span><i />
        </div>
      ))}
      <span className="requirement-focus visual-piece" />
    </div>
  );
}

function ShortlistVisual() {
  return (
    <div className="journey-visual shortlist-visual" aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <div className={`shortlist-sheet visual-piece sheet-${index + 1}`} key={index}>
          <span /><i /><i />
        </div>
      ))}
    </div>
  );
}

function VisitVisual() {
  return (
    <div className="journey-visual visit-visual" aria-hidden="true">
      <svg viewBox="0 0 620 330" preserveAspectRatio="xMidYMid meet">
        <path className="visit-route-ghost" d="M48 244 C140 244 130 85 258 85 S368 262 470 262 S516 132 576 132" />
        <path className="visit-route-draw visual-piece" d="M48 244 C140 244 130 85 258 85 S368 262 470 262 S516 132 576 132" />
        <circle className="visit-origin" cx="48" cy="244" r="6" />
        <circle className="visit-point visual-piece" cx="258" cy="85" r="8" />
        <circle className="visit-point visual-piece" cx="470" cy="262" r="8" />
        <circle className="visit-point visual-piece" cx="576" cy="132" r="8" />
      </svg>
      <span className="visit-you">You</span>
      <span className="visit-caption">Abstract visit route</span>
    </div>
  );
}

function FinanceVisual() {
  return (
    <div className="journey-visual finance-visual" aria-hidden="true">
      <span className="finance-symbol visual-piece">₹</span>
      <div className="finance-term finance-budget visual-piece">Budget</div>
      <div className="finance-plus visual-piece">+</div>
      <div className="finance-term finance-property visual-piece">Property</div>
      <div className="finance-plus visual-piece">+</div>
      <div className="finance-term finance-process visual-piece">Finance</div>
      <p className="finance-result visual-piece">A clearer path forward</p>
    </div>
  );
}

function DocumentationVisual() {
  return (
    <div className="journey-visual document-visual" aria-hidden="true">
      <svg viewBox="0 0 520 620" preserveAspectRatio="xMidYMid meet">
        <rect className="document-outline visual-piece" x="55" y="35" width="410" height="550" />
        <path className="document-fold visual-piece" d="M355 35 V145 H465" />
        <path className="document-rule visual-piece" d="M110 230 H405" />
        <path className="document-rule visual-piece" d="M110 285 H350" />
        <path className="document-rule visual-piece" d="M110 340 H405" />
        <path className="document-rule visual-piece" d="M110 395 H310" />
        <path className="document-check visual-piece" d="M335 485 L370 520 L430 445" />
      </svg>
      <span>Property documentation</span>
    </div>
  );
}

function ManageVisual() {
  return (
    <div className="journey-visual manage-visual" aria-hidden="true">
      <svg viewBox="0 0 640 560" preserveAspectRatio="xMidYMid meet">
        <path className="building-line building-foundation visual-piece" d="M70 500 H570" />
        <path className="building-line building-walls visual-piece" d="M125 500 V220 H515 V500" />
        <path className="building-line building-crown visual-piece" d="M95 220 H545 L470 90 H170 Z" />
        <path className="building-line building-window visual-piece" d="M190 285 H270 V375 H190 Z M370 285 H450 V375 H370 Z" />
        <path className="building-line building-door visual-piece" d="M285 500 V395 H355 V500" />
      </svg>
    </div>
  );
}

export function JourneyVisual({ stage }: { stage: JourneyStageId }) {
  if (stage === "discover") return <DiscoverVisual />;
  if (stage === "shortlist") return <ShortlistVisual />;
  if (stage === "visit") return <VisitVisual />;
  if (stage === "finance") return <FinanceVisual />;
  if (stage === "documentation") return <DocumentationVisual />;
  return <ManageVisual />;
}
