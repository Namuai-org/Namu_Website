"use client";

import { useState } from "react";
import { AudioSample } from "./AudioSample";
import styles from "./voice.module.css";

export type Voice = {
  name: string;
  /** Drives the swatch and the blob behind the panel. */
  color: string;
  /** One line on where the voice sits — register, warmth, pace. */
  note: string;
};

export type Emotion = { name: string };

type Props = {
  voices: Voice[];
  emotions: Emotion[];
  /** `clips[voice][emotion]`, once the recordings exist. */
  clips?: Record<string, Record<string, string>>;
};

/**
 * Voice down the left, emotion down the right, one clip at the crossing.
 *
 * A soft blob of the selected voice's colour sits behind the two columns and
 * moves with the selection, which is what keeps a plain pair of tab lists
 * feeling like an instrument rather than a form.
 */
export function VoiceEmotionGrid({ voices, emotions, clips }: Props) {
  const [voice, setVoice] = useState(0);
  const [emotion, setEmotion] = useState(0);

  const current = voices[voice];
  const currentEmotion = emotions[emotion];
  const src = clips?.[current.name]?.[currentEmotion.name];

  return (
    <div className={styles.grid} style={{ "--blob": current.color } as React.CSSProperties}>
      <div className={styles.gridBlob} aria-hidden="true" />

      <div className={styles.gridCol}>
        <h3 className={`text-book ${styles.gridColTitle}`}>Voice</h3>
        <div role="tablist" aria-label="Voice" className={styles.gridList}>
          {voices.map((v, i) => (
            <button
              key={v.name}
              type="button"
              role="tab"
              aria-selected={voice === i}
              className={`${styles.gridTab} ${voice === i ? styles.gridTabActive : ""}`}
              onClick={() => setVoice(i)}
            >
              <span
                className={styles.gridSwatch}
                style={{ background: v.color }}
                aria-hidden="true"
              />
              <span className="text-ui">{v.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.gridStage}>
        <p className={`text-book ${styles.gridNote}`}>{current.note}</p>
        <AudioSample
          src={src}
          title={`${current.name} — ${currentEmotion.name}`}
        />
      </div>

      <div className={styles.gridCol}>
        <h3 className={`text-book ${styles.gridColTitle}`}>Emotion</h3>
        <div role="tablist" aria-label="Emotion" className={styles.gridList}>
          {emotions.map((e, i) => (
            <button
              key={e.name}
              type="button"
              role="tab"
              aria-selected={emotion === i}
              className={`${styles.gridTab} ${emotion === i ? styles.gridTabActive : ""}`}
              onClick={() => setEmotion(i)}
            >
              <span className="text-ui">{e.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
