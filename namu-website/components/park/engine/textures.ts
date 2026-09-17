import * as THREE from "three";
import { HEX } from "./palette";

/** A seeded random stream, so the park looks the same on every visit. */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function canvasTexture(canvas: HTMLCanvasElement, repeat?: [number, number]) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  if (repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
  }
  return texture;
}

/**
 * The site's own font stacks. next/font registers the families under generated
 * names, so a canvas has to read them back from the CSS variables rather than
 * ask for "Newsreader" by name.
 */
export function fontStack(variable: "--font-serif" | "--font-mono-ui", fallback: string) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

export const serif = () => fontStack("--font-serif", "Georgia, serif");
export const mono = () => fontStack("--font-mono-ui", "ui-monospace, monospace");

/** Waits for both brand faces so nothing is painted in a fallback. */
export async function fontsReady() {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`96px ${serif()}`),
      document.fonts.load(`italic 96px ${serif()}`),
      document.fonts.load(`32px ${mono()}`),
    ]);
    await document.fonts.ready;
  } catch {
    /* Fallback faces are acceptable; the park still builds. */
  }
}

/** Birch plywood: warm cream-tan with long, soft grain lines. */
export function plywoodTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = HEX.plywood;
  g.fillRect(0, 0, c.width, c.height);

  const r = rng(11);
  for (let i = 0; i < 110; i++) {
    const y = r() * c.height;
    const amp = 1.5 + r() * 5;
    const freq = 0.003 + r() * 0.008;
    const phase = r() * Math.PI * 2;
    g.strokeStyle = `rgba(150, 92, 48, ${0.04 + r() * 0.1})`;
    g.lineWidth = 0.5 + r() * 1.6;
    g.beginPath();
    for (let x = 0; x <= c.width; x += 8) {
      const yy = y + Math.sin(x * freq + phase) * amp;
      if (x === 0) g.moveTo(x, yy);
      else g.lineTo(x, yy);
    }
    g.stroke();
  }

  const img = g.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * 9;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  return canvasTexture(c, [1, 1]);
}

/** Poured rubber: a ground colour flecked with granules in three tints. */
export function speckle(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  density: number,
  tints: string[],
  seed = 3,
) {
  const r = rng(seed);
  const count = Math.floor(w * h * density);
  for (let i = 0; i < count; i++) {
    g.fillStyle = tints[Math.floor(r() * tints.length)];
    const s = 0.8 + r() * 1.6;
    g.fillRect(x + r() * w, y + r() * h, s, s);
  }
}

export function rubberTexture(base: string, tints: string[], seed = 5) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  speckle(g, 0, 0, 512, 512, 0.16, tints, seed);
  return canvasTexture(c, [3, 3]);
}

const letterCache = new Map<string, THREE.CanvasTexture>();

