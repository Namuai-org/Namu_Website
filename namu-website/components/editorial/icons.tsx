import type { CSSProperties } from "react";

type IconProps = { className?: string; style?: CSSProperties };

/** Long horizontal arrow with a chevron head — used in cards and captions. */
export function ArrowRight({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.749 1.29297L20.0612 9.60512L11.749 17.9173"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.8496 9.67476H0.500046"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 45° arrow for outbound and "open" affordances. */
export function ArrowUpRight({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H3.9M9.5 2.5V8.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1 1L7 7L13 1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The Namu mark — a three-quarter open arc closing on a Sahel dot. The arc
 * inherits currentColor so the mark reads correctly on cream and on ink.
 */
export function NamuMark({ className, style }: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M104 60A44 44 0 1 0 60 104"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="104" r="12" fill="var(--sahel)" />
    </svg>
  );
}

/* --- Film controls ------------------------------------------------------- */

/* Play and pause are filled rather than stroked: at the size a control bar
   draws them, a one-pixel outline of a triangle reads as a smudge. */

export function IconPlay({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.5 2.9v10.2c0 .6.6.9 1.1.6l7.7-5.1a.7.7 0 0 0 0-1.2L5.6 2.3c-.5-.3-1.1 0-1.1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconPause({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3.6" y="2.5" width="3" height="11" rx="0.9" fill="currentColor" />
      <rect x="9.4" y="2.5" width="3" height="11" rx="0.9" fill="currentColor" />
    </svg>
  );
}

export function IconReplay({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.2 8.6A5 5 0 1 0 4.6 4.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4.4 1.6v2.8h2.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSoundOn({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 6.1h2.3L7.6 3.3v9.4L4.3 9.9H2z" fill="currentColor" />
      <path
        d="M10.2 5.9a3 3 0 0 1 0 4.2M12.2 3.9a5.8 5.8 0 0 1 0 8.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSoundOff({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 6.1h2.3L7.6 3.3v9.4L4.3 9.9H2z" fill="currentColor" />
      <path
        d="M10.3 6.3l3.4 3.4M13.7 6.3l-3.4 3.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconFullscreen({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconFullscreenExit({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 2.5V6H2.5M13.5 6H10V2.5M10 13.5V10h3.5M2.5 10H6v3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --- Social marks -------------------------------------------------------- */

export function IconInstagram({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function IconLinkedIn({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
      <path d="M8 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17v-3.6c0-1.5.9-2.6 2.5-2.6s2.5 1.1 2.5 2.6V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconX({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l7.6 9.9L3.4 21H6l6-6.6L16.6 21H21l-8-10.4L20.5 3H18l-5.4 6L8 3H3z" fill="currentColor" />
    </svg>
  );
}

export function IconGitHub({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
