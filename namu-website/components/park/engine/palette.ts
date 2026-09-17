/**
 * The park's colours, taken from the Namu palette.
 *
 * Paper, harmattan, dry clay, kola, sahel and forest are the brand's own. The
 * rest are materials mixed from them — birch plywood between dry clay and
 * sahel, poured rubber a shade under harmattan, sage as forest thinned into
 * cream — so every surface in the park still reads as the same family.
 */
export const HEX = {
  paper: "#fffaf1",
  harmattan: "#f7f0e3",
  surface2: "#f3e7d1",
  dryClay: "#edd9b0",
  sahel: "#e8935a",
  kola: "#6b3e1e",
  forest: "#1a3a2e",
  ink: "#1c1410",
  muted: "#7a6352",

  plywood: "#dcae7e",
  plywoodDeep: "#c38e5c",
  rubber: "#f1e6d3",
  rubberDeep: "#e6d6bb",
  sand: "#e7cfa8",
  sage: "#cdd5c3",
  sageDeep: "#aebca9",
  clayBand: "#ecd3a8",
  sahelBand: "#f3c7a3",
  forestSoft: "#3d5a4b",
  figure: "#f4ede2",
  figureWarm: "#b98661",
  led: "#ffc98f",
} as const;

export type HexName = keyof typeof HEX;

/** Sky at golden hour: pale harmattan overhead, a Sahel glow at the horizon. */
export const SKY = {
  zenith: "#eddfcb",
  mid: "#f5e3ca",
  horizon: "#f4cba9",
  sun: "#fff6e4",
  fog: "#f2e0c7",
} as const;
