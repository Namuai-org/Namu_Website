"use client";

import { useLayoutEffect, useRef } from "react";
import { useRafScroll } from "@/hooks/useRafScroll";
import styles from "./voice.module.css";

export type Dialect = { name: string; tint: string };

/** Radians the ring turns per viewport of scroll — deliberately slow. */
const TURN_PER_VIEWPORT = 0.3;
const START_ANGLE = -Math.PI * 0.6;

/**
 * The dialect names orbit the heading rather than sitting in a row.
 *
 * Chips are spaced evenly by angle around an ellipse inscribed in the block,
 * inset by half a chip so nothing clips at the edges, and the whole ring turns
 * as the page scrolls. Positions are written straight to style from the shared
 * scroll loop — putting them through React state would re-render eight nodes a
 * frame for no benefit.
 */
export function DialectRing({
  dialects,
  center,
}: {
  dialects: Dialect[];
  /**
   * Shown in the middle of the orbit where the heading cannot be — on a phone
   * the heading sits above the ring, so the centre would otherwise be empty.
   */
  center?: { value: string; caption: string };
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const place = (angle: number) => {
    const host = hostRef.current;
    if (!host) return;

    /* The same orbit at every width. On a phone the heading moves above the
       ring rather than sitting inside it — eight chips circling a narrow box
       would land on the copy — and the stylesheet shrinks the chips so
       neighbours clear each other at every angle the ring turns through. */
    const w = host.clientWidth;
    const h = host.clientHeight;
    const step = (Math.PI * 2) / dialects.length;

    let maxW = 0;
    let maxH = 0;
    for (const chip of chipRefs.current) {
      if (!chip) continue;
      maxW = Math.max(maxW, chip.offsetWidth);
      maxH = Math.max(maxH, chip.offsetHeight);
    }

    chipRefs.current.forEach((chip, i) => {
      if (!chip) return;
      const a = i * step + angle;
      const x = w / 2 - chip.offsetWidth / 2 + Math.cos(a) * (w / 2 - maxW / 2);
      const y = h / 2 - chip.offsetHeight / 2 + Math.sin(a) * (h / 2 - maxH / 2);
      chip.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateZ(0)`;
    });
  };

  // Lay them out before first paint so they never flash stacked at the corner.
  useLayoutEffect(() => {
    place(START_ANGLE);
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(() => place(START_ANGLE + window.scrollY / window.innerHeight * TURN_PER_VIEWPORT));
    ro.observe(host);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialects.length]);

  useRafScroll((scrollY, viewportH) => {
    const host = hostRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    // Skip while the block is nowhere near the viewport.
    if (rect.bottom < -200 || rect.top > viewportH + 200) return;

    place(START_ANGLE + (scrollY / viewportH) * TURN_PER_VIEWPORT);
  });

  return (
    <div ref={hostRef} className={styles.ring}>
      {center ? (
        <div className={styles.ringCenter} aria-hidden="true">
          <span className={styles.ringCenterValue}>{center.value}</span>
          <span className={`text-caption ${styles.ringCenterCaption}`}>
            {center.caption}
          </span>
        </div>
      ) : null}
      {dialects.map((d, i) => (
        <span
          key={d.name}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          className={`text-small ${styles.ringChip}`}
          style={{ background: d.tint }}
        >
          {d.name}
        </span>
      ))}
    </div>
  );
}
