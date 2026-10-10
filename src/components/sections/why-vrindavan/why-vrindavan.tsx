"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { MaskedLines } from "@/components/motion/masked-lines";
import { driveTimes, placeReasons } from "@/data/vrindavan";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { revealOnScroll } from "@/lib/reveal";

export function WhyVrindavan() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(".place-connect");
      if (reducedMotion) return;

      revealOnScroll(root);

      root.querySelectorAll<HTMLElement>(".place-reason").forEach((row) => {
        gsap.fromTo(
          row.querySelector(".place-reason-rule"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          },
        );
      });

      const connect = root.querySelector<HTMLElement>(".place-connect");
      const route = root.querySelector<HTMLElement>(".place-route > span");
      if (connect && route) {
        gsap.fromTo(
          route,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: ".place-drive-times", start: "top 92%", end: "top 55%", scrub: 0.4 },
          },
        );
      }

      // Journey times count up once, the way a route resolves on a map.
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((value, index) => {
        const target = Number(value.dataset.count);
        const decimals = value.dataset.count?.includes(".") ? 1 : 0;
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.4,
          delay: index * 0.12,
          ease: "power3.out",
          onUpdate: () => {
            value.textContent = counter.value.toFixed(decimals);
          },
          scrollTrigger: { trigger: ".place-drive-times", start: "top 85%", once: true },
        });
      });
    }, root);

    return () => {
      context.revert();
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((value) => {
        value.textContent = value.dataset.count ?? "";
      });
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  // Desktop: a single preview follows the pointer and crossfades between the reasons.
  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!list || !preview || !canHover || reducedMotion) return;

    const images = Array.from(preview.querySelectorAll<HTMLElement>("[data-preview-index]"));
    const moveX = gsap.quickTo(preview, "x", { duration: 0.55, ease: "power3.out" });
    const moveY = gsap.quickTo(preview, "y", { duration: 0.55, ease: "power3.out" });
    let active = -1;

    gsap.set(preview, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.9 });

    const place = (event: PointerEvent, immediate = false) => {
      const bounds = list.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (immediate) gsap.set(preview, { x, y });
      else {
        moveX(x);
        moveY(y);
      }
    };

    const activate = (index: number) => {
      if (index === active) return;
      active = index;
      images.forEach((image, imageIndex) => image.classList.toggle("is-active", imageIndex === index));
    };

    const handleEnter = (event: PointerEvent) => {
      place(event, true);
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: motionEasings.enter, overwrite: "auto" });
    };
    const handleMove = (event: PointerEvent) => {
      place(event);
      const row = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-reason-index]") : null;
      if (row) activate(Number(row.dataset.reasonIndex));
    };
    const handleLeave = () => {
      active = -1;
      gsap.to(preview, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: motionEasings.exit, overwrite: "auto" });
    };

    list.addEventListener("pointerenter", handleEnter);
    list.addEventListener("pointermove", handleMove);
    list.addEventListener("pointerleave", handleLeave);

    return () => {
      list.removeEventListener("pointerenter", handleEnter);
      list.removeEventListener("pointermove", handleMove);
      list.removeEventListener("pointerleave", handleLeave);
      gsap.killTweensOf(preview);
      gsap.set(preview, { clearProps: "all" });
    };
  }, [reducedMotion]);

  return (
    <section ref={rootRef} id="vrindavan" className="place" aria-labelledby="place-title">
      <header className="place-intro">
        <div className="section-rule" data-reveal>
          <span>02 / Why Vrindavan</span>
          <i />
        </div>
        <h2 id="place-title" className="place-title" data-reveal-lines>
          <MaskedLines lines={["Where heritage", "meets momentum."]} offset={[1]} />
        </h2>
        <p className="place-intro-copy" data-reveal>
          Vrindavan has always drawn people close. Better roads, new communities and growing commerce are
          making it a place to build a life around, not only to visit.
        </p>
      </header>

      <div className="place-reasons-wrap">
        <ol ref={listRef} className="place-reasons" aria-label="Reasons to choose Vrindavan">
          {placeReasons.map((reason, index) => (
            <li className="place-reason" data-reason-index={index} key={reason.id}>
              <span className="place-reason-rule" aria-hidden="true" />
              <span className="place-reason-number" data-reveal>{reason.number}</span>
              <h3 className="place-reason-title" data-reveal>
                <span>{reason.title}</span>
              </h3>
              <div className="place-reason-body" data-reveal>
                <p>{reason.summary}</p>
                <p className="place-reason-tags">{reason.tags}</p>
              </div>
              <figure className="place-reason-thumb">
                <Image src={reason.image.src} alt={reason.image.alt} fill sizes="(max-width: 767px) 88vw, 40vw" />
              </figure>
            </li>
          ))}
        </ol>

        <div ref={previewRef} className="place-preview" aria-hidden="true">
          {placeReasons.map((reason, index) => (
            <div className="place-preview-image" data-preview-index={index} key={reason.id}>
              <Image src={reason.image.src} alt="" fill sizes="24rem" />
            </div>
          ))}
        </div>
      </div>

      <section className="place-connect" aria-labelledby="place-connect-title">
        <div className="place-connect-media" data-reveal-image>
          <Image
            data-parallax="6"
            src="/images/infrastructure/city-highway-flyover-night-aerial.jpg"
            alt="Highway interchange lit up at night"
            fill
            sizes="100vw"
          />
        </div>
        <div className="place-connect-content">
          <p className="place-connect-kicker" data-reveal>Connected by road and rail</p>
          <h3 id="place-connect-title" className="place-connect-title" data-reveal-lines>
            <MaskedLines lines={["Closer than", "you think."]} />
          </h3>
          <div className="place-route" aria-hidden="true">
            <span />
          </div>
          <ol className="place-drive-times" aria-label="Approximate drive times from Vrindavan">
            {driveTimes.map((time) => (
              <li key={time.place} data-reveal>
                <span className="place-drive-value">
                  <span data-count={time.value}>{time.value}</span>
                  <small>{time.unit}</small>
                </span>
                <span className="place-drive-place">{time.place}</span>
              </li>
            ))}
          </ol>
          <p className="place-connect-note" data-reveal>
            Approximate drive times from central Vrindavan. Traffic and routes vary.
          </p>
        </div>
      </section>
    </section>
  );
}
