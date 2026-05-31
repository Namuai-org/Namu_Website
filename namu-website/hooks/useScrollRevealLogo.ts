"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Scroll distance (px) over which the logo reveal completes (0 → 1). */
const REVEAL_DISTANCE = 120;

/**
 * Returns scroll progress 0–1 over the first REVEAL_DISTANCE px.
 * RAF-coalesced for performance.
 */
export function useScrollRevealLogo(): number {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const readScroll = () => {
      rafIdRef.current = null;
      const p = Math.min(window.scrollY / REVEAL_DISTANCE, 1);
      setProgress(p);
    };

    const onScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(readScroll);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [pathname]);

  return progress;
}
