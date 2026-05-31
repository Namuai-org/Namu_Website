"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

/**
 * Returns true once the element referenced by `ref` intersects the viewport
 * by at least `threshold` (0–1). Stays true after the first intersection.
 */
export function useInView(
  ref: RefObject<HTMLElement | null>,
  threshold = 0.1,
  once = true
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once]);

  return inView;
}
