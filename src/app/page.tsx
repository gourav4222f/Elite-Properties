import { HeroSequence } from "@/components/hero/hero-sequence";
import { Header } from "@/components/layout/header";

export default function HomePage() {
  return (
    <main id="main-content">
      <Header />
      <HeroSequence />

      <section id="properties" className="next-section-placeholder" aria-labelledby="next-section-title">
        <p className="next-section-label">Section 02</p>
        <h2 id="next-section-title">
          Property,
          <br />
          curated with intent.
        </h2>
      </section>
    </main>
  );
}
