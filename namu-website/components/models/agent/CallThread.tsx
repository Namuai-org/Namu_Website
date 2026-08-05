"use client";

import { ScrollObject } from "@/components/editorial/ScrollObject";
import styles from "./agent.module.css";

export type CallLine = {
  who: "agent" | "caller";
  /** What was said, in Hausa. */
  said: string;
  /** Plain-English gloss, for readers of this page rather than callers. */
  gloss: string;
  /** What the agent did before it could answer. Shown between the turns. */
  work?: string;
};

/**
 * One call, end to end, with the agent's working shown.
 *
 * The interesting part of a voice agent is not that it talks back — it is the
 * gap between hearing and answering, where it has to look something up or
 * commit to an action. Most demos hide that gap. Here it is a line of its own
 * between the turns, so the call reads as work being done rather than as two
 * people swapping sentences.
 *
 * Hausa is the line that was spoken and takes the weight; the English under it
 * is a gloss for whoever is reading the page, not something a caller hears.
 */
export function CallThread({ lines }: { lines: CallLine[] }) {
  return (
    <div className={styles.thread}>
      {lines.map((line, i) => (
        <ScrollObject key={i} className={styles.threadItem}>
          {/* The work sits above the turn it made possible. */}
          {line.work ? (
            <p
              className={`slide-up ${styles.work}`}
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <span className={styles.workRule} aria-hidden="true" />
              <span className={styles.workText}>{line.work}</span>
            </p>
          ) : null}

          <div
            className={`slide-up ${styles.turn} ${
              line.who === "agent" ? styles.turnAgent : styles.turnCaller
            }`}
            style={{ "--i": line.work ? 1 : 0 } as React.CSSProperties}
          >
            <span className={`text-caption ${styles.turnWho}`}>
              {line.who === "agent" ? "Namu" : "Caller"}
            </span>
            <p className={styles.turnSaid} lang="ha">
              {line.said}
            </p>
            <p className={`text-caption ${styles.turnGloss}`} lang="en">
              {line.gloss}
            </p>
          </div>
        </ScrollObject>
      ))}
    </div>
  );
}
