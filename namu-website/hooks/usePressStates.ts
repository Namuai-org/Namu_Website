"use client";

import { useEffect } from "react";

const noop = () => {};

/**
 * Makes `:active` work on iPhones.
 *
 * On touch devices the site's hover feedback — the button inversion, the card
 * bloom, the image zoom — is mirrored onto `:active` so a tap still visibly
 * lands. Mobile Safari only applies `:active` to a touch when some touchstart
 * listener exists on the page, so without this every one of those press states
 * silently does nothing there. The listener does no work and is passive, so it
 * never delays scrolling.
 */
export function usePressStates() {
  useEffect(() => {
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);
}
