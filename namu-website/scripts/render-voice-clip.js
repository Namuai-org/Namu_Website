/* "Voices in the dark" — the hero clip for the voice essay.
 *
 * The piece opens on an evening in Niamey when the power cut out and the
 * voices around the compound became the thing you noticed. So: a dark frame
 * with the last band of dusk still on the horizon, and two people answering
 * each other across it.
 *
 * Four layers, all periodic in t so the loop has no seam:
 *   1. dusk      — the residual light, drifting
 *   2. horizon   — a low silhouette, so the dark reads as a place
 *   3. voices    — concentric ripples from two points, taking turns
 *   4. waveform  — a luminous line whose amplitude swells under whoever is
 *                  speaking, so the wave visibly originates at a person
 *
 * One SVG per frame, rasterised by sharp, encoded by ffmpeg. Every animated
 * value is built from sin/cos over t in [0,1), and every ripple is aged with
 * wraparound, so frame 240 lands exactly where frame 0 began.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const W = 2560;
const H = 1204; // 1660/780, the article hero's ratio
const FPS = 30;
const SECONDS = 8;
const FRAMES = FPS * SECONDS;

const OUT = process.argv[2] || "./frames";
fs.mkdirSync(OUT, { recursive: true });

/* ── Palette ──────────────────────────────────────────────────────────── */
const INK = "#1C1410";
const KOLA = "#6B3E1E";
const SAHEL = "#E8935A";
const CLAY = "#EDD9B0";
const PAPER = "#FFFAF1";

const TAU = Math.PI * 2;
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (u) => u * u * (3 - 2 * u);

