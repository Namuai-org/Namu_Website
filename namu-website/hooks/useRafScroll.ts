"use client";

import { useEffect, useRef } from "react";

type Subscriber = (
  scrollY: number,
  viewportH: number,
  /**
   * Scroll position eased toward the real one, a fixed fraction per frame.
   *
   * The reference drives its scroll-linked sections from a smoothed value
   * rather than the raw offset, which is most of why its flights glide where
   * ours stepped: a wheel notch moves `scrollY` in one jump, and anything
   * reading it directly jumps with it.
   *
   * Offered alongside the real value rather than replacing it, and the page
   * still scrolls natively — taking over scrolling to get this would cost far
   * more than it buys.
   */
  smoothY: number,
) => void;

const subscribers = new Set<Subscriber>();
let running = false;
let rafId = 0;
let lastY = -1;
let dirty = true;
let smoothY = -1;

/** Per-frame catch-up. Low enough to glide, high enough not to lag visibly. */
const LERP = 0.12;
/** Below this the eased value is snapped, so the loop can go quiet. */
const SETTLE = 0.05;

function tick() {
  rafId = requestAnimationFrame(tick);

  const y = window.scrollY;
  if (smoothY < 0) smoothY = y;

  const before = smoothY;
  smoothY += (y - smoothY) * LERP;
  if (Math.abs(y - smoothY) < SETTLE) smoothY = y;

  // Only do work when the page actually moved, when the eased value is still
  // catching up, or when something asked for a forced pass (resize, new
  // subscriber, orientation change).
  const moved = y !== lastY || Math.abs(smoothY - before) > 0.001;
  if (!moved && !dirty) return;
  lastY = y;
  dirty = false;

  const h = window.innerHeight;
  for (const fn of subscribers) fn(y, h, smoothY);
}

function start() {
  if (running) return;
  running = true;
  dirty = true;
  rafId = requestAnimationFrame(tick);
}

function stop() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(rafId);
}

function invalidate() {
  dirty = true;
}

if (typeof window !== "undefined") {
  window.addEventListener("resize", invalidate, { passive: true });
  window.addEventListener("orientationchange", invalidate, { passive: true });
}

/**
 * Subscribes to one shared requestAnimationFrame loop driven by scroll
 * position. Every scroll-linked section on the page shares this single loop
 * rather than each registering its own listener.
 */
export function useRafScroll(callback: Subscriber, enabled = true) {
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const fn: Subscriber = (y, h, sy) => ref.current(y, h, sy);
    subscribers.add(fn);
    invalidate();
    start();

    return () => {
      subscribers.delete(fn);
      if (subscribers.size === 0) stop();
    };
  }, [enabled]);
}

/** Clamp helper shared by the scroll-driven sections. */
export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));
