"use client";

import { useEffect, useRef } from "react";

type Props = {
  webm: string;
  mp4: string;
  /** Still frame — shown before the clip loads, and instead of it under
      reduced motion. It is also what every card and OG preview uses. */
  poster: string;
  label: string;
  className?: string;
};

/**
 * A looping, silent motion hero.
 *
 * `muted` is not a style choice — browsers refuse to autoplay anything with
 * audio, so without it the clip simply never starts. `playsInline` stops iOS
 * taking it fullscreen the moment it plays.
 *
 * Under `prefers-reduced-motion` it holds on the poster frame rather than
 * looping. That is the one place this site removes motion rather than
 * reducing it: a background element that moves forever has no quieter version,
 * and the still frame carries the same picture.
 */
export function MotionHero({ webm, mp4, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) {
        el.pause();
        el.currentTime = 0;
      } else {
        // Rejects when the tab is backgrounded or the decode is not ready;
        // neither is worth surfacing — the poster is already showing.
        el.play().catch(() => {});
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label={label}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
