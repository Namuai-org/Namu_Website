"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-driven progress 0–1 over the first 120px of vertical scroll.
 * Updates are coalesced with requestAnimationFrame; scroll listener is passive.
 */
export function useScrollRevealLogo(): number {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const readScroll = () => {
      rafIdRef.current = null;
      const y = window.scrollY;
      const p = Math.min(y / 120, 1);
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
