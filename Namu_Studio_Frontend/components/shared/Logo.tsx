"use client";

import { useId } from "react";

import { cn } from "@/lib/cn";

interface LogoProps {
  size?: "sm" | "md";
  className?: string;
}

/**
 * Vector Namu wordmark (mark + “amu”) sized for light and dark themes via `--text-primary`.
 * Avoids a single PNG tuned for dark nav bars, which disappears on cream UI.
 */
export function Logo({ size = "md", className }: LogoProps): JSX.Element {
  const uid = useId().replace(/:/g, "");
  const gradId = `namu-logo-grad-${uid}`;
  const clipId = `namu-logo-clip-${uid}`;

  return (
    <svg
      className={cn("shrink-0", size === "sm" ? "h-9 w-auto" : "h-11 w-auto", className)}
      viewBox="0 0 210 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Namu"
    >
      <title>Namu</title>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ea9b7e" />
          <stop offset="100%" stopColor="#da7756" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="72" height="84" />
        </clipPath>
      </defs>
      <g transform="translate(0 2) scale(0.3333333333)">
        <rect x="4" y="6" width="18" height="72" rx="2.5" fill="var(--text-primary, #1a1510)" />
        <g clipPath={`url(#${clipId})`}>
          <polygon points="4,6 22,6 68,78 50,78" fill={`url(#${gradId})`} />
        </g>
        <rect x="50" y="6" width="18" height="72" rx="2.5" fill="var(--text-primary, #1a1510)" />
        <circle cx="51" cy="9.5" r="5.5" fill="#da7756" />
      </g>
      <text
        x="22"
        y="27.75"
        fill="var(--text-primary, #1a1510)"
        style={{
          fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
          fontSize: 23,
          fontWeight: 600,
          letterSpacing: "-0.04em",
        }}
      >
        amu
      </text>
    </svg>
  );
}
