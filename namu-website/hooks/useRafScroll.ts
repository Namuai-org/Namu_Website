"use client";

import { useEffect, useRef } from "react";

type Subscriber = (scrollY: number, viewportH: number) => void;

const subscribers = new Set<Subscriber>();
let running = false;
let rafId = 0;
let lastY = -1;
let dirty = true;

function tick() {
  rafId = requestAnimationFrame(tick);

  const y = window.scrollY;
  // Only do work when the page actually moved, or when something asked for a
  // forced pass (resize, new subscriber, orientation change).
  if (y === lastY && !dirty) return;
  lastY = y;
  dirty = false;

  const h = window.innerHeight;
  for (const fn of subscribers) fn(y, h);
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

    const fn: Subscriber = (y, h) => ref.current(y, h);
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
