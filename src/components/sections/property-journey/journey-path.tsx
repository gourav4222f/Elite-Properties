import { propertyJourney } from "@/data/property-journey";

const checkpoints = [
  [140, 160],
  [560, 310],
  [270, 560],
  [850, 430],
  [1240, 620],
  [970, 780],
] as const;

export function JourneyPath() {
  return (
    <svg
      className="journey-map"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        className="journey-map-ghost"
        d="M140 160 H500 Q560 160 560 220 V310 Q560 370 500 370 H330 Q270 370 270 430 V560 Q270 620 330 620 H790 Q850 620 850 560 V430 Q850 370 910 370 H1180 Q1240 370 1240 430 V620 Q1240 680 1180 680 H1030 Q970 680 970 740 V780"
      />
      <path
        className="journey-map-progress"
        data-journey-path
        d="M140 160 H500 Q560 160 560 220 V310 Q560 370 500 370 H330 Q270 370 270 430 V560 Q270 620 330 620 H790 Q850 620 850 560 V430 Q850 370 910 370 H1180 Q1240 370 1240 430 V620 Q1240 680 1180 680 H1030 Q970 680 970 740 V780"
      />

      {checkpoints.map(([cx, cy], index) => (
        <g className="journey-checkpoint" data-checkpoint={index} key={propertyJourney[index].id}>
          <circle className="journey-checkpoint-ring" cx={cx} cy={cy} r="13" />
          <circle className="journey-checkpoint-core" cx={cx} cy={cy} r="4" />
        </g>
      ))}

      <g className="journey-traveller" data-journey-traveller>
        <circle className="journey-traveller-ring" r="11" />
        <circle className="journey-traveller-core" r="4" />
      </g>
    </svg>
  );
}
