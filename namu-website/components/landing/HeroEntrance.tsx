"use client";

import type { ReactNode } from "react";

type HeroEntranceProps = {
  children: ReactNode;
  className?: string;
};

/** Blur → crisp entrance on mount; stagger direct children by 80ms (see `.hero-entrance` in globals.css). */
export function HeroEntrance({ children, className }: HeroEntranceProps) {
  return <div className={["hero-entrance", className].filter(Boolean).join(" ")}>{children}</div>;
}
