"use client";

import { ScrollObject } from "@/components/editorial/ScrollObject";
import styles from "./interpret.module.css";

/** Seconds the track spans. Everything below is a share of it. */
const SPAN = 4;
/** When the speaker starts and stops. */
const SAID = { start: 0, end: 2.6 };
/** When the interpretation starts and stops. The offset is the whole claim. */
const HEARD = { start: 0.9, end: 3.3 };

const pc = (s: number) => `${(s / SPAN) * 100}%`;

/**
 * Two lanes on one clock: what the speaker is still saying, and what the other
 * person is already hearing.
 *
 * The bars overlap on purpose. A transcript can arrive after the fact and stay
 * useful; an interpretation cannot, because the conversation has moved on. Set
 * against a shared axis, the overlap becomes the subject and the figure is
 * only the label on the gap.
 *
 * Everything sits in one grid so the lanes, the gap marker and the axis all
 * measure against the same rail — otherwise the "0.9s" would drift away from
 * the bar edge it is describing.
 */
export function LatencyTrack() {
  const lag = (HEARD.start - SAID.start).toFixed(1);

  return (
    <ScrollObject className={styles.track}>
      <div className={styles.trackGrid}>
        <span className={`text-caption ${styles.laneName}`}>They speak</span>
        <div className={styles.laneRail}>
          <span
            className={`${styles.bar} ${styles.barSaid}`}
            style={
              {
                left: pc(SAID.start),
                "--w": pc(SAID.end - SAID.start),
              } as React.CSSProperties
            }
          />
        </div>

        {/* The measured gap, sitting literally between the two lanes. */}
        <span aria-hidden="true" />
        <div className={styles.gapRow}>
          <span className={styles.gap} style={{ width: pc(HEARD.start) }}>
            <span className={styles.gapRule} aria-hidden="true" />
            <span className={`text-caption ${styles.gapLabel}`}>{lag}s</span>
          </span>
        </div>

        <span className={`text-caption ${styles.laneName}`}>You hear it</span>
        <div className={styles.laneRail}>
          <span
            className={`${styles.bar} ${styles.barHeard}`}
            style={
              {
                left: pc(HEARD.start),
                "--w": pc(HEARD.end - HEARD.start),
                transitionDelay: "0.3s",
              } as React.CSSProperties
            }
          />
        </div>

        <span aria-hidden="true" />
        <div className={styles.trackAxis} aria-hidden="true">
          {Array.from({ length: SPAN + 1 }, (_, i) => (
            <span key={i} className={styles.tick}>
              <span className={`text-caption ${styles.tickLabel}`}>{i}s</span>
            </span>
          ))}
        </div>
      </div>

      <p className={`text-caption ${styles.trackNote}`}>
        They are still talking when the interpretation starts. That overlap is
        what keeps a conversation feeling like a conversation.
      </p>
    </ScrollObject>
  );
}
