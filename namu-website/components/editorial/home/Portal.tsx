"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import { Button } from "../Button";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

export type PortalImage = { src: string; alt: string };

/**
 * Where each panel should sit *at the moment it is sharp*, not where it rests.
 *
 * A panel spends its flight being pulled toward the middle of the frame by
 * perspective, so its resting CSS position is nowhere near where you actually
 * see it. Declaring the resting edge offsets meant solving that backwards by
 * hand, in vmax, for one viewport shape — which is how two panels ended up
 * hanging off the bottom of the screen and the two founders ended up the
 * smallest things in the flight.
 *
 * So: `cx`/`cy` are the panel's centre as a fraction of the viewport at the
 * focal plane, `w` is its width in vmax, and `place()` solves for the resting
 * position. Read the numbers below as the picture you get.
 *
 * The middle of the frame — roughly x 0.30-0.70, y 0.27-0.73 — belongs to the
 * copy, so nothing is centred there.
 *
 * `feature` marks the two founders: bigger, sharper, and held at full opacity
 * longer than the rest.
 */
type Slot = {
  cx: number;
  cy: number;
  /** Width in vmax. */
  w: number;
  /** True aspect ratio of the file in this slot, so `cover` never crops. */
  ratio: string;
  feature?: boolean;
};

const LAYOUT: Slot[] = [
  { cx: 0.11, cy: 0.18, w: 13, ratio: "736 / 1022" }, // children-dusk
  { cx: 0.09, cy: 0.5, w: 13, ratio: "736 / 1104" }, // portrait-headwrap
  { cx: 0.3, cy: 0.1, w: 13, ratio: "736 / 736" }, // baskets-wall
  { cx: 0.2, cy: 0.76, w: 30, ratio: "1179 / 861", feature: true }, // Mouhamad
  { cx: 0.9, cy: 0.16, w: 13, ratio: "736 / 1041" }, // acacia-sunset
  { cx: 0.34, cy: 0.9, w: 12, ratio: "736 / 920" }, // elephants-crossing
  { cx: 0.82, cy: 0.46, w: 24, ratio: "1179 / 1262", feature: true }, // co-founder
  { cx: 0.7, cy: 0.12, w: 12, ratio: "736 / 920" }, // boys-shallows
  { cx: 0.63, cy: 0.88, w: 12, ratio: "719 / 1079" }, // drummer
  { cx: 0.91, cy: 0.8, w: 12, ratio: "600 / 965" }, // oryx-dune
  { cx: 0.49, cy: 0.14, w: 9, ratio: "736 / 1303" }, // highlands
];

const PERSPECTIVE = 250; // vh — must match --perspective in the stylesheet
const Z_START = -300; // vh, far from the camera
const Z_END = 50; // vh, past the camera

/* The scale a panel is drawn at as it crosses the focal plane (local 0.5),
   which is the moment it is fully opaque and unblurred. `place()` divides by
   this to turn a wanted on-screen position into a resting one. */
const MID_Z = Z_START + (Z_END - Z_START) * 0.5;
const MID_SCALE = PERSPECTIVE / (PERSPECTIVE - MID_Z);

/* How much of a viewport the stream gets as a head start. Without it the
   flight only begins once the section's top has reached the top of the
   screen, which left the first half-screen of the section empty — you arrived
   to nothing and had to keep scrolling before anything showed up. */
const LEAD_IN = 0.45;

export function Portal({ images }: { images: PortalImage[] }) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Resting position, solved from where the slot wants the panel to be when it
     is sharp. Runs on mount and on resize rather than per frame: it only
     depends on the viewport. Below 900px the stylesheet lays the panels out as
     a static grid with !important, so these values are ignored. */
  const place = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (vw <= 900) return;
    const vmax = Math.max(vw, vh);

    LAYOUT.forEach((slot, i) => {
      const el = slideRefs.current[i];
      if (!el) return;

      const [rw, rh] = slot.ratio.split("/").map((n) => Number(n.trim()));
      const w = (slot.w / 100) * vmax;
      const h = w * (rh / rw);

      const cx = vw / 2 + (slot.cx * vw - vw / 2) / MID_SCALE;
      const cy = vh / 2 + (slot.cy * vh - vh / 2) / MID_SCALE;

      el.style.width = `${w.toFixed(1)}px`;
      el.style.left = `${(cx - w / 2).toFixed(1)}px`;
      el.style.top = `${(cy - h / 2).toFixed(1)}px`;
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

      // Fade in, hold, then fade out as the panel passes the camera.
      // The ramp is still eased rather than linear — perspective pulls distant
      // panels toward the middle of the frame, where the copy sits, so they
      // should be faint while they are there — but only gently. At 2.2 over
      // 45% of the flight a panel was still under 10% opaque a quarter of the
      // way in, which read as nothing happening at all.
      //
      // The two founders come up faster and hold longer: they are the point of
      // the section, not texture passing behind it.
      const feature = LAYOUT[i].feature === true;
      const rampTo = feature ? 0.24 : 0.34;
      const holdTo = feature ? 0.9 : 0.84;

      let opacity: number;
      if (local < rampTo) opacity = Math.pow(local / rampTo, feature ? 1.1 : 1.35);
      else if (local < holdTo) opacity = 1;
      else opacity = clamp(1 - (local - holdTo) / (1 - holdTo));

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
      // Eleven blurred layers is a lot of compositing, so the maximum is lower
      // than it was for seven — which also keeps each panel readable for more
      // of its flight. The founders get half of it, so they stay recognisable
      // for most of theirs rather than only at the focal plane.
      const blur = (feature ? 5 : 10) * Math.abs(local * 2 - 1);

      el.style.transform = `translate3d(0, 0, ${z.toFixed(2)}vh)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `blur(${blur.toFixed(2)}px)`;
      // Panels nearer the camera must paint over the ones behind them.
      el.style.zIndex = String(Math.round(local * 100));
    });

    // The copy fades up shortly after the stream starts and then stays. It is
    // pinned in the middle of the screen for the whole section, so it reads as
    // something the panels are flying past rather than a panel of its own
    // sliding in from below.
    const content = contentRef.current;
    if (content) {
      const reveal = clamp((p - 0.16) / 0.26);
      content.style.opacity = reveal.toFixed(3);
      content.style.pointerEvents = reveal > 0.9 ? "auto" : "none";
    }
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
            style={{ aspectRatio: LAYOUT[i].ratio }}
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
        <div className={styles.portalContent} ref={contentRef}>
          <ScrollObject
            className={`ds-span ${styles.portalCopy}`}
            style={{ "--span": 10 } as React.CSSProperties}
          >
            <h2 className="h4">
              <SplitText text={t("home.join.title")} />
            </h2>
            <p className="text-regular">
              <SplitText text={t("home.join.body")} delay={0.1} />
            </p>
            <p className="text-regular">
              <SplitText text={t("home.join.body2")} delay={0.2} />
            </p>
            <p className="text-regular">
              <SplitText text={t("home.join.body3")} delay={0.3} />
            </p>
            <Button href="mailto:contact@namuai.org">
              {t("home.join.cta")}
            </Button>
          </ScrollObject>
        </div>
      </div>
    </section>
  );
}
