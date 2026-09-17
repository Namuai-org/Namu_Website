"use client";

import { useEffect, useRef } from "react";
import { micLevel } from "@/hooks/useRecorder";
import styles from "./playground.module.css";

const BARS = 15;

/**
 * The microphone, drawn.
 *
 * Written straight to the DOM rather than through state: this follows the
 * voice sixty times a second, and a re-render per frame would cost far more
 * than the reading is worth. At rest every bar sits at its floor, so the row
 * reads as a quiet line waiting to be spoken into.
 */
export function LevelMeter({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const bars = Array.from(row.children) as HTMLElement[];

    if (!active) {
      bars.forEach((bar) => {
        bar.style.transform = "scaleY(0.12)";
      });
      return;
    }

    let frame = 0;
    let time = 0;
    const tick = () => {
      time += 0.09;
      const level = micLevel.value;
      bars.forEach((bar, i) => {
        // A standing wave shaped by the level, tallest in the middle so the
        // row reads as one voice rather than fifteen meters.
        const centre = 1 - Math.abs(i - (BARS - 1) / 2) / ((BARS - 1) / 2);
        const wave = 0.45 + Math.abs(Math.sin(time + i * 0.5)) * 0.55;
        const height = 0.12 + level * wave * (0.45 + centre * 0.55);
        bar.style.transform = `scaleY(${Math.min(1, height).toFixed(3)})`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <div ref={ref} className={styles.meter} data-active={active} aria-hidden="true">
      {Array.from({ length: BARS }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
