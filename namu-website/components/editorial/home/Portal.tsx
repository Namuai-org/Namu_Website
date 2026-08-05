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

/* Fixed pixels, not a viewport unit. The depth of the flight should not change
   with the height of the window — on a short screen a vh-based perspective
   flattened the whole effect. This is the reference's own value. */
const PERSPECTIVE = 1800; // px — must match --perspective in the stylesheet
const Z_START = -2600; // px, far from the camera
const Z_END = 900; // px, past it

/* How much of a viewport the stream gets as a head start. Without it the
   flight only begins once the section's top has reached the top of the
   screen, which left the first half-screen of the section empty — you arrived
   to nothing and had to keep scrolling before anything showed up. */
const LEAD_IN = 0.45;

/* Progress at which the copy starts revealing. The section pins at roughly
   0.17, so this lands the reveal just after the copy settles into the middle
   of the screen rather than while it is still rising into place. */
const REVEAL_AT = 0.2;

export function Portal({ images }: { images: PortalImage[] }) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  useRafScroll((scrollY, viewportH) => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.innerWidth <= 900) return;

    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const runway = section.offsetHeight - viewportH;
    if (runway <= 0) return;

    // Progress starts LEAD_IN viewports before the section reaches the top of
    // the screen, so panels are already streaming by the time you arrive.
    const lead = viewportH * LEAD_IN;
    const p = clamp((scrollY - (top - lead)) / (runway + lead));

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

      // Each panel starts a fraction later than the one before it, so they
      // arrive as a stream rather than all at once. Dividing by the full
      // remaining range matters: every panel must still reach 1 by the end,
      // or the last ones stay on screen over the sections below.
      const stagger = (i / LAYOUT.length) * 0.55;
      const local = clamp((p - stagger) / (1 - stagger));

      const z = Z_START + (Z_END - Z_START) * local;

      // One curve for every panel. The founders used to get their own, faster
      // ramp and longer hold; the reference marks a portrait out by giving it
      // a wider slot instead, which it does here too, and one curve means the
      // stream reads as a single flight rather than two overlapping ones.
      let opacity: number;
      if (local < 0.3) opacity = Math.pow(local / 0.3, 1.25);
      else if (local < 0.86) opacity = 1;
      else opacity = clamp(1 - (local - 0.86) / 0.14);

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

      // Depth of field: sharp only as the panel crosses the focal plane.
      const blur = 8 * Math.abs(local * 2 - 1);

      el.style.transform = `translate3d(0, 0, ${z.toFixed(1)}px)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `blur(${blur.toFixed(2)}px)`;
    });

    // Reveal the copy just after the section pins, and latch it. This used to
    // ramp the whole block's opacity with scroll, which meant the line-by-line
    // reveal underneath ran — and finished — while the block was still at zero
    // opacity. You never saw it: the text simply faded up already settled.
    // Driving the reveal itself means the lines rise into place on screen, the
    // way every other headline on the site does.
    if (p > REVEAL_AT) setCopyIn((v) => v || true);
  });

  return (
    <section ref={sectionRef} className={styles.portal} id="join">
      <div
        ref={slidesRef}
        className={styles.portalSlides}
        aria-hidden="true"
        style={{ perspective: `${PERSPECTIVE}px` }}
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
        <div
          className={styles.portalContent}
          style={{ pointerEvents: copyIn ? "auto" : "none" }}
        >
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
