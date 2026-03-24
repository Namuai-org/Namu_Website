import { PITCH_SLIDE_LABELS } from "@/lib/pitchSlideLabels";

/** Brand vector assets under `public/brand/` (included in “Download All SVGs” zip). */
export const PITCH_BRAND_SVG_PATHS: readonly string[] = [
  "/brand/namu-mark.svg",
  "/brand/namu-icon-app.svg",
  "/brand/namu-logo-horizontal-dark.svg",
  "/brand/namu-logo-horizontal-light.svg",
  "/brand/namu-logo-stacked-dark.svg",
  "/brand/namu-logo-stacked-light.svg",
  "/brand/concepts/human-voice-preview.svg",
  "/brand/concepts/namu-concepts-comparison.svg",
  "/brand/concepts/sahel-signal-preview.svg",
  "/brand/concepts/woven-belonging-preview.svg",
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSlideSvgMarkup(title: string, indexOneBased: number, total: number): string {
  const t = escapeXml(title);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="pitchTitle">
  <title id="pitchTitle">${t} — Namu pitch</title>
  <rect fill="#0c0b09" width="1920" height="1080"/>
  <text fill="#d6703f" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="26" font-weight="600" x="80" y="88" letter-spacing="0.18em">NAMU PITCH</text>
  <text fill="#f5efe6" font-family="Georgia, 'Times New Roman', serif" font-size="56" x="80" y="200">${t}</text>
  <text fill="rgba(245,239,230,0.5)" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" x="80" y="1000">${indexOneBased} / ${total}</text>
</svg>`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Vector “slide card” for the current step (title + index). */
export function downloadCurrentSlideAsSvg(
  title: string,
  indexZeroBased: number,
  total: number
): void {
  const body = buildSlideSvgMarkup(title, indexZeroBased + 1, total);
  triggerDownload(new Blob([body], { type: "image/svg+xml;charset=utf-8" }), "namu-pitch-slide.svg");
}

/**
 * Zip: `slides/` (one SVG per deck step) + `brand/` (Namu logo & concept SVGs from public/).
 */
export async function downloadAllPitchSvgsZip(): Promise<void> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  const slides = zip.folder("slides");
  if (!slides) throw new Error("Could not create zip folder");
  PITCH_SLIDE_LABELS.forEach((label, i) => {
    const svg = buildSlideSvgMarkup(label, i + 1, PITCH_SLIDE_LABELS.length);
    const safe = String(i + 1).padStart(2, "0");
    const short = label.replace(/[/\\?%*:|"<>]/g, "-").slice(0, 48);
    slides.file(`slide-${safe}-${short || "untitled"}.svg`, svg);
  });

  const brand = zip.folder("brand");
  if (!brand) throw new Error("Could not create zip folder");
  for (const path of PITCH_BRAND_SVG_PATHS) {
    const res = await fetch(path);
    if (!res.ok) continue;
    const buf = await res.arrayBuffer();
    const name = path.replace(/^\/brand\//, "");
    brand.file(name, buf);
  }

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  triggerDownload(blob, "namu-pitch-svgs.zip");
}