function rnd(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ── The two speakers ─────────────────────────────────────────────────────
   Their pulse times are what make this read as a conversation rather than a
   pattern: A opens, B answers a beat later, and the second exchange overlaps
   more than the first — the way talk loosens up once it gets going. */
const HORIZON = 0.72; // fraction of height
const A = { x: 0.29, y: 0.6, pulses: [0.02, 0.5] };
const B = { x: 0.71, y: 0.58, pulses: [0.26, 0.68] };
const RING_LIFE = 0.42; // of the loop
const RING_MAX = 0.58; // of frame width

/** Age of a pulse at time t, wrapped, or null if it is not alive. */
function ageOf(t, pulseTime) {
  const age = (((t - pulseTime) % 1) + 1) % 1;
  return age < RING_LIFE ? age / RING_LIFE : null;
}

/** How loud a speaker is right now — sum of their live pulses. */
function loudness(t, speaker) {
  let v = 0;
  for (const p of speaker.pulses) {
    const a = ageOf(t, p);
    if (a === null) continue;
    // Quick attack, long decay: the shape of a spoken phrase.
    v += a < 0.12 ? ease(a / 0.12) : Math.pow(1 - (a - 0.12) / 0.88, 1.6);
  }
  return Math.min(1, v);
}

/* ── 1. Dusk ──────────────────────────────────────────────────────────────
   Sky plus a separate radial for the last light, so the glow can drift along
   the horizon independently of the vertical gradient. */
function backdrop(t) {
  const glowX = 0.5 + Math.sin(TAU * t) * 0.06;
  const glowY = HORIZON + 0.02;
  const glowR = 0.62 + Math.sin(TAU * (t + 0.3)) * 0.03;

  return `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#120C09"/>
      <stop offset="46%" stop-color="${INK}"/>
      <stop offset="${(HORIZON * 100 - 10).toFixed(1)}%" stop-color="#3A2415"/>
      <stop offset="${(HORIZON * 100).toFixed(1)}%" stop-color="#7A4620"/>
      <stop offset="100%" stop-color="#150E0A"/>
    </linearGradient>

    <radialGradient id="lastLight" cx="${(glowX * 100).toFixed(1)}%" cy="${(glowY * 100).toFixed(1)}%" r="${(glowR * 100).toFixed(1)}%">
      <stop offset="0%" stop-color="${SAHEL}" stop-opacity="0.5"/>
      <stop offset="34%" stop-color="${KOLA}" stop-opacity="0.26"/>
      <stop offset="70%" stop-color="${INK}" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${SAHEL}" stop-opacity="0"/>
      <stop offset="16%" stop-color="${SAHEL}" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="${CLAY}" stop-opacity="1"/>
      <stop offset="84%" stop-color="${SAHEL}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${SAHEL}" stop-opacity="0"/>
    </linearGradient>

    <radialGradient id="vignette" cx="50%" cy="52%" r="72%">
      <stop offset="58%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#lastLight)"/>`;
}

/* ── 2. Horizon ───────────────────────────────────────────────────────────
   Flat roofs and a rooftop aerial. Enough to say "a place", not enough to
   compete with the voices.

   There was an acacia here. It kept silhouetting as a parasol, and it was the
   wrong register anyway: the piece is set at home in Niamey, with neighbours
   audible and a motorcycle in the street. A lone tree says savannah. */
function horizon() {
  const y = HORIZON * H;
  const DARK = "#0D0906";

  // One continuous outline. Each roof steps up off the ground line and back
  // down onto it — no sub-paths, or they detach into floating blocks and the
  // fill closes across the frame as a diagonal.
  const roofs = [
    [0.0, 0.105, 0.038],
    [0.125, 0.058, 0.022],
    [0.2, 0.042, 0.03],
    [0.42, 0.05, 0.018],
    [0.485, 0.036, 0.027],
    [0.735, 0.115, 0.046],
    [0.875, 0.062, 0.028],
    [0.955, 0.045, 0.036],
  ];

  let d = `M 0 ${y.toFixed(1)}`;
  for (const [x, w, h] of roofs) {
    const x0 = (x * W).toFixed(1);
    const x1 = ((x + w) * W).toFixed(1);
    const top = (y - h * H).toFixed(1);
    d += ` L ${x0} ${y.toFixed(1)} L ${x0} ${top} L ${x1} ${top} L ${x1} ${y.toFixed(1)}`;
  }
  d += ` L ${W} ${y.toFixed(1)} L ${W} ${H} L 0 ${H} Z`;

  // A television aerial on the tallest roof — the one detail that dates the
  // scene to a residential street rather than anywhere.
  const ax = W * 0.79;
  const aBase = y - 0.046 * H;
  const aTop = aBase - H * 0.055;
  const mast = `<path d="M ${ax.toFixed(1)} ${aBase.toFixed(1)} L ${ax.toFixed(1)} ${aTop.toFixed(1)}" stroke="${DARK}" stroke-width="${(W * 0.0012).toFixed(2)}"/>`;
  const bars = [0.2, 0.42, 0.62]
    .map((f, i) => {
      const by = aTop + (aBase - aTop) * f;
      const half = W * (0.012 - i * 0.0028);
      return `<path d="M ${(ax - half).toFixed(1)} ${by.toFixed(1)} L ${(ax + half).toFixed(1)} ${by.toFixed(1)}" stroke="${DARK}" stroke-width="${(W * 0.0009).toFixed(2)}"/>`;
    })
    .join("");

  return `
  <g opacity="0.94">
    <path d="${d}" fill="${DARK}"/>
    ${mast}${bars}
  </g>`;
}

/* ── 3. Voices ────────────────────────────────────────────────────────── */
function voices(t) {
  let out = "";
  for (const sp of [A, B]) {
    const cx = sp.x * W;
    const cy = sp.y * H;
    for (const p of sp.pulses) {
      const a = ageOf(t, p);
      if (a === null) continue;
      // Three rings per pulse, trailing each other.
      for (let k = 0; k < 3; k++) {
        const ak = a - k * 0.1;
        if (ak <= 0 || ak >= 1) continue;
        const r = ease(ak) * RING_MAX * W * 0.5;
        const fade = Math.pow(1 - ak, 1.5) * (k === 0 ? 0.62 : 0.4 - k * 0.1);
        if (fade <= 0.004) continue;
        out += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.42).toFixed(1)}" fill="none" stroke="${PAPER}" stroke-opacity="${fade.toFixed(3)}" stroke-width="${(W * 0.0018).toFixed(2)}"/>`;
      }
    }
    // The speaker themself: a small ember that brightens as they talk.
    const l = loudness(t, sp);
    out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(W * 0.0022 + l * W * 0.0026).toFixed(2)}" fill="${CLAY}" opacity="${(0.3 + l * 0.7).toFixed(3)}"/>`;
  }
  return out;
}

