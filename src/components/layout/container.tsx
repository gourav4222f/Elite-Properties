import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  size?: "wide" | "narrow";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Container<T extends ElementType = "div">({
  as,
  className,
  size = "wide",
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full px-[var(--page-gutter)]",
        size === "wide" ? "max-w-[var(--content-max)]" : "max-w-[var(--content-narrow)]",
        className,
      )}
      {...props}
    />
  );
}
