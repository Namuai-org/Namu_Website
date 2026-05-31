"use client";

import { useEffect, useRef } from "react";

const SYMBOLS = [
  "/macos-icons/Africa_Art/_.jpeg",
  "/macos-icons/Africa_Art/_.webp",
  "/macos-icons/Africa_Art/_ (1).jpeg",
  "/macos-icons/Africa_Art/_ (1).webp",
  "/macos-icons/Africa_Art/_ (2).jpeg",
  "/macos-icons/Africa_Art/_ (3).jpeg",
  "/macos-icons/Africa_Art/_ (4).jpeg",
  "/macos-icons/Africa_Art/CHiLDReNs HaNDS were built to explore_.webp",
  "/macos-icons/Africa_Art/Earthen pot silhouette design in vector style with a white background.jpeg",
  "/macos-icons/Africa_Art/Kulhad Chai Illustration.jpeg",
];

const SPEED = 55; // px / sec

export function HeroTicker() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLSpanElement>(null); // sits between copy-1 and copy-2
  const pausedRef  = useRef(false);
  const xRef       = useRef(0);
  const lastRef    = useRef(0);
  const halfRef    = useRef(0); // sentinel.offsetLeft = exact copy-1 pixel width

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const track    = trackRef.current;
    const sentinel = sentinelRef.current;
    if (!track || !sentinel) return;

    let rafId: number;

    const startAnimation = () => {
      // sentinel.offsetLeft is the exact pixel where copy-2 begins = width of copy-1
      halfRef.current = sentinel.offsetLeft;

      const tick = (time: number) => {
        if (lastRef.current) {
          if (!pausedRef.current) {
            xRef.current -= SPEED * ((time - lastRef.current) / 1000);

            // When we've scrolled exactly one copy, jump forward — copy-2 is now
            // at the same pixel as copy-1 was, so the jump is invisible.
            if (halfRef.current > 0 && xRef.current <= -halfRef.current) {
              xRef.current += halfRef.current;
            }

            track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
          }
        }
        lastRef.current = time;
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    // Wait for every image before measuring
    const imgs      = Array.from(track.querySelectorAll<HTMLImageElement>("img"));
    let remaining   = imgs.filter(img => !img.complete).length;

    if (remaining === 0) {
      startAnimation();
    } else {
      const onLoad = () => { if (--remaining <= 0) startAnimation(); };
      imgs.forEach(img => {
        if (!img.complete) {
          img.addEventListener("load",  onLoad, { once: true });
          img.addEventListener("error", onLoad, { once: true });
        }
      });
    }

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="hero-ticker"
      aria-hidden="true"
      onMouseEnter={() => { pausedRef.current = true;  }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div ref={trackRef} className="hero-ticker-track">

        {/* copy 1 */}
        {SYMBOLS.map((src, i) => (
          <span key={`a${i}`} className="hero-ticker-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="hero-ticker-img" draggable={false} />
          </span>
        ))}

        {/* sentinel — its offsetLeft = exact width of copy-1 */}
        <span ref={sentinelRef} style={{ flexShrink: 0, width: 0 }} aria-hidden="true" />

        {/* copy 2 — identical to copy 1 */}
        {SYMBOLS.map((src, i) => (
          <span key={`b${i}`} className="hero-ticker-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="hero-ticker-img" draggable={false} />
          </span>
        ))}

      </div>
    </div>
  );
}
