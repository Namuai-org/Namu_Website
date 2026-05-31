"use client";

import type { CSSProperties, SVGProps } from "react";
import styles from "./namu-logo-mark.module.css";

type NamuLogoMarkProps = {
  variant?: "onDark" | "onLight";
  height?: number;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "viewBox" | "xmlns">;

/**
 * Namu N mark — amber left stroke, neutral body.
 * onDark  : amber bar + white diagonal/right bar (for dark backgrounds)
 * onLight : amber bar + dark diagonal/right bar  (for light backgrounds)
 */
export function NamuLogoMark({
  variant = "onDark",
  height = 28,
  className = "",
  style,
  ...svgProps
}: NamuLogoMarkProps) {
  const body = variant === "onDark" ? "#F5EFE6" : "#1A1510";

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
      {/* Left bar — dark/body */}
      <rect x="4" y="6" width="18" height="72" rx="2.5" fill={body} />

      {/* Diagonal — amber */}
      <polygon points="4,6 22,6 68,78 50,78" fill="#D6703F" />

      {/* Right bar — dark/body */}
      <rect x="50" y="6" width="18" height="72" rx="2.5" fill={body} />
    </svg>
  );
}
