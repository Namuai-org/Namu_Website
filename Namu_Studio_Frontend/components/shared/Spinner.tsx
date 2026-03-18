"use client";

import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }): JSX.Element {
  return (
    <span
      className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent", className)}
      aria-hidden="true"
    />
  );
}