/* ── 4. Waveform ──────────────────────────────────────────────────────────
   Amplitude is spatially weighted toward whoever is speaking, so the line
   swells under them and settles as the other picks up. That weighting is the
   whole trick: it turns an oscillating line into a conversation. */
const HARMONICS = [
  { k: 3, a: 1.0, s: 1 },
  { k: 7, a: 0.42, s: -2 },
  { k: 13, a: 0.22, s: 3 },
  { k: 23, a: 0.1, s: -4 },
];

function wavePath(t, yBase, scale) {
  const la = loudness(t, A);
  const lb = loudness(t, B);
  const N = 420;
  const pts = [];

  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const x = u * W;

    const gA = Math.exp(-Math.pow((u - A.x) / 0.26, 2));
    const gB = Math.exp(-Math.pow((u - B.x) / 0.26, 2));
    // A little life even when nobody is mid-phrase — the room is never silent.
    const amp = (0.1 + la * gA * 1.25 + lb * gB * 1.25) * scale;

    let y = 0;
    for (const h of HARMONICS) {
      y += h.a * Math.sin(TAU * (h.k * u + h.s * t));
    }
    // Taper to nothing at both edges so the line does not just stop.
    const edge = Math.sin(Math.PI * u) ** 0.7;
    pts.push(`${x.toFixed(1)} ${(yBase + y * amp * edge).toFixed(1)}`);
  }
  return "M " + pts.join(" L ");
}

function waveform(t) {
  const yBase = H * 0.565;
  const A0 = H * 0.088;
  const d = wavePath(t, yBase, A0);
  // A quieter echo trailing below, at a fraction of the amplitude and running
  // slightly behind — it gives the frame depth and reads as the room carrying
  // the sound rather than as a second speaker.
  const echo = wavePath((t + 0.94) % 1, yBase + H * 0.052, A0 * 0.42);

  // The main line is drawn three times: a wide soft pass for glow, a mid pass,
  // then a bright core.
  return `
  <path d="${echo}" fill="none" stroke="${SAHEL}" stroke-opacity="0.13" stroke-width="${(W * 0.0011).toFixed(1)}" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="${SAHEL}" stroke-opacity="0.1" stroke-width="${(W * 0.009).toFixed(1)}" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="${SAHEL}" stroke-opacity="0.28" stroke-width="${(W * 0.0034).toFixed(1)}" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="url(#waveStroke)" stroke-width="${(W * 0.0013).toFixed(1)}" stroke-linecap="round"/>`;
}

/* ── Embers ───────────────────────────────────────────────────────────── */
const EMBERS = (() => {
  const r = rnd(20260801);
  return Array.from({ length: 110 }, () => ({
    x: r(),
    y0: r(),
    speed: 0.25 + r() * 0.7,
    size: r(),
    sway: (r() - 0.5) * 0.03,
    tone: r(),
  }));
})();

function embers(t) {
  let out = "";
  for (const e of EMBERS) {
    // Rises and wraps, so the drift never restarts visibly.
    const y = (((e.y0 - t * e.speed * 0.5) % 1) + 1) % 1;
    const x = e.x + Math.sin(TAU * (t * e.speed + e.x)) * e.sway;
    const py = lerp(H * 0.98, H * 0.12, y);
    const fade = Math.sin(Math.PI * y) ** 1.2;
    const rr = lerp(W * 0.0007, W * 0.0022, e.size);
    out += `<circle cx="${(x * W).toFixed(1)}" cy="${py.toFixed(1)}" r="${rr.toFixed(2)}" fill="${e.tone > 0.7 ? CLAY : SAHEL}" opacity="${(fade * (0.1 + e.size * 0.4)).toFixed(3)}"/>`;
  }
  return out;
}

/* ── Frame ────────────────────────────────────────────────────────────── */
function frameSVG(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${backdrop(t)}
  ${embers(t)}
  ${voices(t)}
  ${waveform(t)}
  ${horizon()}
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;
}

(async () => {
  for (let f = 0; f < FRAMES; f++) {
    const t = f / FRAMES;
    await sharp(Buffer.from(frameSVG(t)))
      .png({ compressionLevel: 6 })
      .toFile(path.join(OUT, `f${String(f).padStart(4, "0")}.png`));
    if (f % 40 === 0) process.stdout.write(`  ${f}/${FRAMES}\n`);
  }
  console.log(`  ${FRAMES}/${FRAMES} done`);
})();
