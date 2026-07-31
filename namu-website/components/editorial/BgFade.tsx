"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRafScroll } from "@/hooks/useRafScroll";

type Props = {
  /** Background this block tints the page to while it owns the midpoint. */
  bg?: string;
  /** Text colour to pair with it. */
  text?: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

/**
 * Whichever tagged block contains the viewport's midpoint re-tints the page.
 * The 1.1s transition on .ds-root turns the handover into a slow crossfade,
 * which is what gives the page its colour rhythm as you scroll.
 */
export function BgFade({ bg, text, children, className, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const owning = useRef(false);

  useRafScroll((scrollY, viewportH) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const mid = viewportH / 2;
    const contains = rect.top <= mid && rect.bottom >= mid;

    if (contains === owning.current) return;
    owning.current = contains;

    const root = document.documentElement;
    if (contains) {
      if (bg) root.style.setProperty("--ds-bg", bg);
      if (text) root.style.setProperty("--ds-text", text);
    }
  });

  // Hand the page back to its defaults if this block unmounts while owning.
  useEffect(
    () => () => {
      if (!owning.current) return;
      document.documentElement.style.removeProperty("--ds-bg");
      document.documentElement.style.removeProperty("--ds-text");
    },
    [],
  );

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
}
