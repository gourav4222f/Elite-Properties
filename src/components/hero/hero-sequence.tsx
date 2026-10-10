"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { HeroCanvas } from "@/components/hero/hero-canvas";
import { HeroLoader } from "@/components/hero/hero-loader";
import { HeroProgress } from "@/components/hero/hero-progress";
import { HeroStory } from "@/components/hero/hero-story";
import { useFrameSequence } from "@/hooks/use-frame-sequence";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getChapterAtProgress, getFramePath, HERO_CHAPTERS, HERO_SEQUENCE } from "@/lib/frame-sequence";
import { gsap, motionEasings } from "@/lib/gsap";
import { setHeaderTone } from "@/lib/header-tone";
import { setScrollLocked } from "@/lib/smooth-scroll";

// Never hold visitors behind the loader for longer than this on slow connections.
const LOADER_TIMEOUT_MS = 9000;

// Story timing in timeline progress (0–1). One unit spans the whole pinned scroll.
// Every window stays inside its chapter's frame range, because each chapter's text tone
// is matched to the brightness of the footage behind it.
const LINE_ENTER = { duration: 0.03, stagger: 0.004, ease: motionEasings.enter } as const;
const LINE_EXIT = { duration: 0.022, stagger: 0.003, ease: motionEasings.exit } as const;
const STATEMENT_ENTER = { duration: 0.02, ease: motionEasings.enter } as const;
const STATEMENT_EXIT = { duration: 0.014, ease: motionEasings.exit } as const;
const SUPPORT_ENTER = { duration: 0.024, stagger: 0.003, ease: motionEasings.enter } as const;
const SUPPORT_EXIT = { duration: 0.016, ease: motionEasings.exit } as const;
const HIDE_AFTER_EXIT = 0.03;

