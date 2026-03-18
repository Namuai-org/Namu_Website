"use client";

import { formatInitials } from "@/lib/utils";

export function Avatar({ name, className = "h-10 w-10 text-[15px]" }: { name: string; className?: string }): JSX.Element {
  return (
    <div className={`grid place-items-center rounded-full bg-brand-orange font-semibold text-white ${className}`}>
      {formatInitials(name)}
    </div>
  );
}
