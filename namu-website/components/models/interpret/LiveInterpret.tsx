"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./interpret.module.css";

/** Source line and what comes back. Short enough to read in one glance. */
const PAIRS = [
  { ha: "Buhu goma na gero.", fr: "Dix sacs de mil." },
  { ha: "Nawa ne farashin yau?", fr: "C'est combien aujourd'hui ?" },
  { ha: "Zan aika mota da safe.", fr: "J'enverrai le camion demain matin." },
  { ha: "Ba na jin ka sosai.", fr: "Je ne t'entends pas bien." },
  { ha: "Mun gama, na gode.", fr: "C'est fait, merci." },
];

/** How long a pair holds before the next one starts. */
const HOLD = 3800;
/** The lag the second line runs behind the first. This is the whole point. */
const LAG = 620;
/** Fade duration, matched to the CSS transition below. */
const FADE = 420;

/**
 * The hero's live pair: a Hausa line above, its French below.
 *
 * The two lines do not change together. The French swaps `LAG` after the
 * Hausa, so for a beat you are looking at a line whose interpretation has not
 * landed yet — which is exactly what using an interpreter feels like, and
 * exactly the number the performance section later puts a figure on. Nothing
 * here is decorative: the gap is the product.
 */
export function LiveInterpret() {
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [topOut, setTopOut] = useState(false);
  const [bottomOut, setBottomOut] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const after = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    const advance = () => {
      /* Fade the Hausa out, swap it, then repeat for the French one lag
         later. Each line owns its own timeline. */
      setTopOut(true);
      after(FADE, () => {
        setTop((i) => (i + 1) % PAIRS.length);
        setTopOut(false);
      });
      after(LAG, () => {
        setBottomOut(true);
        after(LAG + FADE, () => {
          setBottom((i) => (i + 1) % PAIRS.length);
          setBottomOut(false);
        });
      });
    };

    const id = setInterval(advance, HOLD);
    return () => {
      clearInterval(id);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div className={styles.live}>
      <p className={styles.liveRow}>
        <span className={`text-caption ${styles.liveTag}`}>HA</span>
        <span
          className={`${styles.liveLine} ${topOut ? styles.liveOut : ""}`}
          lang="ha"
        >
          {PAIRS[top].ha}
        </span>
      </p>

      <span className={styles.liveRule} aria-hidden="true" />

      <p className={styles.liveRow}>
        <span className={`text-caption ${styles.liveTag}`}>FR</span>
        <span
          className={`${styles.liveLine} ${bottomOut ? styles.liveOut : ""}`}
          lang="fr"
        >
          {PAIRS[bottom].fr}
        </span>
      </p>
    </div>
  );
}
