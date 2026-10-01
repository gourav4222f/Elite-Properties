import { HeroSequence } from "@/components/hero/hero-sequence";
import { Header } from "@/components/layout/header";
import { PropertyIntent } from "@/components/sections/property-intent/property-intent";
import { PropertyJourney } from "@/components/sections/property-journey/property-journey";
import { SelectedSpaces } from "@/components/sections/selected-spaces/selected-spaces";

export default function HomePage() {
  return (
    <main id="main-content">
      <Header />
      <HeroSequence />
      <PropertyIntent />
      <PropertyJourney />
      <SelectedSpaces />
    </main>
  );
}
