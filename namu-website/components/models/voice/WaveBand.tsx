"use client";

import { useEffect, useRef } from "react";
import styles from "./voice.module.css";

const BARS = 160;

/**
 * The full-bleed waveform under "Instant voice matching".
 *
 * Two travelling sine waves of different periods multiplied together, so the
 * envelope swells and thins the way a spoken line does rather than pulsing
 * evenly. Drawn to a canvas because 160 animated DOM nodes is not worth it.
 */
export function WaveBand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Only paint while on screen.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const accent = getComputedStyle(canvas).getPropertyValue("color") || "#E8935A";

    let raf = 0;
    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden) return;

      const t = reduced ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = accent;

      const gap = w / BARS;
      const barW = Math.max(1, gap * 0.34);

      for (let i = 0; i < BARS; i++) {
        const x = i * gap;
        const u = i / BARS;
        // Envelope: fades in and out at the edges so the band has no hard ends.
        const edge = Math.sin(u * Math.PI);
        const a = Math.sin(u * 22 - t * 1.7);
        const b = Math.sin(u * 7 + t * 0.9);
        const amp = Math.abs(a * b) * edge;
        const barH = Math.max(2, amp * h * 0.86);
        ctx.globalAlpha = 0.25 + edge * 0.55;
        ctx.fillRect(x, (h - barH) / 2, barW, barH);
      }

      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.wave} aria-hidden="true" />;
}
