"use client";

import { useEffect, useRef } from "react";
import styles from "./voice.module.css";

/** Samples across the band. Enough that the quadratic smoothing reads as a curve. */
const POINTS = 96;
/** Viewbox the paths are authored in; the SVG stretches it to any real size. */
const VB_W = 1280;
const VB_H = 509;

/**
 * Build one stroked line through a set of points.
 *
 * Quadratic segments anchored on each point and ending at the midpoint of the
 * next pair — the standard smoothing, and the same path grammar the reference
 * emits (`M … Q … L …`), which is what keeps the curve continuous instead of
 * showing a corner at every sample.
 */
function toPath(ys: number[]) {
  const step = VB_W / (POINTS - 1);
  const x = (i: number) => i * step;

  let d = `M${x(0).toFixed(1)} ${ys[0].toFixed(1)}`;
  for (let i = 1; i < ys.length - 1; i++) {
    const mx = (x(i) + x(i + 1)) / 2;
    const my = (ys[i] + ys[i + 1]) / 2;
    d += ` Q${x(i).toFixed(1)} ${ys[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = ys.length - 1;
  return `${d} L${x(last).toFixed(1)} ${ys[last].toFixed(1)}`;
}

/**
 * The full-bleed wave under "Instant voice matching".
 *
 * Two lines rather than one, because the section is about matching: read it as
 * the reference clip and the voice built from it. They run apart through the
 * middle of the band and meet at both ends, which is the claim made without a
 * caption.
 *
 * Each line is a sum of two travelling sines at different periods, so the
 * envelope swells and thins the way a spoken line does rather than pulsing
 * evenly. SVG rather than canvas: two stroked paths are cheaper than 160
 * animated rectangles, and they stay crisp at any width because the stroke is
 * exempt from the viewBox stretch.
 */
export function WaveBand() {
  const aRef = useRef<SVGPathElement>(null);
  const bRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Only run while the band is on screen. */
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(a.ownerSVGElement ?? a);

    const mid = VB_H / 2;
    const amp = VB_H * 0.34;

    /** One line's samples at time `t`. `phase` separates the two voices. */
    const line = (t: number, phase: number, lean: number) => {
      const ys: number[] = [];
      for (let i = 0; i < POINTS; i++) {
        const u = i / (POINTS - 1);
        /* Zero at both ends, so the two lines converge where the band does. */
        const edge = Math.sin(u * Math.PI) ** 1.4;
        const slow = Math.sin(u * 6.2 + phase - t * 0.9);
        const fast = Math.sin(u * 15.5 + phase * 1.7 - t * 1.6);
        ys.push(mid + edge * amp * (slow * 0.62 + fast * 0.38) * lean);
      }
      return ys;
    };

    const draw = (t: number) => {
      a.setAttribute("d", toPath(line(t, 0, 1)));
      /* Offset in phase and mirrored, so the pair opens and closes rather than
         running in parallel. */
      b.setAttribute("d", toPath(line(t, 1.9, -0.86)));
    };

    /* Draw once up front so the band is never a pair of empty paths waiting on
       the first frame, and so it still shows something if the section mounts
       off screen. */
    draw(0);
    if (reduced) return () => io.disconnect();

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      draw((now - start) / 1000);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <svg
      className={styles.wave}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path ref={aRef} className={styles.waveLineA} />
      <path ref={bRef} className={styles.waveLineB} />
    </svg>
  );
}
