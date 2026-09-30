import Link, { type LinkProps } from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "border-foreground bg-foreground text-background hover:bg-accent hover:border-accent",
  secondary:
    "border-border bg-transparent text-foreground hover:border-foreground hover:bg-surface",
};

const baseStyles =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--radius-control)] border px-5 text-[0.74rem] font-semibold uppercase tracking-[0.14em] transition-[color,background-color,border-color,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseStyles, buttonStyles[variant], className)}
      {...props}
    />
  );
}

type LinkButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    variant?: ButtonVariant;
    showArrow?: boolean;
  };

export function LinkButton({
  className,
  children,
  variant = "primary",
  showArrow = false,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={cn(baseStyles, buttonStyles[variant], className)} {...props}>
      {children}
      {showArrow ? <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} /> : null}
    </Link>
  );
}
