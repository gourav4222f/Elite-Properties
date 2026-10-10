"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getScrub, gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { propertyJourney } from "@/data/property-journey";

import { JourneyPath } from "./journey-path";
import { JourneyVisual } from "./journey-visuals";

function HeadlineLines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line) => (
        <span className="journey-line-mask" key={line}><span>{line}</span></span>
      ))}
    </>
  );
}

export function PropertyJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const activeStageRef = useRef(-1);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const introLines = root.querySelectorAll<HTMLElement>(".journey-intro .journey-line-mask > span");
      const introCopy = root.querySelectorAll<HTMLElement>(".journey-intro [data-journey-intro]");

      if (!reducedMotion) {
        gsap.fromTo(
          introLines,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.11,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: ".journey-intro", start: "top 70%", once: true },
          },
        );
        gsap.fromTo(
          introCopy,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: motionEasings.enter,
            scrollTrigger: { trigger: ".journey-intro", start: "top 70%", once: true },
          },
        );
      }

      createIvoryHeaderZone(".journey-summary");

      media.add("(min-width: 48rem)", () => {
        if (reducedMotion) return;
        const pin = root.querySelector<HTMLElement>(".journey-pin");
        const stage = root.querySelector<HTMLElement>(".journey-stage");
        const path = root.querySelector<SVGPathElement>("[data-journey-path]");
        const traveller = root.querySelector<SVGGElement>("[data-journey-traveller]");
        const items = Array.from(root.querySelectorAll<HTMLElement>(".journey-stage-item"));
        const indexCurrent = root.querySelector<HTMLElement>("[data-stage-current]");
        const guided = root.querySelector<HTMLElement>(".journey-guided-word");
        if (!pin || !stage || !path || !traveller || items.length !== propertyJourney.length) return;

        const pathLength = path.getTotalLength();
        const setTraveller = (progress: number) => {
          const point = path.getPointAtLength(pathLength * progress);
          traveller.setAttribute("transform", `translate(${point.x} ${point.y})`);
        };

        const setActiveStage = (index: number) => {
          if (activeStageRef.current === index) return;
          activeStageRef.current = index;
          stage.dataset.activeStage = String(index);
          items.forEach((item, itemIndex) => {
            if (itemIndex === index) item.setAttribute("aria-current", "step");
            else item.removeAttribute("aria-current");
          });
          root.querySelectorAll<SVGGElement>("[data-checkpoint]").forEach((checkpoint, checkpointIndex) => {
            checkpoint.classList.toggle("is-complete", checkpointIndex <= index);
            checkpoint.classList.toggle("is-active", checkpointIndex === index);
          });
          if (indexCurrent) indexCurrent.textContent = String(index + 1).padStart(2, "0");
        };

        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        setTraveller(0);
        gsap.set(items, { autoAlpha: 0, y: 28 });
        gsap.set(items[0], { autoAlpha: 1, y: 0 });

        const drawablePaths = Array.from(
          root.querySelectorAll<SVGGeometryElement>(
            ".visit-route-draw, .document-outline, .document-fold, .document-rule, .document-check, .building-line",
          ),
        );
        drawablePaths.forEach((drawPath) => {
          const length = drawPath.getTotalLength();
          gsap.set(drawPath, { strokeDasharray: length, strokeDashoffset: length });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: getScrub(),
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = Math.min(1, Math.max(0, self.progress));
              const stageIndex = Math.min(propertyJourney.length - 1, Math.floor(progress * propertyJourney.length));
              setTraveller(progress);
              setActiveStage(stageIndex);
              if (self.isActive) setHeaderTone(stageIndex >= 4 ? "ivory" : "ink");
            },
            onLeave: () => setHeaderTone("ink"),
            onLeaveBack: () => setHeaderTone("ink"),
          },
        });

        timeline.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
        if (guided) timeline.fromTo(guided, { xPercent: -5 }, { xPercent: 7, duration: 1 }, 0);

        for (let index = 1; index < items.length; index += 1) {
          const position = index / items.length;
          timeline.to(items[index - 1], { autoAlpha: 0, y: -26, duration: 0.045 }, position - 0.025);
          timeline.fromTo(
            items[index],
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.06 },
            position,
          );
        }

        timeline.fromTo(".discover-visual .visual-piece", { x: 34, opacity: 0 }, { x: 0, opacity: 1, duration: 0.08, stagger: 0.012 }, 0.025);
        timeline.fromTo(".shortlist-sheet", { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.08, stagger: 0.01 }, 0.18);
        timeline.to(".shortlist-sheet:nth-child(n+4)", { scale: 0.8, opacity: 0.16, duration: 0.08 }, 0.25);
        timeline.to(".visit-route-draw", { strokeDashoffset: 0, duration: 0.12 }, 0.35);
        timeline.fromTo(".visit-point", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.05, stagger: 0.018 }, 0.41);
        timeline.fromTo(".finance-visual .visual-piece", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.09, stagger: 0.012 }, 0.52);
        timeline.to(".document-visual .visual-piece", { strokeDashoffset: 0, duration: 0.09, stagger: 0.012 }, 0.68);
        timeline.to(".manage-visual .visual-piece", { strokeDashoffset: 0, duration: 0.08, stagger: 0.018 }, 0.85);
        timeline.fromTo(".manage-secondary", { yPercent: 110 }, { yPercent: 0, duration: 0.06 }, 0.91);

        setActiveStage(0);

        return () => {
          activeStageRef.current = -1;
          setHeaderTone("ink");
        };
      });

      media.add("(max-width: 47.999rem)", () => {
        const items = Array.from(root.querySelectorAll<HTMLElement>(".journey-stage-item"));
        const line = root.querySelector<HTMLElement>(".journey-mobile-line > span");
        if (!reducedMotion && line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".journey-stage-list",
                start: "top 65%",
                end: "bottom 55%",
                scrub: getScrub(),
              },
            },
          );
          items.forEach((item) => {
            gsap.fromTo(
              item.querySelectorAll(".journey-step-copy, .journey-visual"),
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: motionEasings.enter,
                scrollTrigger: { trigger: item, start: "top 75%", once: true },
              },
            );
          });
        }

        [items[4], items[5]].forEach((item) => {
          if (item) createIvoryHeaderZone(item);
        });

        return () => setHeaderTone("ink");
      });

    }, root);

    return () => {
      media.revert();
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <section ref={rootRef} id="services" className={`property-journey${reducedMotion ? " is-reduced" : ""}`} aria-labelledby="journey-title">
      <header className="journey-intro">
        <p className="journey-eyebrow" data-journey-intro>04 / How we help</p>
        <h2 id="journey-title"><HeadlineLines lines={["From search", "to signature."]} /></h2>
        <p className="journey-intro-copy" data-journey-intro>
          Finding the right property is only one part of the journey. We help make the steps around it clearer.
        </p>
        <div className="journey-entry" data-journey-intro aria-hidden="true">
          <i /><span>Scroll through the journey</span>
        </div>
      </header>

      <div className="journey-pin">
        <div className="journey-stage" data-active-stage="0">
          <div className="journey-guided-word" aria-hidden="true">Guided</div>
          <JourneyPath />
          <div className="journey-mobile-line" aria-hidden="true"><span /></div>

          <div className="journey-index" aria-hidden="true">
            <span data-stage-current>01</span><i />06
          </div>

          <ol className="journey-stage-list">
            {propertyJourney.map((stage) => (
              <li className={`journey-stage-item stage-${stage.id}`} data-stage={stage.id} key={stage.id}>
                <div className="journey-step-copy">
                  <p className="journey-step-label">{stage.number} / {stage.label}</p>
                  {stage.serviceLabel ? <p className="journey-service-label">{stage.serviceLabel}</p> : null}
                  <h3><HeadlineLines lines={stage.headline} /></h3>
                  {stage.secondaryHeadline ? (
                    <div className="journey-line-mask manage-secondary"><span>{stage.secondaryHeadline}</span></div>
                  ) : null}
                  <p className="journey-step-description">{stage.description}</p>
                  {stage.metadata ? (
                    <ul className="journey-step-metadata" aria-label="Property categories">
                      {stage.metadata.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  ) : null}
                </div>
                <JourneyVisual stage={stage.id} />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="journey-summary">
        <div>
          <p className="journey-summary-brand">Elite Properties / Vrindavan</p>
          <h2>One property journey.<br />One local partner.</h2>
          <p>From finding the right opportunity to navigating what comes next.</p>
          <div className="journey-summary-actions">
            <Link className="journey-primary-cta" href="/contact">
              <span className="intent-link-swap"><span>Talk to a property expert</span><span aria-hidden="true">Talk to a property expert</span></span>
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
            </Link>
            <Link className="journey-secondary-cta" href="/services">See every service</Link>
          </div>
        </div>
        <ol className="journey-summary-list" aria-label="Property journey summary">
          {propertyJourney.map((stage) => <li key={stage.id}><span>{stage.number}</span>{stage.label}</li>)}
        </ol>
      </div>

    </section>
  );
}
