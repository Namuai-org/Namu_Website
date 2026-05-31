"use client";

import { useEffect, useState } from "react";

/**
 * Returns the currently-visible prefix of `text`, growing one character at a
 * time via a requestAnimationFrame loop. Resets whenever `text` changes.
 * Pass `active = false` to pause (returns empty string while paused).
 */
export function useTypewriter(
  text: string,
  active = true,
  delayPerChar = 22,
  delayPerSpace = 16
): string {
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    setTypedLength(0);
  }, [text]);

  useEffect(() => {
    if (!active) return;

    let len = 0;
    let nextAt = performance.now();
    let raf = 0;
    let cancelled = false;

    const step = (now: number) => {
      if (cancelled) return;
      if (len >= text.length) return;
      if (now < nextAt) {
        raf = requestAnimationFrame(step);
        return;
      }
      // First 10 chars are slightly slower (+12ms) to give a "wind-up" feel.
      const delay = text[len] === " " ? delayPerSpace : len < 10 ? delayPerChar + 12 : delayPerChar;
      len += 1;
      setTypedLength(len);
      nextAt = now + delay;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [active, text, delayPerChar, delayPerSpace]);

  return active ? text.slice(0, typedLength) : "";
}
