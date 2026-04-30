import { Link, type LinkProps } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent/90 border border-accent/80",
  ghost:
    "bg-transparent text-foreground hover:bg-muted border border-transparent hover:border-border",
  danger:
    "bg-destructive/90 text-white hover:bg-destructive border border-destructive",
} as const;

type Variant = keyof typeof variants;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50";

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: LinkProps & { variant?: Variant; children: ReactNode }) {
  return (
    <Link
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
