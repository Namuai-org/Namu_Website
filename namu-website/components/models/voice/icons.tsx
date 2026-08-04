import type { CSSProperties } from "react";

type IconProps = { className?: string; style?: CSSProperties };

/** Solid triangle, optically centred inside a round transport button. */
export function Play({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M11.5 7 0.5 13.5V0.5L11.5 7Z" fill="currentColor" />
    </svg>
  );
}

export function Pause({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width="3.5" height="13" fill="currentColor" />
      <rect x="8" y="0.5" width="3.5" height="13" fill="currentColor" />
    </svg>
  );
}

/** Small tick used beside the long-form use-case list. */
export function Check({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 8.5 6.5 12.5 13.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Speaker glyph for the dialect selector. */
export function Waveform({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {[
        [3, 8, 4],
        [7, 4, 12],
        [11, 6, 8],
        [15, 9, 2],
      ].map(([x, y, h]) => (
        <rect
          key={x}
          x={x}
          y={y}
          width="1.6"
          height={h}
          rx="0.8"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
