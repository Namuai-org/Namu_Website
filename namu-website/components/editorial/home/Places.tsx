"use client";

import { useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

const PLACES = [1, 2, 3].map((n) => `home.lang${n}`);

/**
 * Optical corrections for letter pairs that leave an obvious gap when each
 * character sits in its own box. Applied as a negative right margin on the
 * first letter when the next one is a vowel.
 */
const KERN: Record<string, number> = {
  Y: -0.28,
  T: -0.26,
  V: -0.25,
  W: -0.24,
  P: -0.14,
  F: -0.12,
  A: -0.06,
};
const VOWELS = new Set("AEIOUaeiou");

function kernFor(char: string, next: string | undefined) {
  if (!next || !VOWELS.has(next)) return undefined;
  const k = KERN[char.toUpperCase()];
  return k ? `${k}em` : undefined;
}

export function Places({ images }: { images: string[] }) {
  const { t } = useTranslation();
  const runwayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useRafScroll((scrollY, viewportH) => {
    const runway = runwayRef.current;
    if (!runway) return;
    if (window.innerWidth <= 900) return;

    const rect = runway.getBoundingClientRect();
    const top = rect.top + scrollY;
    const total = runway.offsetHeight - viewportH;
    if (total <= 0) return;

    const p = clamp((scrollY - top) / total);
    const index = Math.min(
      PLACES.length - 1,
      Math.floor(p * PLACES.length * 0.999),
    );
    setActive((cur) => (cur === index ? cur : index));
  });

  return (
    <section className={styles.places} id="languages">
      <ScrollObject className={`ds-container ds-outer ${styles.placesIntro}`}>
        <h2 className="h4">
          <SplitText text={t("home.langs.title")} />
        </h2>
        <p
          className="text-large ds-span"
          style={
            {
              "--span": 10,
              marginInline: "auto",
              marginTop: "calc(30 * var(--unit-fx))",
            } as React.CSSProperties
          }
        >
          <SplitText text={t("home.langs.intro")} delay={0.15} />
        </p>
      </ScrollObject>

      <div
        ref={runwayRef}
        className={styles.placesRunway}
        style={{ height: `${PLACES.length * 100}vh` }}
      >
        <div className={styles.placesPin}>
          {PLACES.map((key, i) => {
            const name = t(`${key}.name`);
            const letters = Array.from(name);
            return (
              <article
                key={key}
                className={`${styles.placeCard} ${
                  i === active ? styles.placeCardActive : ""
                }`}
                aria-hidden={i !== active}
              >
                <div className={styles.placeMedia}>
                  <img src={images[i]} alt="" loading="lazy" />
                </div>

                <div className={`ds-container ds-outer ${styles.placeBody}`}>
                  <h3 className="h2" aria-label={name}>
                    <span className={styles.placeName} aria-hidden="true">
                      {letters.map((ch, li) => (
                        <span
                          key={li}
                          className={styles.placeLetter}
                          style={
                            {
                              "--i": li,
                              marginRight: kernFor(ch, letters[li + 1]),
                            } as React.CSSProperties
                          }
                        >
                          {ch}
                        </span>
                      ))}
                    </span>
                  </h3>

                  <p className={`text-large ${styles.placeText}`}>
                    {t(`${key}.body`)}
                  </p>

                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
