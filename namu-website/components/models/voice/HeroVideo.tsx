"use client";

import { useEffect, useRef } from "react";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import styles from "./voice.module.css";

/** How far the clip drifts against the scroll, as a fraction of its height. */
const PARALLAX_RATIO = -0.06;
/** Overscale, so the drift never exposes an edge. Kept just above the drift
 *  range (2 x ratio) — any more and the footage reads as zoomed in. */
const SCALE = 1.14;

type Props = {
  mp4: string;
  webm?: string;
  /** Shown until the first frame decodes, and permanently if playback fails. */
  poster: string;
  alt: string;
};

/**
 * The hero clip: full-bleed, silent, looping, and drifting slowly against the
 * scroll — the reference's treatment.
 *
 * If the clip cannot decode, the poster stays on screen — the element is
 * never hidden, because a blank hero is worse than a still one.
 */
export function HeroVideo({ mp4, webm, poster, alt }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay only once it is actually on screen, and stop when it is not:
  // a hero that keeps decoding after you have scrolled past costs battery for
  // nothing.
  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    // Some browsers refuse the initial play() before any interaction even when
    // muted; the observer will retry on the next intersection change.
    video.play().catch(() => {});

    return () => io.disconnect();
  }, []);

  useRafScroll((scrollY, viewportH) => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const rect = wrap.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewportH) return;

    // 0 as the block's top meets the viewport bottom, 1 as its bottom leaves
    // the top — the same span the reference's parallax uses.
    const p = clamp((viewportH - rect.top) / (viewportH + rect.height));
    const y = (p - 0.5) * 2 * rect.height * PARALLAX_RATIO;
    video.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${SCALE})`;
  });

  return (
    <div ref={wrapRef} className={styles.heroClip}>
      <video
        ref={videoRef}
        className={styles.heroClipMedia}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}
