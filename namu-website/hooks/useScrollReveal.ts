"use client";

import { useEffect } from "react";

export type UseScrollRevealOptions = {
  /** Wait this many animation frames after mount before observing (lets blur/hidden state paint first). */
  deferFrames?: number;
};

/**
 * Scroll-triggered reveals for landing sections.
 *
 * threshold: 0 — any visible pixel counts, so tall blocks (e.g. hero) still reveal.
 */
export function useScrollReveal(
  selector = ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-fade",
  options?: UseScrollRevealOptions
) {
  const deferFrames = options?.deferFrames ?? 0;

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    const rafIds: number[] = [];

    const connect = () => {
      if (cancelled) return;
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      if (!elements.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0,
          rootMargin: "0px 0px 0px 0px",
        }
      );

      elements.forEach((el) => observer!.observe(el));
    };

    if (deferFrames <= 0) {
      connect();
    } else {
      let remaining = deferFrames;
      const tick = () => {
        if (cancelled) return;
        remaining -= 1;
        if (remaining <= 0) {
          connect();
        } else {
          rafIds.push(requestAnimationFrame(tick));
        }
      };
      rafIds.push(requestAnimationFrame(tick));
    }

    return () => {
      cancelled = true;
      rafIds.forEach((id) => cancelAnimationFrame(id));
      observer?.disconnect();
    };
  }, [selector, deferFrames]);
}
