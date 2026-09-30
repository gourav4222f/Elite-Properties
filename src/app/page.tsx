import { HeroSequence } from "@/components/hero/hero-sequence";
import { Header } from "@/components/layout/header";
import { PropertyIntent } from "@/components/sections/property-intent/property-intent";

export default function HomePage() {
  return (
    <main id="main-content">
      <Header />
      <HeroSequence />
      <PropertyIntent />
    </main>
  );
}
