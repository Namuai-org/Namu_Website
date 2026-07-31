"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

const VALUES = [1, 2, 3, 4, 5, 6].map((n) => `home.value${n}`);

/**
 * Hand-drawn annotations, drawn on with stroke-dashoffset.
 *
 * `underline` sits under the term, `circled` loops around it, and `connect`
 * arcs from the term across the gutter to the definition — the mode that does
 * most of the work of making the pair feel hand-annotated rather than laid out.
 */
const DOODLES = [
  {
    mode: "underline",
    viewBox: "0 0 300 40",
    d: "M1 20C50.5 4.5 145 1 197 2.5C149 4.2 51 13.7 28 30.5C19.7 36.5 25.5 39.5 42 37.5C74 33.6 152 11.5 221.5 11.5C260 11.5 282.5 18 298.5 24.5",
  },
  {
    mode: "connect",
    viewBox: "0 0 420 120",
    d: "M2 66C80 70 130 30 186 40C224 47 226 88 184 92C146 96 142 52 214 44C300 34 358 58 418 30",
  },
  {
    mode: "circled",
    viewBox: "0 0 320 120",
    d: "M243 30C200 10 96 4 46 26C-4 48 6 92 78 106C150 120 274 110 302 76C324 49 292 22 232 12",
  },
  {
    mode: "underline",
    viewBox: "0 0 300 30",
    d: "M2 22C60 8 150 2 298 12",
  },
  {
    mode: "connect",
    viewBox: "0 0 420 120",
    d: "M2 78C88 92 158 52 210 34C246 22 268 44 240 60C210 77 176 56 210 40C268 14 350 40 418 22",
  },
  {
    mode: "underline",
    viewBox: "0 0 300 40",
    d: "M2 26C48 10 128 2 186 6C244 10 216 22 150 28C86 34 44 30 12 22C48 14 200 10 298 18",
  },
] as const;

type DoodleBox = { left: number; top: number; width: number; height: number };

export function Values() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const termRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const defsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [box, setBox] = useState<DoodleBox | null>(null);
  /** Which value's annotation has been told to draw. Never a boolean: it has to
      be false for the incoming value in the very same render that `active`
      changes, which a boolean toggled from an effect cannot do. */
  const [drawnFor, setDrawnFor] = useState<number | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  // Position the annotation against whichever term is currently active.
  const placeDoodle = useCallback(
    (index: number) => {
      const term = termRefs.current[index];
      const list = listRef.current;
      if (!term || !list) return;

      const t0 = term.getBoundingClientRect();
      const l0 = list.getBoundingClientRect();
      const mode = DOODLES[index].mode;

      // Placement rules follow the reference: connect runs from the end of the
      // term across to where the definition starts; underline sits under the
      // term at 1.2x its width; circled is centred on the term's midline.
      if (mode === "connect") {
        const defs = defsRef.current;
        const termEnd = t0.right - l0.left;
        const defStart = defs
          ? defs.getBoundingClientRect().left - l0.left
          : termEnd + 220;
        setBox({
          left: termEnd,
          top: t0.top - l0.top + t0.height * 0.28,
          width: Math.max(180, defStart - termEnd),
          height: t0.height * 1.15,
        });
      } else if (mode === "circled") {
        const height = t0.height * 1.5;
        setBox({
          left: t0.left - l0.left - t0.width * 0.12,
          top: t0.top - l0.top + t0.height / 2 - height / 2,
          width: t0.width * 1.28,
          height,
        });
      } else {
        setBox({
          left: t0.left - l0.left,
          top: t0.top - l0.top + t0.height * 0.84,
          width: t0.width * 1.2,
          height: t0.height * 0.42,
        });
      }
    },
    [],
  );

  // Hold every annotation undrawn until the section is actually on screen.
  // Otherwise the first one animates during page load and is already sitting
  // there, fully drawn, by the time anyone scrolls down to it.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    placeDoodle(active);
  }, [active, placeDoodle]);

  useEffect(() => {
    if (!hasEntered) return;
    // Two frames, and both are load-bearing. The <svg> is keyed by `active`, so
    // the incoming annotation is a brand-new element mounted at full offset —
    // but a transition needs a *painted* starting value to animate away from.
    // One frame lets it paint undrawn (and lets the reposition land, so the
    // line never draws from where the previous one sat); the second flips it.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setDrawnFor(active)),
    );
    return () => cancelAnimationFrame(id);
  }, [active, hasEntered]);

  useRafScroll((scrollY, viewportH) => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.innerWidth <= 900) return;

    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const runway = section.offsetHeight - viewportH;
    if (runway <= 0) return;

    const p = clamp((scrollY - top) / runway);
    // Bias slightly so the last value gets its full share of the runway.
    const index = Math.min(
      VALUES.length - 1,
      Math.floor(p * VALUES.length * 0.999),
    );
    setActive((cur) => (cur === index ? cur : index));
  });

  const doodle = DOODLES[active];

  return (
    <div ref={sectionRef} className={styles.values} id="values">
      <div className={styles.valuesPin}>
        <div className={styles.valuesSticky}>
          <div className="ds-container ds-outer" style={{ width: "100%" }}>
            <ScrollObject>
              <h2 className={`h4 ${styles.valuesTitle}`}>
                <SplitText text={t("home.values.title")} />
              </h2>
            </ScrollObject>

            <div className={styles.valuesCols} ref={listRef}>
              <div className={styles.valuesList}>
                {VALUES.map((key, i) => (
                  <button
                    key={key}
                    type="button"
                    ref={(el) => {
                      termRefs.current[i] = el;
                    }}
                    onClick={() => setActive(i)}
                    className={`h3 ${styles.valueTerm} ${
                      i === active ? styles.valueTermActive : ""
                    }`}
                    aria-current={i === active}
                  >
                    {t(`${key}.name`)}
                  </button>
                ))}

                {box ? (
                  // Keyed by `active` so each value gets its own element. Reusing
                  // one <svg> meant the offset went 0 -> 1 -> 0 across two frames,
                  // and the browser simply reversed a transition that had barely
                  // left 0 — so every annotation after the first arrived looking
                  // already drawn.
                  <svg
                    key={active}
                    aria-hidden="true"
                    className={`${styles.doodle} ${styles.doodleActive}`}
                    viewBox={doodle.viewBox}
                    preserveAspectRatio="none"
                    style={{
                      left: `${box.left}px`,
                      top: `${box.top}px`,
                      width: `${box.width}px`,
                      height: `${box.height}px`,
                    }}
                  >
                    <path
                      d={doodle.d}
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={drawnFor === active ? 0 : 1}
                    />
                  </svg>
                ) : null}
              </div>

              <div className={styles.valuesDefs} ref={defsRef}>
                {VALUES.map((key, i) => (
                  <div
                    key={key}
                    className={`${styles.valueDef} ${
                      i === active ? styles.valueDefActive : ""
                    }`}
                    aria-hidden={i !== active}
                  >
                    <h3 className={`h5 ${styles.valueMobileTerm}`}>
                      {t(`${key}.name`)}
                    </h3>
                    <p className="h5">{t(`${key}.body`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
