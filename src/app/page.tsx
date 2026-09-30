import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ImageReveal } from "@/components/motion/image-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { Button, LinkButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

const colors = [
  { name: "Ivory", value: "#faf8f3", className: "bg-elite-ivory text-elite-ink" },
  { name: "Ink", value: "#1b0e07", className: "bg-elite-ink text-elite-ivory" },
  { name: "Forest", value: "#2f270e", className: "bg-elite-forest text-elite-ivory" },
  { name: "Olive", value: "#4d411f", className: "bg-elite-olive text-elite-ivory" },
  { name: "Sand", value: "#d4b79b", className: "bg-elite-sand text-elite-ink" },
  { name: "Terracotta", value: "#c25631", className: "bg-elite-terracotta text-elite-ivory" },
];

export default function DesignSystemPreview() {
  return (
    <main id="main-content">
      <div className="border-b border-border py-4">
        <Container className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-caption font-semibold uppercase tracking-[0.14em]">Elite Properties</p>
          <p className="text-caption text-muted">Internal foundation preview</p>
        </Container>
      </div>

      <Section spacing="generous">
        <Container>
          <div className="editorial-grid items-end">
            <div className="col-span-4 md:col-span-5 lg:col-span-9">
              <Eyebrow className="mb-6">Design language</Eyebrow>
              <TextReveal
                as="h1"
                className="text-display-xl block max-w-[10ch] text-balance font-display"
              >
                Spaces with lasting value.
              </TextReveal>
            </div>
            <p className="col-span-4 mt-10 max-w-[36ch] text-body-lg text-muted md:col-span-4 md:col-start-3 lg:col-span-3 lg:col-start-10 lg:mt-0">
              A quiet, architectural foundation for presenting considered property in Vrindavan.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border" spacing="compact">
        <Container>
          <div className="editorial-grid gap-y-12">
            <div className="col-span-4 md:col-span-6 lg:col-span-4">
              <h2 className="text-heading-lg font-display">Core actions</h2>
              <p className="mt-3 max-w-[34ch] text-body text-muted">
                Restrained controls with clear contrast, keyboard focus, and tactile feedback.
              </p>
            </div>
            <div className="col-span-4 flex flex-wrap items-center gap-3 md:col-span-6 lg:col-span-7 lg:col-start-6">
              <Button>Primary action</Button>
              <LinkButton href="#image-study" variant="secondary" showArrow>
                View image study
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-heading-xl max-w-[12ch] font-display">A grounded palette</h2>
          <div className="mt-14 grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6">
            {colors.map((color) => (
              <div
                key={color.name}
                className={`flex aspect-[4/5] flex-col justify-end p-4 ${color.className}`}
              >
                <span className="text-caption font-semibold uppercase tracking-[0.12em]">{color.name}</span>
                <span className="mt-1 font-mono text-[0.68rem] opacity-75">{color.value}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <div className="editorial-grid gap-y-14">
            <div className="col-span-4 md:col-span-6 lg:col-span-4">
              <h2 className="text-heading-lg font-display">Type scale</h2>
              <p className="mt-3 max-w-[32ch] text-body text-muted">
                Cormorant Garamond brings editorial character. Manrope keeps details precise and readable.
              </p>
            </div>
            <div className="col-span-4 space-y-10 md:col-span-6 lg:col-span-7 lg:col-start-6">
              <div>
                <p className="text-caption text-muted">Display XL</p>
                <p className="text-display-lg mt-2 font-display">Enduring perspective</p>
              </div>
              <div>
                <p className="text-caption text-muted">Heading</p>
                <p className="text-heading-lg mt-2 font-display">Material. Light. Place.</p>
              </div>
              <div>
                <p className="text-caption text-muted">Body</p>
                <p className="text-body-lg mt-2 max-w-[48ch]">
                  A modern sans-serif supports detailed property information without competing with the imagery.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="image-study" spacing="generous">
        <Container>
          <div className="editorial-grid items-end gap-y-10">
            <div className="col-span-4 md:col-span-5 lg:col-span-8">
              <ImageReveal
                src="/images/properties/aerial-view-luxury-residential-building-greenery.jpg"
                alt="Aerial view of a contemporary residential building surrounded by greenery"
                width={1600}
                height={1200}
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 80vw, 66vw"
                frameClassName="aspect-[4/3]"
                className="h-full w-full"
              />
            </div>
            <div className="col-span-4 md:col-span-4 md:col-start-3 lg:col-span-4 lg:col-start-9">
              <TextReveal as="h2" className="text-heading-lg block font-display" triggerOnScroll>
                Photography leads.
              </TextReveal>
              <p className="mt-5 text-body text-muted">
                The reveal is brief and directional, helping the image arrive without obscuring it.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border" spacing="compact">
        <Container>
          <h2 className="text-heading-md font-display">Responsive editorial grid</h2>
          <div className="editorial-grid mt-10 min-h-48">
            <div className="col-span-2 bg-elite-sand p-4 md:col-span-2 lg:col-span-3">
              <span className="text-caption">01</span>
            </div>
            <div className="col-span-2 bg-elite-olive p-4 text-elite-ivory md:col-span-4 lg:col-span-5">
              <span className="text-caption">02</span>
            </div>
            <div className="col-span-4 bg-elite-ink p-4 text-elite-ivory md:col-span-6 lg:col-span-4">
              <span className="text-caption">03</span>
            </div>
          </div>
          <p className="mt-4 text-caption text-muted">4 columns mobile, 6 tablet, 12 desktop</p>
        </Container>
      </Section>
    </main>
  );
}
