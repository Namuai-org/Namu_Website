"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import { Button } from "../Button";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

export type PortalImage = { src: string; alt: string };

/**
 * Where each panel rests, declared the way the reference declares it.
 *
 * This used to name where a panel should be *at the moment it is sharp* and
 * back-solve the resting position from it. That kept every panel inside the
 * frame, which is the one thing the reference does not do: most of its slots
 * hang off an edge on a negative offset, so panels sweep out past the sides of
 * the screen as they reach the camera rather than politely stopping short of
 * them. That overhang is most of why its flight reads as passing through the
 * room rather than playing on a stage.
 *
 * So these are plain resting offsets, in vmax, anchored to whichever edge the
 * panel leaves by. The middle of the frame belongs to the copy, so nothing
 * rests there.
 */
type Slot = {
  /** Offsets in vmax from whichever edges are given. Negative overhangs. */
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  /** Width in vmax. */
  w: number;
  /** True aspect ratio of the file in this slot, so `cover` never crops. */
  ratio: string;
};

/* Order matches PORTAL_IMAGES on the home page. The two founders take the two
   widest slots: on the reference, size is what marks a portrait out, rather
   than a separate opacity and blur curve for it. */
const LAYOUT: Slot[] = [
  { left: 2, top: 0, w: 12.5, ratio: "736 / 1022" },     // children-dusk
  { right: -6, top: 15, w: 20, ratio: "736 / 1104" },    // portrait-headwrap
  { right: -4, top: 2, w: 20, ratio: "1179 / 861" },     // Mouhamad
  { right: -2.4, top: 10, w: 12.5, ratio: "736 / 736" }, // baskets-wall
  { left: -6, top: 0, w: 20, ratio: "1179 / 1262" },     // co-founder
  { left: -0.8, bottom: -10, w: 15, ratio: "736 / 1041" }, // acacia-sunset
  { right: -6, bottom: -10, w: 20, ratio: "736 / 920" }, // elephants-crossing
];

/* Every number below is the reference's, read off its own scroll handler.

   Two of them I had previously "corrected" and should not have: the
   perspective really is a viewport unit, and the depth really is in vh. What
   was actually different was the shape of the curves, not their units. */
const PERSPECTIVE = 250; // dvh — must match the stylesheet
const Z_START = -300; // vh, far from the camera
const Z_END = 50; // vh, past it

/* Each panel flies for exactly one viewport of scrolling, and each starts a
   fifth of a viewport after the one before. Absolute, not a share of the
   section: with a share, adding a panel silently re-times every other one. */
const FLIGHT = 1;
const STAGGER = 0.2;
/* The flight starts half a viewport before the section reaches the top. */
const LEAD_IN = 0.5;

/* When the last panel finishes, measured from the section's top. Everything
   else is derived from this: the copy's exit, and the section's height in the
   stylesheet, which must be 100vh (the pinned child) plus this. Leave them out
   of step and the section stays pinned on an empty screen after the last panel
   has gone, which is exactly the void this replaced. */
const FLIGHT_END = (LAYOUT.length - 1) * STAGGER + FLIGHT - LEAD_IN; // 1.7vh

/* Opacity is piecewise linear, and the ramp takes the whole first half of the
   flight. Ours reached full opacity by 30% on an eased curve, which is what
   made panels appear to pop in rather than swim up. */
const FADE_IN_UNTIL = 0.5;
const HOLD_UNTIL = 0.82;

/* Sharp only as the panel crosses the focal plane, at the middle of its
   flight. 14px is the reference's maximum. */
const MAX_BLUR = 14;

