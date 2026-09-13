"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "../icons";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

export type Story = {
  href: string;
  image: string;
  alt: string;
  title: string;
  category: string;
  readTime: string;
};

/**
 * A horizontal rail you drag through. Pointer drag and horizontal wheel both
 * move it; releasing hands off to a short inertial glide that settles against
 * the track's bounds. On a touch tablet the drag is a finger: the track
 * declares `touch-action: pan-y`, so the browser keeps vertical swipes for the
 * page and hands horizontal ones to the pointer handlers below.
 *
 * On a phone it is not a rail at all. The stories stack down the page, as the
 * reference lists them on mobile, so the drag, the glide and the transform
 * all stand down below 600px and pick up again if the window widens.
 */
export function StoryRail({ stories }: { stories: Story[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  /* Whether either end has been reached, so the arrows can go inert there. */
  const [bounds, setBounds] = useState({ start: true, end: false });
  /* Populated by the effect below — the buttons cannot reach the rail's motion
     state directly, since it lives in a ref the effect closes over. */
  const nudgeRef = useRef<(dir: 1 | -1) => void>(() => {});

  const state = useRef({
    x: 0,
    target: 0,
    pointerDown: false,
    startX: 0,
    startTarget: 0,
    velocity: 0,
    moved: false,
  });

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const s = state.current;

    const stacked = window.matchMedia("(max-width: 600px)");
    const onLayoutChange = () => {
      if (!stacked.matches) return;
      s.x = s.target = s.velocity = 0;
      s.pointerDown = false;
      track.style.removeProperty("transform");
    };
    onLayoutChange();
    stacked.addEventListener("change", onLayoutChange);

    const maxScroll = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const clampTarget = () => {
      const max = maxScroll();
      // Allow a little rubber-band overshoot past either end.
      s.target = Math.min(60, Math.max(-max - 60, s.target));
    };

    /* One card plus the gap between them, so a press moves exactly one card
       rather than a guessed number of pixels. */
    const step = () => {
      const card = track.firstElementChild as HTMLElement | null;
      if (!card) return viewport.clientWidth * 0.8;
      const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      return card.getBoundingClientRect().width + gap;
    };

    nudgeRef.current = (dir) => {
      s.velocity = 0;
      s.target -= dir * step();
      // No rubber band on a button press — a click should land somewhere real.
      s.target = Math.min(0, Math.max(-maxScroll(), s.target));
    };

    let raf = 0;
    let lastBounds = "";
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (stacked.matches) return;

      if (!s.pointerDown) {
        s.target += s.velocity;
        s.velocity *= 0.94;
        if (Math.abs(s.velocity) < 0.05) s.velocity = 0;

        // Settle back inside the bounds once the glide is done.
        const max = maxScroll();
        if (s.target > 0) s.target += (0 - s.target) * 0.12;
        else if (s.target < -max) s.target += (-max - s.target) * 0.12;
      }

      s.x += (s.target - s.x) * 0.12;
      track.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;

      const max = maxScroll();
      const next = `${s.x > -2}|${s.x < -max + 2}`;
      if (next !== lastBounds) {
        lastBounds = next;
        const [start, end] = next.split("|");
        setBounds({ start: start === "true", end: end === "true" });
      }
    };
    raf = requestAnimationFrame(loop);

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || stacked.matches) return;
      s.pointerDown = true;
      s.moved = false;
      s.startX = e.clientX;
      s.startTarget = s.target;
      s.velocity = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!s.pointerDown) return;
      const delta = e.clientX - s.startX;
      /* The pointer is captured only once the press has become a drag. Capturing
         it on press made the track the target of every click that followed, so
         a plain click on a story never reached its link and went nowhere. */
      if (!s.moved && Math.abs(delta) > 4) {
        s.moved = true;
        setDragging(true);
        track.setPointerCapture(e.pointerId);
      }
      const next = s.startTarget + delta;
      s.velocity = next - s.target;
      s.target = next;
      clampTarget();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!s.pointerDown) return;
      s.pointerDown = false;
      setDragging(false);
      if (track.hasPointerCapture(e.pointerId))
        track.releasePointerCapture(e.pointerId);

      /* A finger lands on a card. With a mouse the free glide is the point,
         but a flick on a phone that stops a third of the way into a card
         reads as the rail jamming. Project where the momentum would have
         carried it, settle on the nearest card, and never skip more than one
         per flick. The existing lerp does the easing. */
      if (e.pointerType === "touch" && e.type === "pointerup" && s.moved) {
        const st = step();
        const max = maxScroll();
        const from = Math.round(s.startTarget / st) * st;
        const projected = s.target + s.velocity * 12;
        let snapped = Math.round(projected / st) * st;
        snapped = Math.min(from + st, Math.max(from - st, snapped));
        s.target = Math.min(0, Math.max(-max, snapped));
        s.velocity = 0;
      }
    };

    // Swallow the click that ends a drag so it doesn't follow the card link.
    const onClickCapture = (e: MouseEvent) => {
      if (s.moved) {
        e.preventDefault();
        e.stopPropagation();
        s.moved = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (stacked.matches || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      s.velocity = 0;
      s.target -= e.deltaX;
      clampTarget();
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    // On the window: until a drag has captured the pointer, a press can be
    // released off the track, and the rail must still hear it end.
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      stacked.removeEventListener("change", onLayoutChange);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <section className={styles.rail}>
      <ScrollObject className={styles.railInner}>
        <div className="ds-container" ref={viewportRef}>
          <div
            ref={trackRef}
            className={`${styles.railTrack} ${
              dragging ? styles.railTrackDragging : ""
            }`}
          >
            {stories.map((story, i) => (
              <article key={`${story.href}-${i}`} className={styles.railCard}>
                <div className={styles.railThumb}>
                  <span className={styles.railThumbInner}>
                    <img
                      src={story.image}
                      alt=""
                      draggable={false}
                      loading="lazy"
                      className="scale-out"
                    />
                  </span>
                </div>

                <div className={styles.railBody}>
                  <div>
                    <div className={`text-caption text-soft ${styles.railKicker}`}>
                      {story.category}
                    </div>
                    <h3 className={`h7 ${styles.railTitle}`}>
                      {/* One link for the whole card: its hit area is stretched
                          over the picture and the copy, so a click anywhere on
                          the story opens it. */}
                      <Link href={story.href} className={styles.railLink} draggable={false}>
                        <SplitText text={story.title} />
                      </Link>
                    </h3>
                  </div>

                  <div className={`text-caption ${styles.railFoot}`}>
                    {story.readTime}
                    <ArrowRight style={{ width: "1.2em" }} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Real controls, not a caption. Dragging still works; these are for
              anyone who does not think to try it, and for keyboards. */}
          <div className={styles.railHint}>
            <button
              type="button"
              className={styles.railNav}
              onClick={() => nudgeRef.current(-1)}
              disabled={bounds.start}
              aria-label="Previous posts"
            >
              <ArrowRight
                style={{ width: "1.3em", transform: "rotate(180deg)" }}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              className={styles.railNav}
              onClick={() => nudgeRef.current(1)}
              disabled={bounds.end}
              aria-label="More posts"
            >
              <ArrowRight style={{ width: "1.3em" }} aria-hidden="true" />
            </button>
          </div>
        </div>
      </ScrollObject>
    </section>
  );
}