/** A letter block's face: kola Newsreader on harmattan. */
export function letterTexture(ch: string) {
  const cached = letterCache.get(ch);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = HEX.harmattan;
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "rgba(107, 62, 30, 0.12)";
  g.lineWidth = 6;
  g.strokeRect(3, 3, 122, 122);
  g.fillStyle = HEX.kola;
  g.font = `450 86px ${serif()}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(ch, 64, 70);
  const texture = canvasTexture(c);
  letterCache.set(ch, texture);
  return texture;
}

/**
 * The chalk slate beside the horn. Redrawn whenever the sentence changes, in
 * Newsreader italic, the way someone's hand would set it.
 */
export function drawSlate(canvas: HTMLCanvasElement, text: string, hint: string) {
  const g = canvas.getContext("2d")!;
  const { width: w, height: h } = canvas;
  g.fillStyle = "#23443a";
  g.fillRect(0, 0, w, h);

  // Chalk dust: a faint cloud where earlier words were wiped away.
  const r = rng(21);
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = `rgba(247, 240, 227, ${0.02 + r() * 0.05})`;
    g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 2);
  }

  const words = (text.trim() || hint).split(/\s+/);
  const size = text.trim().length > 60 ? 54 : 70;
  g.font = `italic 400 ${size}px ${serif()}`;
  g.fillStyle = text.trim() ? "rgba(250, 244, 233, 0.94)" : "rgba(250, 244, 233, 0.45)";
  g.textBaseline = "top";

  const maxW = w - 120;
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 4);
  const lh = size * 1.18;
  const top = (h - shown.length * lh) / 2;
  shown.forEach((l, i) => g.fillText(i === 3 && lines.length > 4 ? `${l}…` : l, 60, top + i * lh));

  // A chalk underline, and the tray the chalk sits on.
  g.strokeStyle = "rgba(232, 147, 90, 0.85)";
  g.lineWidth = 5;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(60, top + shown.length * lh + 14);
  g.lineTo(60 + Math.min(260, maxW), top + shown.length * lh + 18);
  g.stroke();
}

/**
 * A park sign: the station's name in Newsreader over its model in Red Hat Mono,
 * the same pairing the site uses, screen-printed on a plywood plate.
 */
export function plateTexture(title: string, sub: string, aspect = 2) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = Math.round(512 / aspect);
  const g = c.getContext("2d")!;
  g.fillStyle = HEX.harmattan;
  g.fillRect(0, 0, c.width, c.height);
  speckle(g, 0, 0, c.width, c.height, 0.04, ["#efe6d5", "#fdf8ee"], 7);

  g.strokeStyle = "rgba(107, 62, 30, 0.22)";
  g.lineWidth = 3;
  g.strokeRect(12, 12, c.width - 24, c.height - 24);

  const mid = c.height / 2;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = HEX.kola;
  g.font = `450 ${Math.round(c.height * 0.3)}px ${serif()}`;
  g.fillText(title, c.width / 2, mid - c.height * 0.1);

  g.fillStyle = HEX.muted;
  g.font = `500 ${Math.round(c.height * 0.13)}px ${mono()}`;
  g.letterSpacing = `${Math.round(c.height * 0.026)}px`;
  g.fillText(sub.toUpperCase(), c.width / 2, mid + c.height * 0.21);
  g.letterSpacing = "0px";

  return canvasTexture(c);
}

/**
 * The gate sign: the logo exactly as it is drawn — three quarters of a circle,
 * the Sahel dot at the end of the stroke, and the wordmark running out of it —
 * over the park's own name.
 */
export function gateSignTexture() {
  const c = document.createElement("canvas");
  const scale = 2.8;
  c.width = Math.round(360 * scale);
  c.height = Math.round(150 * scale);
  const g = c.getContext("2d")!;
  g.fillStyle = HEX.harmattan;
  g.fillRect(0, 0, c.width, c.height);
  speckle(g, 0, 0, c.width, c.height, 0.03, ["#efe6d5", "#fdf8ee"], 5);
  g.scale(scale, scale);

  g.strokeStyle = HEX.ink;
  g.lineWidth = 4.5;
  g.lineCap = "round";
  g.beginPath();
  // Three quarters, anticlockwise from the right round to the bottom.
  g.arc(60, 65, 44, 0, Math.PI / 2, true);
  g.stroke();

  g.fillStyle = HEX.sahel;
  g.beginPath();
  g.arc(60, 109, 6, 0, Math.PI * 2);
  g.fill();

  const gradient = g.createLinearGradient(76, 0, 300, 0);
  gradient.addColorStop(0, HEX.sahel);
  gradient.addColorStop(0.22, HEX.ink);
  gradient.addColorStop(1, HEX.ink);
  g.fillStyle = gradient;
  g.font = `400 38px ${serif()}`;
  g.letterSpacing = "2px";
  g.textBaseline = "alphabetic";
  g.fillText("namu", 76, 99);

  g.fillStyle = HEX.muted;
  g.font = `500 13px ${mono()}`;
  g.letterSpacing = "3.4px";
  g.fillText("PLAYGROUND · EARLY PREVIEW", 78, 128);
  g.letterSpacing = "0px";

  return canvasTexture(c);
}

/** A soft round sprite for dust and sound motes. */
export function softDotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
