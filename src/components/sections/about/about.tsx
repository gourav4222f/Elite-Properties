"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { aboutIntroduction, aboutStatement, principles } from "@/data/about";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getScrub, gsap, motionEasings } from "@/lib/gsap";
import { createIvoryHeaderZone, setHeaderTone } from "@/lib/header-tone";
import { revealOnScroll } from "@/lib/reveal";

const statementWords = aboutStatement.split(" ");

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      createIvoryHeaderZone(root);
      if (reducedMotion) return;

      revealOnScroll(root);

      // The statement reads itself in as it travels up the screen.
      gsap.fromTo(
        ".about-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: ".about-statement", start: "top 78%", end: "bottom 42%", scrub: getScrub() },
        },
      );

      root.querySelectorAll<HTMLElement>(".about-principle").forEach((principle, index) => {
        gsap.fromTo(
          principle.querySelector(".about-principle-rule"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            delay: index * 0.08,
            ease: motionEasings.cinematic,
            scrollTrigger: { trigger: ".about-principles", start: "top 85%", once: true },
          },
        );
      });
    }, root);

    return () => {
      context.revert();
      setHeaderTone("ink");
    };
  }, [reducedMotion]);

  return (
    <section ref={rootRef} id="about" className="about" aria-labelledby="about-title">
      <div className="about-head">
        <div className="section-rule" data-reveal>
          <span>03 / About Elite Properties</span>
          <i />
        </div>
        <h2 id="about-title" className="sr-only">About Elite Properties</h2>
        <p className="about-statement">
          {statementWords.map((word, index) => (
            <span className="about-word" key={`${word}-${index}`}>
              {word}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="about-body">
        <figure className="about-image about-image-primary" data-image="up" data-parallax="6">
          <Image
            src="/images/lifestyle/happy-couple-outdoor-lifestyle.webp"
            alt="Couple smiling together outdoors in soft evening light"
            fill
            sizes="(max-width: 767px) 100vw, 40vw"
          />
        </figure>
        <figure className="about-image about-image-secondary" data-image="left" data-parallax="4">
          <Image
            src="/images/commercial/reception-lobby-marble-desk.webp"
            alt="Calm reception lobby with a marble desk and sculptural lighting"
            fill
            sizes="(max-width: 767px) 72vw, 34vw"
          />
        </figure>
        <div className="about-copy">
          <p data-reveal>{aboutIntroduction}</p>
          <div className="about-links" data-reveal>
            <Link className="intent-link" href="/about">
              <span className="intent-link-swap">
                <span>Read our story</span>
                <span aria-hidden="true">Read our story</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
            <Link className="intent-link" href="#contact">
              <span className="intent-link-swap">
                <span>Start a conversation</span>
                <span aria-hidden="true">Start a conversation</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>

      <ol className="about-principles" aria-label="How we work">
        {principles.map((principle) => (
          <li className="about-principle" key={principle.number}>
            <span className="about-principle-rule" aria-hidden="true" />
            <span className="about-principle-number" data-reveal>{principle.number}</span>
            <h3 data-reveal>{principle.title}</h3>
            <p data-reveal>{principle.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
