"use client";

import { useEffect, useState } from "react";
import styles from "./agent.module.css";

/** The loop the agent runs, once per turn. */
const STAGES = ["Hears", "Understands", "Decides", "Answers"];
/** How long each stage holds. Fast enough to read as a working loop. */
const STEP = 1100;

/**
 * The hero's turn meter: the four things the agent does, cycling.
 *
 * Every other model on the site does one job to one input. This one runs a
 * loop, and the loop is the product — so it is the first thing on the page,
 * running before you have read a word of the copy.
 *
 * The rail underneath fills across all four stages and resets, so it reads as
 * one turn completing rather than four separate lights blinking.
 */
export function TurnMeter() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), STEP);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.meter}>
      <ol className={styles.meterList}>
        {STAGES.map((label, i) => (
          <li
            key={label}
            className={`text-caption ${styles.meterStage} ${
              i === stage ? styles.meterOn : ""
            }`}
          >
            <span className={styles.meterDot} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ol>

      <div className={styles.meterRail} aria-hidden="true">
        <span
          className={styles.meterFill}
          style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
