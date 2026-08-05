"use client";

import { useEffect, useRef } from "react";
import styles from "./voice.module.css";

/** Viewbox the paths are authored in; the SVG stretches it to any real size. */
const VB_W = 1280;
const VB_H = 509;

/* The reference samples every 2 viewBox units and starts just outside the left
   edge, so the curve is cut off by the frame rather than ending inside it. */
const STEP = 2;
const OVERSHOOT = 4;
const POINTS = Math.round((VB_W + OVERSHOOT * 2) / STEP) + 1;

const TAU = Math.PI * 2;
/** Cycles across the band. The two lines differ slightly so they beat. */
const CYCLES_A = 26;
const CYCLES_B = 28.5;
/** Peak height as a share of the band. */
const AMP = 0.44;
/** How fast the waveform travels, and how fast the loud parts drift along it. */
const CARRIER_SPEED = 2.1;
const ENVELOPE_SPEED = 0.62;

const x = (i: number) => -OVERSHOOT + i * STEP;

/**
 * Build one stroked line through a set of points.
 *
 * Quadratic segments anchored on each point and ending at the midpoint of the
 * next pair — the standard smoothing, and the same path grammar the reference
 * emits (`M … Q … L …`), which is what keeps a curve this dense continuous
 * instead of showing a corner at every sample.
 */
function toPath(ys: number[]) {
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
 * Two lines rather than one, because the section is about matching: read them
 * as the reference clip and the voice built from it, the same waveform at
 * slightly different rates so they drift in and out of phase.
 *
 * The shape is a fast carrier under a slow envelope, which is what makes it
 * read as speech: a run of tight oscillations whose height swells and thins
 * along the band rather than a even ribbon at constant amplitude. Both the
 * carrier and the envelope travel, so the loud parts move through the wave
 * instead of sitting in one place.
 *
 * SVG rather than canvas: two stroked paths are cheaper than a few hundred
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
    const amp = VB_H * AMP;

    /* Reused between frames — allocating two arrays of this size sixty times a
       second is the one thing here worth avoiding. */
    const bufA = new Array<number>(POINTS);
    const bufB = new Array<number>(POINTS);

    const fill = (
      out: number[],
      t: number,
      cycles: number,
      phase: number,
      envPhase: number,
    ) => {
      for (let i = 0; i < POINTS; i++) {
        const u = (x(i) + OVERSHOOT) / (VB_W + OVERSHOOT * 2);
        /* Never fully silent, never flat: the quiet stretches still show a
           line with shape in it. */
        const env =
          0.34 +
          0.66 *
            (0.5 + 0.5 * Math.sin(u * 6.4 + envPhase - t * ENVELOPE_SPEED));
        out[i] =
          mid + amp * env * Math.sin(u * cycles * TAU + phase - t * CARRIER_SPEED);
      }
      return out;
    };

    const draw = (t: number) => {
      a.setAttribute("d", toPath(fill(bufA, t, CYCLES_A, 0, 0)));
      /* Offset in phase and running a little faster, so the pair crosses over
         and over instead of tracking each other. */
      b.setAttribute("d", toPath(fill(bufB, t, CYCLES_B, Math.PI * 0.85, 2.4)));
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
