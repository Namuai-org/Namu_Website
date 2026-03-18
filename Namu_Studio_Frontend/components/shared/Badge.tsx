"use client";

import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", className)}>{children}</span>;
}
