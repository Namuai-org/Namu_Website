"use client";

import { useEffect } from "react";

/**
 * Scroll-triggered reveals for landing sections.
 * threshold 0.1 so motion starts as content enters the viewport (no deferred timers).
 */
export function useScrollReveal(
  selector = ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-fade"
) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const connect = () => {
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
        { threshold: 0.1, rootMargin: "0px" }
      );

      elements.forEach((el) => observer!.observe(el));
    };

    connect();

    return () => {
      observer?.disconnect();
    };
  }, [selector]);
}
