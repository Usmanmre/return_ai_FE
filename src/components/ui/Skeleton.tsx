import type { HTMLAttributes } from "react";

export function Skeleton({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/80 ${className}`}
      aria-hidden
      {...rest}
    />
  );
}

export function SkeletonBlock({ lines = 4 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3 w-full"
          style={{ width: `${85 - i * 12}%` }}
        />
      ))}
    </div>
  );
}
