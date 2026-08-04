"use client";

import { useEffect, useRef } from "react";
import styles from "./voice.module.css";

/** Scroll runway, in viewports, over which the word travels end to end. */
const RUNWAY = 1.5;
/** Per-frame follow. Low enough that the word lags the scroll and glides. */
const LERP = 0.06;
/** The house easeOut — the same curve the rest of the system uses. */
const EASE = [0.43, 0.195, 0.02, 1] as const;

/** Cubic-bezier solver: Newton-Raphson on x, then evaluate y. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;
  const calc = (t: number, a: number, b: number) =>
    ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t: number, a: number, b: number) =>
    3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);

  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (s === 0) break;
      t -= (calc(t, x1, x2) - x) / s;
    }
    return calc(t, y1, y2);
  };
}

const ease = bezier(EASE[0], EASE[1], EASE[2], EASE[3]);

/**
 * "Built for looooong form", set far wider than its window and slid sideways
 * as the page scrolls, so the drawn-out vowel is revealed rather than shown.
 *
 * The word itself never changes — the joke is in the travel. It runs from its
 * left edge to its right over one and a half viewports, eased, then lerped
 * each frame so it trails the scroll instead of tracking it exactly.
 */
export function LongFormHeading({ text, srText }: { text: string; srText: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const title = titleRef.current;
    if (!host || !title) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = 0;
    let titleWidth = 0;
    let hostWidth = 0;

    const measure = () => {
      titleWidth = title.scrollWidth;
      hostWidth = host.clientWidth;
      /* Shorter phrases fit the full-bleed window outright. With no travel
         there is no slide to make, so it centres and reads as a plain
         headline; lengthen the copy and the marquee returns on its own. */
      host.dataset.static = titleWidth <= hostWidth ? "true" : "false";
    };

    const targetX = () => {
      const travel = Math.max(0, titleWidth - hostWidth);
      if (travel === 0) return 0;
      const rect = host.getBoundingClientRect();
      // Starts as the block reaches 0.9 of a viewport from the top.
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.9 - rect.top) / (window.innerHeight * RUNWAY)),
      );
      return -travel * ease(p);
    };

    measure();
    // Re-measure once the serif has actually loaded; the word's width is the
    // whole basis of the travel.
    document.fonts?.ready.then(measure).catch(() => {});
    const ro = new ResizeObserver(measure);
    ro.observe(host);

    if (reduced) {
      title.style.transform = "translate3d(0,0,0)";
      return () => ro.disconnect();
    }

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);

      /* The reference drops the marquee on phones and centres a plain
         heading instead; the stylesheet does that, so stand well clear. */
      if (window.innerWidth <= 600) {
        if (x !== 0) {
          x = 0;
          title.style.transform = "";
        }
        return;
      }

      const rect = host.getBoundingClientRect();
      // Idle unless the block is within a runway of the viewport.
      if (
        rect.bottom < -window.innerHeight ||
        rect.top > window.innerHeight * (1 + RUNWAY)
      ) {
        return;
      }

      const target = targetX();
      x += (target - x) * LERP;
      title.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} className={styles.longForm}>
      <h3 className={styles.longFormHeading}>
        <span className="sr-only">{srText}</span>
        <span ref={titleRef} className={styles.longFormLine} aria-hidden="true">
          {text}
        </span>
      </h3>
    </div>
  );
}
