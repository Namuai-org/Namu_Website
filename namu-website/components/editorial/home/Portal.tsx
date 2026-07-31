"use client";

import { useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import { Button } from "../Button";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

export type PortalImage = { src: string; alt: string };

/** Where each panel sits in the frame, and how big it is. */
/* All eleven hug the frame edges: the middle of the viewport has to stay clear
   for the copy the panels are flying past. Perspective pulls them inward as
   they approach, so an edge start is what puts them on screen mid-flight.

   Each ratio is the true aspect ratio of the image in that slot, so `cover`
   never has anything to crop. Change one, change the other. */
const LAYOUT = [
  { left: "-3vmax", top: "2vmax", width: "15vmax", ratio: "736 / 1022" },
  { right: "-4vmax", top: "8vmax", width: "19vmax", ratio: "736 / 1104" },
  { left: "-7vmax", top: "32vmax", width: "21vmax", ratio: "736 / 736" },
  { right: "6vmax", top: "-6vmax", width: "17vmax", ratio: "1179 / 861" },
  { left: "-2vmax", bottom: "-12vmax", width: "16vmax", ratio: "736 / 1041" },
  { right: "-6vmax", bottom: "-8vmax", width: "18vmax", ratio: "736 / 920" },
  { left: "9vmax", top: "-12vmax", width: "13vmax", ratio: "1179 / 1262" },
  { right: "10vmax", bottom: "-20vmax", width: "14vmax", ratio: "736 / 920" },
  { left: "-9vmax", top: "14vmax", width: "14vmax", ratio: "719 / 1079" },
  { right: "-2vmax", top: "26vmax", width: "13vmax", ratio: "600 / 965" },
  { left: "4vmax", bottom: "-24vmax", width: "15vmax", ratio: "736 / 1303" },
] as const;

const PERSPECTIVE = 250; // vh — must match --perspective in the stylesheet
const Z_START = -300; // vh, far from the camera
const Z_END = 50; // vh, past the camera

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
      let opacity: number;
      if (local < 0.34) opacity = Math.pow(local / 0.34, 1.35);
      else if (local < 0.84) opacity = 1;
      else opacity = clamp(1 - (local - 0.84) / 0.16);

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
      // of its flight.
      const blur = 10 * Math.abs(local * 2 - 1);

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
        {images.slice(0, LAYOUT.length).map((img, i) => {
          const { ratio, ...pos } = LAYOUT[i];
          return (
            <div
              key={img.src + i}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className={styles.portalSlide}
              style={{
                ...pos,
                aspectRatio: ratio,
              }}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          );
        })}
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
