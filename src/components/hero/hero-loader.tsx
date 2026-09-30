interface HeroLoaderProps {
  progress: number;
  exiting: boolean;
}

export function HeroLoader({ progress, exiting }: HeroLoaderProps) {
  const value = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return (
    <div className={`hero-loader${exiting ? " is-exiting" : ""}`} aria-live="polite" aria-label={`Loading hero ${value}%`}>
      <div className="hero-loader-inner">
        <p className="hero-loader-wordmark">Elite<br />Properties</p>
        <div className="hero-loader-status">
          <p className="hero-loader-location">Vrindavan</p>
          <p className="hero-loader-number" aria-hidden="true">{String(value).padStart(2, "0")}</p>
        </div>
        <div className="hero-loader-rule" aria-hidden="true">
          <span style={{ transform: `scaleX(${value / 100})` }} />
        </div>
      </div>
    </div>
  );
}
