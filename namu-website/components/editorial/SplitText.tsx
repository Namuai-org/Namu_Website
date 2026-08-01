"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useParentInView } from "./ScrollObject";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = {
  /** Plain text — gets measured and split into real visual lines. */
  text?: string;
  /** Pre-split lines, for headlines where the break is a design decision. */
  lines?: ReactNode[];
  /** Seconds added before the per-line stagger starts. */
  delay?: number;
  /** Reveal as soon as it mounts instead of waiting for a parent ScrollObject. */
  immediate?: boolean;
  /**
   * Drive the reveal from outside. For copy that is pinned on screen for a
   * whole section, "has entered the viewport" fires almost immediately and the
   * lines finish animating long before anyone can see them.
   */
  active?: boolean;
  className?: string;
  /** Accessible string when `lines` contains markup. Defaults to `text`. */
  srText?: string;
};

/**
 * Masked line reveal. Each visual line sits in an overflow-hidden wrapper and
 * slides up from below, staggered top to bottom.
 *
 * When `text` is given the component measures where the browser actually
 * wrapped the copy and re-measures on resize, so lines always match the
 * rendered layout rather than a guess.
 */
export function SplitText({
  text,
  lines,
  delay = 0,
  immediate = false,
  active,
  className = "",
  srText,
}: Props) {
  const parentInView = useParentInView();
  const measureRef = useRef<HTMLSpanElement>(null);
  const [measured, setMeasured] = useState<string[] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const words = useMemo(
    () => (text ? text.split(/\s+/).filter(Boolean) : []),
    [text],
  );

  // Group words into lines by comparing their measured vertical offsets.
  useIsomorphicLayoutEffect(() => {
    if (!text) return;
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const spans = Array.from(
        el.querySelectorAll<HTMLSpanElement>("[data-word]"),
      );
      if (!spans.length) return;

      const grouped: string[] = [];
      let currentTop: number | null = null;

      for (const span of spans) {
        const top = span.offsetTop;
        // Sub-pixel differences within a line are normal; a real line break
        // moves the word by most of a line-height.
        if (currentTop === null || Math.abs(top - currentTop) > 4) {
          currentTop = top;
          grouped.push(span.textContent ?? "");
        } else {
          grouped[grouped.length - 1] += ` ${span.textContent ?? ""}`;
        }
      }

      // Bail out when nothing changed. Committing a fresh array every time
      // would re-render, resize the observed node, and re-trigger the
      // observer — an endless loop that locks up the page.
      setMeasured((prev) =>
        prev &&
        prev.length === grouped.length &&
        prev.every((line, i) => line === grouped[i])
          ? prev
          : grouped,
      );
    };

    measure();

    // Only a change in available WIDTH can change where the copy wraps.
    // Height changes are a consequence of re-rendering the lines, so
    // reacting to them would feed the observer its own output.
    let lastWidth = el.getBoundingClientRect().width;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? lastWidth;
      if (Math.abs(width - lastWidth) < 0.5) return;
      lastWidth = width;
      measure();
    });
    ro.observe(el);

    // Font swap changes wrapping after the initial measure.
    document.fonts?.ready
      .then(() => {
        lastWidth = el.getBoundingClientRect().width;
        measure();
      })
      .catch(() => {});

    return () => ro.disconnect();
  }, [text]);

  const revealed = active ?? (immediate ? mounted : parentInView);
  const renderLines: ReactNode[] = lines ?? measured ?? [];
  const accessibleText = srText ?? text ?? "";

  return (
    <span
      className={`split-text ${revealed ? "in-view" : ""} ${className}`.trim()}
      style={{ "--delay": delay } as React.CSSProperties}
    >
      {accessibleText ? (
        <span className="sr-only">{accessibleText}</span>
      ) : null}

      {/* Hidden mirror used purely to find where the browser wraps the copy.
          A span, not a div — SplitText is routinely used inside <p>.

          It stays in normal flow and collapses to zero height rather than
          being absolutely positioned at width:100%. Inside an inline parent
          such as <a>, a percentage width would depend on the shrink-to-fit
          width of the very box it sits in, and Chrome spins resolving it. */}
      {text && !lines ? (
        <span
          ref={measureRef}
          aria-hidden="true"
          style={{
            display: "block",
            height: 0,
            overflow: "hidden",
            visibility: "hidden",
            pointerEvents: "none",
          }}
        >
          {words.map((w, i) => (
            <span data-word key={`${w}-${i}`}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      ) : null}

      <span aria-hidden="true" style={{ display: "block" }}>
        {renderLines.map((line, i) => (
          <span
            className="line-wrapper"
            key={i}
            style={{ "--line-index": i } as React.CSSProperties}
          >
            <span className="line">{line}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
