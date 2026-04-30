import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  id: string;
};

export function Textarea({ label, id, className = "", ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <textarea
        id={id}
        className={`min-h-[120px] resize-y rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-offset-background ${className}`}
        {...rest}
      />
    </div>
  );
}
