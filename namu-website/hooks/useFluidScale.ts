"use client";

import { useEffect } from "react";

/**
 * Keeps --vw in sync with the scrollbar-free client width so the fluid unit
 * scale never jitters when a scrollbar appears, and locks the scale at 1:1
 * above the reference width.
 *
 * Also publishes --vh / --vhfix for viewport-height maths that must survive
 * the mobile URL bar collapsing.
 */
export function useFluidScale(refWidth = 1728) {
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      const w = root.clientWidth;
      root.style.setProperty("--vw", `${Math.min(w, refWidth)}px`);
      root.style.setProperty("--vh", `${window.innerHeight}px`);
    };

    // --vhfix only updates on width change, so a collapsing mobile URL bar
    // does not resize pinned full-height sections mid-scroll.
    const applyFix = () => {
      root.style.setProperty("--vhfix", `${window.innerHeight}px`);
    };

    let lastWidth = root.clientWidth;
    const onResize = () => {
      apply();
      if (root.clientWidth !== lastWidth) {
        lastWidth = root.clientWidth;
        applyFix();
      }
    };

    apply();
    applyFix();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [refWidth]);
}
