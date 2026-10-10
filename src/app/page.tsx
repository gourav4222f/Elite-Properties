import { HeroSequence } from "@/components/hero/hero-sequence";
import { About } from "@/components/sections/about/about";
import { Contact } from "@/components/sections/contact/contact";
import { PropertyIntent } from "@/components/sections/property-intent/property-intent";
import { PropertyJourney } from "@/components/sections/property-journey/property-journey";
import { SelectedProperties } from "@/components/sections/selected-properties/selected-properties";
import { SelectedSpaces } from "@/components/sections/selected-spaces/selected-spaces";
import { WhyVrindavan } from "@/components/sections/why-vrindavan/why-vrindavan";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSequence />
      <PropertyIntent />
      <WhyVrindavan />
      <About />
      <PropertyJourney />
      <SelectedSpaces />
      <SelectedProperties />
      <Contact />
    </main>
  );
}
