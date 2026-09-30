import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

type SectionProps<T extends ElementType = "section"> = {
  as?: T;
  spacing?: "compact" | "default" | "generous";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Section<T extends ElementType = "section">({
  as,
  className,
  spacing = "default",
  ...props
}: SectionProps<T>) {
  const Component = as ?? "section";
  const spacingClass = {
    compact: "py-[clamp(3rem,7vw,6rem)]",
    default: "py-[var(--section-space)]",
    generous: "py-[clamp(7rem,15vw,13rem)]",
  }[spacing];

  return <Component className={cn(spacingClass, className)} {...props} />;
}
