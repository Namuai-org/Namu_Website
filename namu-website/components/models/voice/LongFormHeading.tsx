"use client";

import { useRef, useState } from "react";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import styles from "./voice.module.css";

/** Widest the vowel gets, at the middle of the runway. */
const MAX_REPEAT = 7;

/**
 * "Built for looooong form", where the long vowel actually gets longer as the
 * section crosses the viewport.
 *
 * The glyph is repeated rather than scaled: a transform would not affect
 * layout, so the letters after it would sit still and the stretched vowel
 * would run straight over them. Repeating pushes the rest of the word along,
 * which is the whole effect.
 */
export function LongFormHeading({
  before,
  stretch,
  after,
}: {
  before: string;
  /** The vowel that gets drawn out — one character reads best. */
  stretch: string;
  after: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(1);

  useRafScroll((scrollY, viewportH) => {
    const el = ref.current;
    if (!el) return;
    if (window.innerWidth <= 600) {
      setRepeat((cur) => (cur === 1 ? cur : 1));
      return;
    }

    const rect = el.getBoundingClientRect();
    // 0 as the block enters the bottom of the viewport, 1 as it leaves the top.
    const p = clamp((viewportH - rect.top) / (viewportH + rect.height));
    // Peak in the middle of the pass, so it draws out and settles back.
    const eased = Math.sin(p * Math.PI);
    const next = 1 + Math.round(eased * (MAX_REPEAT - 1));

    setRepeat((cur) => (cur === next ? cur : next));
  });

  return (
    <div ref={ref} className={styles.longForm}>
      <h3 className={styles.longFormLine}>
        <span className="sr-only">
          {before}
          {stretch}
          {after}
        </span>
        <span aria-hidden="true">
          {before}
          {stretch.repeat(repeat)}
          {after}
        </span>
      </h3>
    </div>
  );
}