export function Portal({ images }: { images: PortalImage[] }) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copyIn, setCopyIn] = useState(false);

  /* Resolve the vmax offsets to pixels once per viewport. Declarative now, so
     this is a unit conversion rather than the old inverse-perspective solve.
     Below 900px the stylesheet lays the panels out as a static grid with
     !important, so these values are ignored. */
  const place = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (vw <= 900) return;
    const vmax = Math.max(vw, vh);
    const u = (n: number) => `${((n / 100) * vmax).toFixed(1)}px`;

    LAYOUT.forEach((slot, i) => {
      const el = slideRefs.current[i];
      if (!el) return;

      el.style.width = u(slot.w);
      el.style.left = slot.left !== undefined ? u(slot.left) : "auto";
      el.style.right = slot.right !== undefined ? u(slot.right) : "auto";
      el.style.top = slot.top !== undefined ? u(slot.top) : "auto";
      el.style.bottom = slot.bottom !== undefined ? u(slot.bottom) : "auto";
    });
  }, []);

  useLayoutEffect(() => {
    place();
    window.addEventListener("resize", place, { passive: true });
    window.addEventListener("orientationchange", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("orientationchange", place);
    };
  }, [place]);

  useRafScroll((scrollY, viewportH, smoothY) => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.innerWidth <= 900) return;

    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;

    /* Driven from the eased scroll position, not the raw one. A wheel notch
       moves scrollY in a single jump; reading it directly is what made the
       flight step rather than glide. */
    const y = smoothY;
    const start = top - viewportH * LEAD_IN;

    // The panel layer is position:fixed, so it would otherwise keep painting
    // over every section below. Park it once the section is behind us.
    const slides = slidesRef.current;
    if (slides) {
      const parked = rect.bottom < 0 || rect.top > viewportH;
      slides.style.visibility = parked ? "hidden" : "visible";
      if (parked) return;
    }

    slideRefs.current.forEach((el, i) => {
      if (!el) return;

      // Absolute timing: panel i starts i * STAGGER viewports in, and flies
      // for FLIGHT viewports, whatever the section's total height.
      const local = clamp(
        (y - start - i * viewportH * STAGGER) / (viewportH * FLIGHT),
      );

      const z = Z_START + (Z_END - Z_START) * local;

      let opacity: number;
      if (local <= FADE_IN_UNTIL) opacity = local / FADE_IN_UNTIL;
      else if (local >= HOLD_UNTIL)
        opacity = 1 - (local - HOLD_UNTIL) / (1 - HOLD_UNTIL);
      else opacity = 1;
      opacity = clamp(opacity);

      // A fully transparent panel still costs a composited, blurred layer.
      // Taking it out of the render tree entirely is what keeps seven of
      // these affordable alongside the rest of the page.
      if (opacity < 0.01) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.filter = "none";
        el.style.willChange = "auto";
        return;
      }

      // Assigned unconditionally: the resting `hidden` comes from the
      // stylesheet, so testing the inline value would never match and the
      // panel would stay invisible for its whole flight.
      el.style.visibility = "visible";
      el.style.willChange = "transform, opacity, filter";

      // Zero at the focal plane, full at both ends of the flight.
      const blur = MAX_BLUR * Math.min(1, Math.abs(local - 0.5) / 0.5);

      el.style.transform = `translate3d(0, 0, ${z.toFixed(2)}vh)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = blur === 0 ? "none" : `blur(${blur.toFixed(2)}px)`;
    });

    /* The copy rises in over the first half viewport, holds, then goes back
       out just before the last panel does — it does not simply latch on and
       stay. Timed off FLIGHT_END so it can never outlast the flight. */
    const travelled = y - top;
    const flightEndPx = viewportH * FLIGHT_END;
    const fadeOutFrom = flightEndPx - viewportH * 0.25;
    let copyOpacity: number;
    if (travelled < fadeOutFrom) {
      const raw = clamp(travelled / (viewportH * 0.5));
      copyOpacity = raw * raw * (3 - 2 * raw);
    } else {
      copyOpacity = 1 - clamp((travelled - fadeOutFrom) / (viewportH * 0.25));
    }

    const content = contentRef.current;
    if (content) {
      content.style.opacity = copyOpacity.toFixed(3);
      content.style.pointerEvents = copyOpacity > 0 ? "auto" : "none";
    }

    // Latched separately: the line-by-line reveal should run once, on the way
    // in, and not replay if the copy fades back up.
    if (copyOpacity > 0.05) setCopyIn((v) => v || true);
  });

  return (
    <section ref={sectionRef} className={styles.portal} id="join">
      <div
        ref={slidesRef}
        className={styles.portalSlides}
        aria-hidden="true"
        style={{ perspective: `${PERSPECTIVE}dvh` }}
      >
        {/* left/top/width come from place(); only the ratio is declarative,
            so height always follows the file rather than a guessed box. */}
        {images.slice(0, LAYOUT.length).map((img, i) => (
          <div
            key={img.src + i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={styles.portalSlide}
            /* Authored stacking, fixed for the whole flight. Deriving it from
               progress made panels swap order mid-air. */
            style={{ aspectRatio: LAYOUT[i].ratio, zIndex: LAYOUT.length - i }}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Sticky, so the copy pins to the middle of the screen for the whole
          section instead of scrolling up into view at the end. That arrival
          was what made it feel like a second frame landing on top of the
          flight rather than the thing the flight is happening around. */}
      <div className={styles.portalStick}>
        <div ref={contentRef} className={styles.portalContent}>
          {/* `scroll-object` for the [data-fade] rule, but `in-view` comes from
              scroll progress rather than an observer: this block is pinned on
              screen for the whole section, so an observer fires immediately. */}
          <div
            className={`scroll-object ${copyIn ? "in-view" : ""} ds-span ${styles.portalCopy}`}
            style={{ "--span": 10 } as React.CSSProperties}
          >
            <h2 className="h4">
              <SplitText active={copyIn} text={t("home.join.title")} />
            </h2>
            <p className="text-regular">
              <SplitText active={copyIn} text={t("home.join.body")} delay={0.1} />
            </p>
            <p className="text-regular">
              <SplitText active={copyIn} text={t("home.join.body2")} delay={0.2} />
            </p>
            <p className="text-regular">
              <SplitText active={copyIn} text={t("home.join.body3")} delay={0.3} />
            </p>
            <div data-fade style={{ transitionDelay: "0.5s" }}>
              <Button href="mailto:contact@namuai.org">
                {t("home.join.cta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
