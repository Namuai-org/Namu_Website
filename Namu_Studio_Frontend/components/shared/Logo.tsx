"use client";

import { cn } from "@/lib/cn";

interface LogoProps {
  size?: "sm" | "md";
  light?: boolean;
}

export function Logo({ size = "md", light = false }: LogoProps): JSX.Element {
  const square = size === "sm" ? "h-7 w-7 rounded-[7px] text-sm" : "h-10 w-10 rounded-[10px] text-[22px]";
  return (
    <div className="flex items-center gap-3">
      <div className={cn("grid place-items-center bg-brand-orange font-bold text-white", square)}>N</div>
      <span className={cn("font-semibold", size === "sm" ? "text-base" : "text-xl", light ? "text-white" : "text-text-dark")}>
        Namu
      </span>
    </div>
  );
}