export function HeroSequence() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressNumberRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const entranceRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { canvasRef, criticalProgress, criticalReady, requestFrame } = useFrameSequence({
    reducedMotion,
  });
  const [fontsReady, setFontsReady] = useState(false);
  const [loaderTimedOut, setLoaderTimedOut] = useState(false);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [loaderRemoved, setLoaderRemoved] = useState(false);

  const loaderProgress = useMemo(() => {
    if (loaderTimedOut) return 1;
    const framePortion = criticalProgress * 0.92;
    return Math.min(1, framePortion + (fontsReady ? 0.08 : 0));
  }, [criticalProgress, fontsReady, loaderTimedOut]);

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontsReady(true);
    });
    const timeout = window.setTimeout(() => setLoaderTimedOut(true), LOADER_TIMEOUT_MS);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.heroLoading = loaderRemoved ? "false" : "true";
    setScrollLocked(!loaderRemoved);
    return () => {
      delete document.documentElement.dataset.heroLoading;
      setScrollLocked(false);
    };
  }, [loaderRemoved]);

  useEffect(() => {
    const ready = (criticalReady && fontsReady) || loaderTimedOut;
    if (!ready || loaderRemoved) return;

    const exitTimer = window.setTimeout(() => setLoaderExiting(true), 180);
    const removeTimer = window.setTimeout(() => setLoaderRemoved(true), 1280);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [criticalReady, fontsReady, loaderRemoved, loaderTimedOut]);

  // The opening lines rise as the loader wipes away, instead of sitting static beneath it.
  useEffect(() => {
    const hero = heroRef.current;
    const timeline = timelineRef.current;
    if (!hero || !loaderExiting || reducedMotion || !timeline || timeline.progress() > 0.02) return;

    const context = gsap.context(() => {
      entranceRef.current = gsap
        .timeline()
        .fromTo(".hero-media", { scale: 1.06 }, { scale: 1, duration: 1.9, ease: "power3.out" }, 0)
        .fromTo(
          ".chapter-intro .chapter-line > span",
          { yPercent: 112 },
          { yPercent: 0, duration: 1.15, stagger: 0.1, ease: "power4.out" },
          0.28,
        )
        .fromTo(
          ".chapter-intro .chapter-label, .chapter-intro .intro-categories, .chapter-intro .scroll-indicator",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: motionEasings.enter },
          0.55,
        );
    }, hero);

    return () => {
      entranceRef.current = null;
      context.revert();
    };
  }, [loaderExiting, reducedMotion]);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!hero || !stage || !frame) return;

    setHeaderTone("ivory");

    if (reducedMotion) {
      requestFrame(606);
      return () => setHeaderTone("ink");
    }

    let activeChapter = "";
    const chapterIds = HERO_CHAPTERS.map((chapter) => chapter.id);
    const sequence = { frame: HERO_SEQUENCE.frameStart };

    const context = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>(".hero-chapter");
      gsap.set(chapters, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set('[data-chapter="intro"]', { autoAlpha: 1, pointerEvents: "auto" });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        // Chapter state follows the smoothed playhead, so labels and header tone change
        // exactly when the visuals do rather than when the raw scroll position does.
        onUpdate: () => {
          const progress = timeline.progress();
          // Scrolling during the opening flourish hands the intro straight to the timeline.
          if (progress > 0.03 && entranceRef.current?.isActive()) entranceRef.current.progress(1);

          // While the playhead is still catching up after the hero has scrolled away,
          // the sections now under the header own its tone.
          if (!timeline.scrollTrigger?.isActive) return;

          const chapter = getChapterAtProgress(progress);
          if (chapter.id === activeChapter) return;
          activeChapter = chapter.id;
          setHeaderTone(chapter.headerTone);
          if (progressNumberRef.current) {
            progressNumberRef.current.textContent = String(chapterIds.indexOf(chapter.id) + 1).padStart(2, "0");
          }
        },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          pin: stage,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      timelineRef.current = timeline;

      timeline.to(
        sequence,
        { frame: HERO_SEQUENCE.frameEnd, duration: 1, onUpdate: () => requestFrame(sequence.frame) },
        0,
      );

      if (progressFillRef.current) {
        timeline.fromTo(progressFillRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
      }

      const linesOf = (selector: string) => `${selector} .chapter-line > span`;
      const supportingOf = (chapter: string) =>
        [
          ".chapter-label",
          ".chapter-support",
          ".intro-categories",
          ".final-location",
          ".final-actions",
          ".scroll-indicator",
          ".continue-indicator",
        ]
          .map((part) => `${chapter} ${part}`)
          .join(", ");

      const enterLines = (selector: string, at: number, motion: gsap.TweenVars = LINE_ENTER) => {
        timeline.fromTo(linesOf(selector), { yPercent: 112 }, { yPercent: 0, ...motion }, at);
      };

      // Lines leave upward through their masks; explicit `from` values keep reverse scrubbing exact.
      // Cormorant's long descenders need the extra travel to clear the mask completely.
      const exitLines = (selector: string, at: number, motion: gsap.TweenVars = LINE_EXIT) => {
        timeline.fromTo(
          linesOf(selector),
          { yPercent: 0 },
          { yPercent: -135, immediateRender: false, ...motion },
          at,
        );
      };

      const showChapter = (chapter: string, at: number) => {
        timeline.set(chapter, { autoAlpha: 1, pointerEvents: "auto" }, at);
      };

      const hideChapter = (chapter: string, at: number) => {
        timeline.set(chapter, { autoAlpha: 0, pointerEvents: "none" }, at);
      };

      const revealChapter = (
        id: string,
        enterAt: number,
        exitAt: number | null,
        direction: "left" | "right" = "left",
      ) => {
        const chapter = `[data-chapter="${id}"]`;
        const supporting = supportingOf(chapter);
        const offset = direction === "left" ? -20 : 20;

        showChapter(chapter, enterAt);
        enterLines(chapter, enterAt);
        timeline.fromTo(
          supporting,
          { autoAlpha: 0, x: offset, y: 0 },
          { autoAlpha: 1, x: 0, ...SUPPORT_ENTER },
          enterAt + 0.008,
        );

        if (exitAt === null) return;
        exitLines(chapter, exitAt);
        timeline.fromTo(
          supporting,
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -12, immediateRender: false, ...SUPPORT_EXIT },
          exitAt,
        );
        hideChapter(chapter, exitAt + HIDE_AFTER_EXIT);
      };

      const intro = '[data-chapter="intro"]';
      exitLines(intro, 0.082);
      timeline.fromTo(
        supportingOf(intro),
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -12, immediateRender: false, ...SUPPORT_EXIT },
        0.082,
      );
      hideChapter(intro, 0.082 + HIDE_AFTER_EXIT);

      revealChapter("discover", 0.125, 0.228, "left");
      revealChapter("explore", 0.283, 0.382, "right");
      revealChapter("perspective", 0.432, 0.535, "left");

      const experience = '[data-chapter="experience"]';
      showChapter(experience, 0.582);
      timeline.fromTo(
        `${experience} .chapter-label`,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, ...SUPPORT_ENTER },
        0.586,
      );
      enterLines(".experience-first", 0.586);
      enterLines(".mobile-experience", 0.586);
      exitLines(".experience-first", 0.628);
      enterLines(".experience-second", 0.642);
      exitLines(".experience-second", 0.68);
      exitLines(".mobile-experience", 0.68);
      timeline.fromTo(
        `${experience} .chapter-label`,
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -12, immediateRender: false, ...SUPPORT_EXIT },
        0.68,
      );
      hideChapter(experience, 0.68 + HIDE_AFTER_EXIT);

      const belong = '[data-chapter="belong"]';
      showChapter(belong, 0.712);
      [
        { statement: '[data-belong-statement="live"]', enterAt: 0.714, exitAt: 0.742 },
        { statement: '[data-belong-statement="grow"]', enterAt: 0.756, exitAt: 0.784 },
        { statement: '[data-belong-statement="belong"]', enterAt: 0.798, exitAt: 0.824 },
      ].forEach(({ statement, enterAt, exitAt }) => {
        enterLines(statement, enterAt, STATEMENT_ENTER);
        exitLines(statement, exitAt, STATEMENT_EXIT);
      });
      hideChapter(belong, 0.824 + HIDE_AFTER_EXIT);

      revealChapter("brand", 0.846, 0.9, "left");
      revealChapter("final", 0.932, null, "left");

      // The pinned stage itself must not be transformed, so the settle happens on its child.
      timeline.fromTo(
        frame,
        { scale: 1 },
        { scale: 0.975, duration: 0.03, ease: motionEasings.cinematic },
        0.97,
      );
    }, hero);

    return () => {
      timelineRef.current = null;
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion, requestFrame]);

  return (
    <section
      ref={heroRef}
      className={`hero-sequence${reducedMotion ? " is-reduced-motion" : ""}`}
      aria-label="Find Your Place cinematic introduction"
    >
      <div ref={stageRef} className="hero-stage">
        <div
          ref={frameRef}
          className="hero-frame"
          style={{ backgroundImage: `url('${getFramePath(reducedMotion ? 606 : 1)}')` }}
        >
          <HeroCanvas canvasRef={canvasRef} reducedMotion={reducedMotion} />
          <HeroStory />
        </div>
        {!reducedMotion ? (
          <HeroProgress fillRef={progressFillRef} numberRef={progressNumberRef} />
        ) : null}
      </div>

      {!loaderRemoved ? <HeroLoader progress={loaderProgress} exiting={loaderExiting} /> : null}

      <noscript>
        <style>{`.hero-loader{display:none!important}.hero-sequence{height:100svh!important}`}</style>
        <div className="hero-noscript">
          <p>Elite Properties</p>
          <h1>Find Your Place in Vrindavan.</h1>
          <a href="#properties">Explore properties</a>
        </div>
      </noscript>
    </section>
  );
}
