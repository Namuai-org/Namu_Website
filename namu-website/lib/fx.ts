/**
 * Fluid-unit helpers for the editorial design system.
 *
 * Every measurement in the design is authored at the 1728px reference width
 * and expressed as a multiple of --unit-fx, which equals 1px there.
 */

/** N design-pixels as a fluid CSS length. */
export const fx = (n: number) => `calc(${n} * var(--unit-fx))`;

/** Width of N columns in the 24-column grid (includes the N-1 inner gutters). */
export const span = (n: number) =>
  `calc(var(--col24) * ${n} + var(--gutter24) * ${n - 1})`;

/** Indent of N columns (includes N gutters) — used for padding, not widths. */
export const offset = (n: number) =>
  `calc(var(--col24) * ${n} + var(--gutter24) * ${n})`;
