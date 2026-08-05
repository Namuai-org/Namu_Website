"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import styles from "./interpret.module.css";

export type Turn = {
  /** Which side opens this turn. The interpretation lands on the other. */
  from: "ha" | "fr";
  said: string;
  heard: string;
};

/** Below this the columns stack, and there is no gutter left to draw across. */
const STACK_AT = 900;

/**
 * Where `el` sits inside `host`, in layout coordinates.
 *
 * Walking the offsetParent chain rather than reading a single offsetTop: the
 * rows carry a transform while they animate in, and a transformed element
 * becomes the offsetParent for everything inside it. Left unhandled, every arc
 * measures from its own row and they all collapse onto the same few pixels.
 */
function offsetWithin(el: HTMLElement, host: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== host) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * A conversation carried by the model, laid out as the crossing it really is.
 *
 * Hausa holds the left column and French the right, whichever way a given turn
 * runs. What was said sits in its own language's column; what the other person
 * heard sits opposite. An arc drawn in the gutter joins the two and leans the
 * way that turn travelled — so the arcs alternate down the page, and you can
 * see without reading a word that this is one model working both ways rather
 * than two models bolted together.
 *
 * Geometry comes from `offsetLeft`/`offsetTop` rather than client rects: the
 * rows animate in on a transform, and a rect would report where a row is
 * mid-flight instead of where it will settle.
 */
export function CrossingTalk({ turns }: { turns: Turn[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const measure = () => {
      if (window.innerWidth <= STACK_AT) {
        setPaths([]);
        return;
      }

      const next: string[] = [];
      host.querySelectorAll<HTMLElement>(`.${styles.turn}`).forEach((row) => {
        const said = row.querySelector<HTMLElement>("[data-said]");
        const heard = row.querySelector<HTMLElement>("[data-heard]");
        if (!said || !heard) return;

        const a = offsetWithin(said, host);
        const b = offsetWithin(heard, host);
        const leftIsSource = a.x < b.x;

        /* Leave from the inner edge of the source and arrive at the inner edge
           of what it produced, a third of the way down each box so the arc
           meets the first line of text rather than the middle of a paragraph. */
        const x1 = leftIsSource ? a.x + said.offsetWidth : a.x;
        const y1 = a.y + said.offsetHeight * 0.34;
        const x2 = leftIsSource ? b.x : b.x + heard.offsetWidth;
        const y2 = b.y + heard.offsetHeight * 0.34;

        /* One control point, dropped below the midpoint, gives the arc its
           sag and lets the eye read which way the turn travelled. */
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 + Math.abs(y2 - y1) * 0.18 + 14;
        next.push(`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
      });

      setPaths(next);
      setBox({ w: host.offsetWidth, h: host.offsetHeight });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    /* Fonts landing late rewrap every row, and with it every arc. */
    document.fonts?.ready.then(measure).catch(() => {});

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
    } else {
      const io = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setDrawn(true),
        { threshold: 0.12 },
      );
      io.observe(host);
      return () => {
        ro.disconnect();
        io.disconnect();
      };
    }
    return () => ro.disconnect();
  }, [turns]);

  return (
    <div ref={hostRef} className={styles.talk}>
      {paths.length > 0 && (
        <svg
          className={styles.talkArcs}
          viewBox={`0 0 ${box.w} ${box.h}`}
          width={box.w}
          height={box.h}
          aria-hidden="true"
          fill="none"
        >
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              /* Normalised so one dash length draws every arc, whatever its
                 real length — otherwise short arcs finish first. */
              pathLength={1}
              className={`${styles.arc} ${drawn ? styles.arcDrawn : ""}`}
              style={{ transitionDelay: `${0.15 + i * 0.12}s` }}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}

      {turns.map((turn, i) => {
        const said = (
          <div
            data-said
            className={`slide-up ${styles.bubble} ${styles.bubbleSaid}`}
            style={{ "--i": 0 } as React.CSSProperties}
            lang={turn.from}
          >
            <span className={`text-caption ${styles.bubbleTag}`}>
              {turn.from === "ha" ? "Hausa" : "Français"}
            </span>
            <p className={styles.bubbleText}>{turn.said}</p>
          </div>
        );
        const heard = (
          <div
            data-heard
            className={`slide-up ${styles.bubble} ${styles.bubbleHeard}`}
            /* The interpretation lands a beat after what produced it. */
            style={{ "--i": 1 } as React.CSSProperties}
            lang={turn.from === "ha" ? "fr" : "ha"}
          >
            <span className={`text-caption ${styles.bubbleTag}`}>
              {turn.from === "ha" ? "Français" : "Hausa"}
            </span>
            <p className={styles.bubbleText}>{turn.heard}</p>
          </div>
        );

        /* Hausa always takes the left column and French the right, so the
           columns keep their identity and only the arc's lean changes. */
        return (
          <ScrollObject key={i} className={styles.turn}>
            {turn.from === "ha" ? said : heard}
            {turn.from === "ha" ? heard : said}
          </ScrollObject>
        );
      })}
    </div>
  );
}
