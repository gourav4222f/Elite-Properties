import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface IntentLinkProps {
  href: string;
  label: string;
  className?: string;
  /** Spoken in place of the visible label when it needs more context. */
  ariaLabel?: string;
}

/** The site's text link: an underlined label that rolls over to itself, with a lifting arrow. */
export function IntentLink({ href, label, className, ariaLabel }: IntentLinkProps) {
  return (
    <Link className={cn("intent-link", className)} href={href} aria-label={ariaLabel}>
      <span className="intent-link-swap">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
    </Link>
  );
}
