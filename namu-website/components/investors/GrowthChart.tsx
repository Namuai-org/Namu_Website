"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./investors.module.css";

export type Point = { label: string; value: number };

const VB_W = 900;
const VB_H = 320;
const PAD_T = 24;
const PAD_B = 44;

/**
 * Monthly volume, drawn rather than tabulated.
 *
 * An investor scans a shape before they read a number, so the series gets a
 * chart and the figures underneath it get the precision. The line draws itself
 * in on first view and the area fills behind it, both off one progress value,
 * so it reads as one gesture rather than two animations.
 */
export function GrowthChart({ points, unit }: { points: Point[]; unit: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setDrawn(true),
      { threshold: 0.25 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...points.map((p) => p.value));
  const stepX = VB_W / (points.length - 1);
  const y = (v: number) => PAD_T + (1 - v / max) * (VB_H - PAD_T - PAD_B);
  const coords = points.map((p, i) => ({ x: i * stepX, y: y(p.value) }));

  /* Quadratic smoothing, the same construction the voice page's wave uses, so
     the curve has no corner at any month. */
  let line = `M${coords[0].x} ${coords[0].y.toFixed(1)}`;
  for (let i = 1; i < coords.length - 1; i++) {
    const mx = (coords[i].x + coords[i + 1].x) / 2;
    const my = (coords[i].y + coords[i + 1].y) / 2;
    line += ` Q${coords[i].x} ${coords[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = coords[coords.length - 1];
  line += ` L${last.x} ${last.y.toFixed(1)}`;

  const area = `${line} L${VB_W} ${VB_H - PAD_B} L0 ${VB_H - PAD_B} Z`;

  return (
    <div ref={hostRef} className={styles.chart}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className={styles.chartSvg}
        role="img"
        aria-label={`Monthly ${unit}, ${points[0].label} to ${points[points.length - 1].label}`}
      >
        {/* Baseline and one mid rule, enough to read height against. */}
        <line
          x1="0"
          x2={VB_W}
          y1={VB_H - PAD_B}
          y2={VB_H - PAD_B}
          className={styles.chartAxis}
        />
        <line
          x1="0"
          x2={VB_W}
          y1={y(max / 2)}
          y2={y(max / 2)}
          className={styles.chartRule}
        />

        <path
          d={area}
          className={`${styles.chartArea} ${drawn ? styles.chartAreaIn : ""}`}
        />
        <path
          d={line}
          pathLength={1}
          className={`${styles.chartLine} ${drawn ? styles.chartLineIn : ""}`}
        />

        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={i === coords.length - 1 ? 6 : 4}
            className={`${styles.chartDot} ${drawn ? styles.chartDotIn : ""} ${
              i === coords.length - 1 ? styles.chartDotLast : ""
            }`}
            style={{ transitionDelay: `${0.55 + i * 0.05}s` }}
          />
        ))}
      </svg>

      <ol className={styles.chartLabels}>
        {points.map((p) => (
          <li key={p.label} className={`text-caption ${styles.chartLabel}`}>
            {p.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
