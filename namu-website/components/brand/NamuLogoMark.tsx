"use client";

import type { CSSProperties, SVGProps } from "react";
import { useEffect, useId, useRef } from "react";
import styles from "./namu-logo-mark.module.css";

type NamuLogoMarkProps = {
  variant?: "onDark" | "onLight";
  /** Pixel height; width follows 72:84 aspect ratio */
  height?: number;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "viewBox" | "xmlns">;

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((v) =>
      Math.round(Math.min(255, Math.max(0, v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function lerpHex(a: string, b: string, t: number) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(lerp(ar, br, t), lerp(ag, bg, t), lerp(ab, bb, t));
}

/** Namu wordmark geometry from brand SVG; motion tuned for calm, Anthropic-like ambient feel */
export function NamuLogoMark({
  variant = "onDark",
  height = 28,
  className = "",
  style,
  ...svgProps
}: NamuLogoMarkProps) {
  const reactId = useId().replace(/:/g, "");
  const gradId = `namu-og-${reactId}`;
  const clipId = `namu-clip-${reactId}`;

  const stop0Ref = useRef<SVGStopElement>(null);
  const stop1Ref = useRef<SVGStopElement>(null);

  const barFill = variant === "onDark" ? "#F5EFE6" : "#1A1510";

  useEffect(() => {
    const stop0 = stop0Ref.current;
    const stop1 = stop1Ref.current;
    if (!stop0 || !stop1) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const periodMs = 12_000;
    const c1a = "#F08050";
    const c1b = "#E06838";
    const c2a = "#A84E25";
    const c2b = "#C4603A";

    let t0: number | null = null;

    const tick = (ts: number) => {
      if (mq.matches) return;
      if (t0 === null) t0 = ts;
      const raw = ((ts - t0) % periodMs) / periodMs;
      const w = raw < 0.5 ? easeInOutQuad(raw * 2) : easeInOutQuad((1 - raw) * 2);
      stop0.setAttribute("stop-color", lerpHex(c1a, c1b, w));
      stop1.setAttribute("stop-color", lerpHex(c2a, c2b, w));
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      t0 = null;
      if (mq.matches) return;
      raf = requestAnimationFrame(tick);
    };

    start();
    mq.addEventListener("change", start);
    return () => {
      mq.removeEventListener("change", start);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      className={`${styles.mark} ${className}`.trim()}
      viewBox="0 0 72 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable={false}
      style={
        {
          ...style,
          ["--namu-logo-h" as string]: `${height}px`,
        } as CSSProperties
      }
      {...svgProps}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop ref={stop0Ref} offset="0%" stopColor="#F08050" />
          <stop ref={stop1Ref} offset="100%" stopColor="#A84E25" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="72" height="84" />
        </clipPath>
      </defs>
      <circle className={styles.halo} cx="36" cy="44" r="22" fill="#D6703F" />
      <rect className={styles.barL} x="4" y="6" width="18" height="72" rx="2.5" fill={barFill} />
      <g className={styles.diag} clipPath={`url(#${clipId})`}>
        <polygon points="4,6 22,6 68,78 50,78" fill={`url(#${gradId})`} />
      </g>
      <rect className={styles.barR} x="50" y="6" width="18" height="72" rx="2.5" fill={barFill} />
      <circle className={styles.dot} cx="51" cy="9.5" r="5.5" fill="#D6703F" />
    </svg>
  );
}
