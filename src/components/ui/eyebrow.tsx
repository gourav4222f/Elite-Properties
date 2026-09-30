import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-eyebrow text-muted", className)} {...props} />;
}
