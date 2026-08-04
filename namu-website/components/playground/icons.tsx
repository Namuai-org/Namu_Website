import type { CSSProperties } from "react";

type IconProps = { className?: string; style?: CSSProperties };

/* All of these are stroke-only on `currentColor` with no intrinsic size, so the
   caller sets colour and dimensions from CSS — the same contract as
   components/editorial/icons.tsx. */

const base = {
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Two speech bubbles facing each other — the interpreters. */
export function GlyphInterpret({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" {...base}>
      <path
        d="M3 6.5A2.5 2.5 0 0 1 5.5 4h5A2.5 2.5 0 0 1 13 6.5v3A2.5 2.5 0 0 1 10.5 12H7l-3 2.5V12H5.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M21 13.5A2.5 2.5 0 0 0 18.5 11h-3"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M21 13.5v3a2.5 2.5 0 0 1-2.5 2.5H15l-3 2.5V19h-.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** A waveform resolving into ruled lines — transcription. */
export function GlyphTranscribe({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" {...base}>
      {[
        [2, 10, 4],
        [5, 7, 10],
        [8, 4, 16],
        [11, 8, 8],
      ].map(([x, y, h]) => (
        <rect
          key={x}
          x={x}
          y={y}
          width="1.4"
          height={h}
          rx="0.7"
          fill="currentColor"
        />
      ))}
      <path
        d="M16 9h6M16 12h6M16 15h4"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** A speaker throwing sound — synthesis. */
export function GlyphVoice({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" {...base}>
      <path
        d="M11 4 6 8H3v8h3l5 4V4Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M15.5 9a4 4 0 0 1 0 6M18.5 6.2a8 8 0 0 1 0 11.6"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** Overlapping turns — the end-to-end agent. */
export function GlyphAgent({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" {...base}>
      <path
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5v5A1.5 1.5 0 0 1 13.5 12H8l-4 3v-3Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M9 15.5A1.5 1.5 0 0 1 10.5 14h8a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H14l-3 2v-2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** Panel-with-rail — the sidebar toggle, as on the reference. */
export function IconPanel({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 22 20" {...base}>
      <rect
        x="1"
        y="1"
        width="20"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M8.5 1v18" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function IconPlus({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" {...base}>
      <path d="M10 3.5v13M3.5 10h13" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

/** Circled plus — "new session" on a model row. */
export function IconPlusCircle({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 22 22" {...base}>
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 6.8v8.4M6.8 11h8.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Submit. */
export function IconArrowUp({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" {...base}>
      <path
        d="M10 16.5v-13M4.5 9 10 3.5 15.5 9"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function IconMic({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" {...base}>
      <rect
        x="7"
        y="2"
        width="6"
        height="10"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M4 9.5a6 6 0 0 0 12 0M10 15.5V18"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** Filled square — stop recording. */
export function IconStop({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" {...base}>
      <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" fill="currentColor" />
    </svg>
  );
}

/** Outline triangle — the preset chips. */
export function IconPlayOutline({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 18 18" {...base}>
      <path
        d="M6 3.8 14 9l-8 5.2V3.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** Smaller stop square, for cancelling a run rather than a recording. */
export function IconStopSmall({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" {...base}>
      <rect x="6.5" y="6.5" width="7" height="7" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export const MODEL_GLYPHS = {
  interpret: GlyphInterpret,
  transcribe: GlyphTranscribe,
  voice: GlyphVoice,
  agent: GlyphAgent,
} as const;
