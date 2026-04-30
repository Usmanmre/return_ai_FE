import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "muted";
};

const tones = {
  default: "bg-muted text-foreground border-border",
  success: "bg-accent/15 text-accent border-accent/40",
  warning: "bg-amber-500/15 text-amber-200 border-amber-500/40",
  muted: "bg-muted/60 text-muted-foreground border-border",
};

export function Badge({
  children,
  tone = "default",
  className = "",
  ...rest
}: Props) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium font-mono ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
