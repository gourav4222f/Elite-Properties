import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MaskedLines } from "@/components/motion/masked-lines";
import type { Chapter } from "@/data/site";

interface NextChapterProps {
  chapter: Pick<Chapter, "href" | "label" | "theme" | "title" | "summary" | "image">;
  /** Overrides the "Next chapter" label, e.g. "Next property". */
  kicker?: string;
}

/** The close of every page: the next part of the story, one generous click away. */
export function NextChapter({ chapter, kicker = "Next chapter" }: NextChapterProps) {
  return (
    <section className="next-chapter" data-header-ivory aria-label={`${kicker}: ${chapter.label}`}>
      <Link className="next-chapter-link" href={chapter.href}>
        <span className="next-chapter-rule" data-reveal>
          <span>{kicker}</span>
          <i />
          <span>{chapter.theme}</span>
        </span>
        <span className="next-chapter-title" data-reveal-lines>
          <MaskedLines lines={chapter.title} />
        </span>
        <span className="next-chapter-summary" data-reveal>
          {chapter.summary}
        </span>
        <span className="next-chapter-cta" data-reveal>
          <span className="intent-link-swap">
            <span>Continue to {chapter.label}</span>
            <span aria-hidden="true">Continue to {chapter.label}</span>
          </span>
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
        </span>
        <span className="next-chapter-media" data-image="up" data-parallax="5">
          <Image src={chapter.image.src} alt="" fill sizes="(max-width: 767px) 100vw, 40vw" />
        </span>
      </Link>
    </section>
  );
}
