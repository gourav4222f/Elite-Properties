"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { HeroCanvas } from "@/components/hero/hero-canvas";
import { HeroLoader } from "@/components/hero/hero-loader";
import { HeroProgress } from "@/components/hero/hero-progress";
import { HeroStory } from "@/components/hero/hero-story";
import { useFrameSequence } from "@/hooks/use-frame-sequence";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getChapterAtProgress, getFramePath, HERO_SEQUENCE } from "@/lib/frame-sequence";
import { gsap, motionEasings } from "@/lib/gsap";

export function HeroSequence() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressNumberRef = useRef<HTMLSpanElement>(null);
  const activeChapterRef = useRef("intro");
  const headerToneRef = useRef<"ink" | "ivory">("ink");
  const reducedMotion = usePrefersReducedMotion();
  const { canvasRef, criticalProgress, criticalReady, requestFrame } = useFrameSequence({
    reducedMotion,
  });
  const [fontsReady, setFontsReady] = useState(false);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [loaderRemoved, setLoaderRemoved] = useState(false);

  const loaderProgress = useMemo(() => {
    const framePortion = criticalProgress * 0.92;
    return Math.min(1, framePortion + (fontsReady ? 0.08 : 0));
  }, [criticalProgress, fontsReady]);

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontsReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.heroLoading = loaderRemoved ? "false" : "true";
    return () => {
      delete document.documentElement.dataset.heroLoading;
    };
  }, [loaderRemoved]);

  useEffect(() => {
    if (!criticalReady || !fontsReady || loaderRemoved) return;

    const exitTimer = window.setTimeout(() => setLoaderExiting(true), 180);
    const removeTimer = window.setTimeout(() => setLoaderRemoved(true), 1280);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [criticalReady, fontsReady, loaderRemoved]);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;

    document.documentElement.dataset.headerTone = "ivory";

    if (reducedMotion) {
      requestFrame(606);
      return () => {
        delete document.documentElement.dataset.headerTone;
      };
    }

    const sequence = { frame: HERO_SEQUENCE.frameStart };
    const context = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>(".hero-chapter");
      gsap.set(chapters, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set('[data-chapter="intro"]', { autoAlpha: 1 });
      gsap.set(".experience-second, .mobile-experience, .belong-statement", { autoAlpha: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
          pin: stage,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const chapter = getChapterAtProgress(self.progress);
            if (chapter.id !== activeChapterRef.current) {
              activeChapterRef.current = chapter.id;
              const index = ["intro", "discover", "explore", "perspective", "experience", "belong", "brand", "final"].indexOf(chapter.id);
              if (progressNumberRef.current) {
                progressNumberRef.current.textContent = String(index + 1).padStart(2, "0");
              }
            }

            if (chapter.headerTone !== headerToneRef.current) {
              headerToneRef.current = chapter.headerTone;
              document.documentElement.dataset.headerTone = chapter.headerTone;
            }

            if (progressFillRef.current) {
              progressFillRef.current.style.transform = `scaleY(${self.progress})`;
            }
          },
        },
      });

      timeline.to(
        sequence,
        {
          frame: HERO_SEQUENCE.frameEnd,
          duration: 1,
          ease: "none",
          snap: { frame: 1 },
          onUpdate: () => requestFrame(sequence.frame),
        },
        0,
      );

      const revealChapter = (
        id: string,
        start: number,
        end: number,
        direction: "left" | "right" = "left",
        keepVisible = false,
      ) => {
        const chapter = `[data-chapter="${id}"]`;
        const lines = `${chapter} .chapter-line > span`;
        const supporting = `${chapter} .chapter-label, ${chapter} .chapter-support, ${chapter} .intro-categories, ${chapter} .final-location, ${chapter} .final-actions, ${chapter} .scroll-indicator, ${chapter} .continue-indicator`;
        const enterAt = start + (id === "explore" ? 0.035 : 0);
        const exitAt = Math.max(enterAt + 0.025, end - 0.022);

        timeline.set(chapter, { autoAlpha: 1, pointerEvents: "auto" }, enterAt);
        timeline.fromTo(
          lines,
          { yPercent: 112 },
          { yPercent: 0, duration: 0.028, stagger: 0.004, ease: motionEasings.enter },
          enterAt,
        );
        timeline.fromTo(
          supporting,
          { autoAlpha: 0, x: direction === "left" ? -20 : 20 },
          { autoAlpha: 1, x: 0, duration: 0.02, stagger: 0.002, ease: motionEasings.enter },
          enterAt + 0.006,
        );
        if (!keepVisible) {
          timeline.to(
            chapter,
            { autoAlpha: 0, pointerEvents: "none", duration: 0.018, ease: motionEasings.exit },
            exitAt,
          );
        }
      };

      timeline.to('[data-chapter="intro"]', { autoAlpha: 0, pointerEvents: "none", duration: 0.018 }, 0.102);
      revealChapter("discover", 0.12, 0.27, "left");
      revealChapter("explore", 0.27, 0.42, "right");
      revealChapter("perspective", 0.42, 0.58, "left");

      timeline.set('[data-chapter="experience"]', { autoAlpha: 1, pointerEvents: "auto" }, 0.585);
      timeline.fromTo(
        '[data-chapter="experience"] .experience-first .chapter-line > span',
        { yPercent: 112 },
        { yPercent: 0, duration: 0.025, stagger: 0.004, ease: motionEasings.enter },
        0.59,
      );
      timeline.fromTo(
        '[data-chapter="experience"] .chapter-label',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.02 },
        0.59,
      );
      timeline.to(".experience-first", { autoAlpha: 0, y: -18, duration: 0.018 }, 0.642);
      timeline.fromTo(
        ".experience-second",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.024, ease: motionEasings.enter },
        0.65,
      );
      timeline.fromTo(
        ".mobile-experience",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.024, ease: motionEasings.enter },
        0.59,
      );
      timeline.to('[data-chapter="experience"]', { autoAlpha: 0, pointerEvents: "none", duration: 0.018 }, 0.695);

      timeline.set('[data-chapter="belong"]', { autoAlpha: 1 }, 0.71);
      const belongMoments = [
        { selector: '[data-belong-statement="live"]', start: 0.715, end: 0.752 },
        { selector: '[data-belong-statement="grow"]', start: 0.758, end: 0.795 },
        { selector: '[data-belong-statement="belong"]', start: 0.801, end: 0.838 },
      ];
      belongMoments.forEach(({ selector, start, end }) => {
        timeline.fromTo(
          selector,
          { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", y: 20 },
          { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.018, ease: motionEasings.enter },
          start,
        );
        timeline.to(selector, { autoAlpha: 0, y: -14, duration: 0.014 }, end - 0.014);
      });
      timeline.set('[data-chapter="belong"]', { autoAlpha: 0 }, 0.84);

      revealChapter("brand", 0.84, 0.94, "left");
      revealChapter("final", 0.94, 1, "left", true);
      timeline.to(stage, { scale: 0.975, duration: 0.03, ease: motionEasings.cinematic }, 0.97);
    }, hero);

    return () => {
      context.revert();
      delete document.documentElement.dataset.headerTone;
    };
  }, [reducedMotion, requestFrame]);

  return (
    <section
      ref={heroRef}
      className={`hero-sequence${reducedMotion ? " is-reduced-motion" : ""}`}
      aria-label="Find Your Place cinematic introduction"
    >
      <div
        ref={stageRef}
        className="hero-stage"
        style={{ backgroundImage: `url('${getFramePath(reducedMotion ? 606 : 1)}')` }}
      >
        <HeroCanvas canvasRef={canvasRef} reducedMotion={reducedMotion} />
        <HeroStory />
        {!reducedMotion ? (
          <HeroProgress fillRef={progressFillRef} numberRef={progressNumberRef} />
        ) : null}
      </div>

      {!loaderRemoved ? <HeroLoader progress={loaderProgress} exiting={loaderExiting} /> : null}

      <noscript>
        <style>{`.hero-loader{display:none!important}.hero-sequence{height:100dvh!important}`}</style>
        <div className="hero-noscript">
          <p>Elite Properties</p>
          <h1>Find Your Place in Vrindavan.</h1>
          <a href="#properties">Explore properties</a>
        </div>
      </noscript>
    </section>
  );
}
