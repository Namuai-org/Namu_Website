"use client";

import { useEffect, useRef } from "react";
import styles from "./transcribe.module.css";

const BAR_WIDTH = 2;
const BAR_GAP = 6;
/** Fraction of the width the pointer influences either side of itself. */
const REACH = 0.2;
/** Share of the height a bar reaches at full influence. */
const AMPLITUDE = 0.72;
/** Per-frame follow. Low enough that the crest trails the cursor. */
const LERP = 0.1;

/**
 * The line under the hero: a row of dots that swells into a waveform under the
 * pointer and settles back once it leaves.
 *
 * Each bar has a fixed peak from two summed sines, so the shape is stable —
 * moving across it reveals the same waveform rather than a new random one. The
 * pointer only decides how much of that peak each bar is currently showing,
 * falling off linearly over a fifth of the width, so the crest is a travelling
 * bulge rather than a single tall spike.
 *
 * At rest every bar is as tall as it is wide with fully rounded ends, which is
 * what makes the resting state read as a dotted rule.
 */
export function SoundWave({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    if (!host || !svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 1;
    let height = 1;
    let peaks: number[] = [];
    let heights: number[] = [];
    let bars: SVGRectElement[] = [];
    let pointerX: number | null = null;

    const build = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      const count = Math.max(
        1,
        Math.floor((width + BAR_GAP) / (BAR_WIDTH + BAR_GAP)),
      );

      peaks = Array.from({ length: count }, (_, i) => {
        const slow = Math.sin(i * 0.35) * 0.5 + 0.5;
        const fast = Math.sin(i * 1.7) * 0.25 + 0.25;
        return Math.max(0.12, Math.min(1, slow * 0.7 + fast));
      });
      heights = Array.from({ length: count }, (_, i) => heights[i] ?? BAR_WIDTH);

      svg.innerHTML = "";
      bars = peaks.map(() => {
        const bar = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        bar.setAttribute("fill", "currentColor");
        bar.setAttribute("width", String(BAR_WIDTH));
        bar.setAttribute("rx", String(BAR_WIDTH / 2));
        bar.setAttribute("ry", String(BAR_WIDTH / 2));
        svg.appendChild(bar);
        return bar;
      });
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(host);

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX - host.getBoundingClientRect().left;
    };
    const onLeave = () => {
      pointerX = null;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!bars.length) return;

      const count = bars.length;
      const spacing =
        count > 1 ? Math.max(0, (width - count * BAR_WIDTH) / (count - 1)) : BAR_GAP;
      const mid = height / 2;
      const amp = height * AMPLITUDE;
      const reach = width * REACH;

      for (let i = 0; i < count; i++) {
        const x = i * (BAR_WIDTH + spacing);
        const centre = x + BAR_WIDTH / 2;

        // Linear falloff from the pointer; zero everywhere when it has left.
        const influence =
          pointerX === null
            ? 0
            : Math.max(0, 1 - Math.abs(pointerX - centre) / reach);

        const target = BAR_WIDTH + (peaks[i] * amp - BAR_WIDTH) * influence;
        const h = heights[i] + (target - heights[i]) * LERP;
        heights[i] = h;

        const bar = bars[i];
        bar.setAttribute("x", String(x));
        bar.setAttribute("y", String(mid - h / 2));
        bar.setAttribute("height", String(h));
      }
    };

    if (!reduced) raf = requestAnimationFrame(frame);
    else frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={hostRef} className={`${styles.wave} ${className}`.trim()}>
      <svg
        ref={svgRef}
        aria-hidden="true"
        preserveAspectRatio="none"
        className={styles.waveSvg}
      />
    </div>
  );
}
