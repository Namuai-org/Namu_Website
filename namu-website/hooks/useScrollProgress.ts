"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

/**
 * Maps scroll progress through a section to [0, 1]: 0 when the section top
 * reaches the viewport top, 1 when the section has been scrolled by
 * (section height − viewport height). Intended to be read from
 * requestAnimationFrame (e.g. with lerp) — scroll handler only updates this ref.
 */
export function useScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const progressTargetRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) {
        progressTargetRef.current = 0;
        return;
      }
      const rect = el.getBoundingClientRect();
      const scrollRange = Math.max(1, el.offsetHeight - window.innerHeight);
      const scrolledInto = -rect.top;
      progressTargetRef.current = Math.min(1, Math.max(0, scrolledInto / scrollRange));
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  return progressTargetRef;
}
