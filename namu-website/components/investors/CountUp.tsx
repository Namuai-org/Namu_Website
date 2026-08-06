"use client";

import { useEffect, useRef, useState } from "react";

/** Runs once, on first view. 1.6s is long enough to read as counting. */
const DURATION = 1600;

type Props = {
  to: number;
  /** Decimal places to hold while counting, so "1.2" never flickers to "1". */
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

/**
 * A figure that counts up when it first comes into view.
 *
 * Eased, not linear: a number that decelerates into its final value reads as
 * arriving somewhere, where a constant rate reads as a stopwatch. The final
 * value is always set exactly rather than left wherever the last frame landed.
 *
 * The full value is in the DOM from the first render, so it is correct with no
 * JavaScript and correct for a screen reader; only the visible text animates.
 */
export function CountUp({ to, decimals = 0, prefix = "", suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const run = () => {
      const start = performance.now();
      let raf = 0;
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        // Cubic ease-out: fast away, settling into the figure.
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(to * eased);
        if (t < 1) raf = requestAnimationFrame(frame);
        else setValue(to);
      };
      raf = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(raf);
    };

    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          /* Zeroed here rather than on mount. Zeroing up front left the figure
             showing 0 forever if the observer never fired — a number stuck at
             zero is a worse failure than one that simply does not animate. */
          setValue(0);
          stop = run();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      stop?.();
    };
  }, [to]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
