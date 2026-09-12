"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume } from "./icons";
import styles from "./voice.module.css";

export type Voice = {
  name: string;
  /** Drives the swatch and the blob behind the stage. */
  color: string;
};

export type Emotion = { name: string };

type Props = {
  voices: Voice[];
  emotions: Emotion[];
  /** `clips[voice][emotion]`, once the recordings exist. */
  clips?: Record<string, Record<string, string>>;
};

/**
 * Voice down the left, emotion down the right, and the crossing of the two
 * named in the middle over a wash of the voice's colour.
 *
 * The stage is deliberately bare — voice, emotion, two round controls — so the
 * colour and the type carry it rather than a player chrome.
 */
export function VoiceEmotionGrid({ voices, emotions, clips }: Props) {
  const [voice, setVoice] = useState(0);
  const [emotion, setEmotion] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const current = voices[voice];
  const currentEmotion = emotions[emotion];
  const src = clips?.[current.name]?.[currentEmotion.name];

  // Changing either axis stops whatever was playing — the clip no longer
  // matches what the stage says.
  useEffect(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, [voice, emotion]);

  /* On a phone each list is a swipeable row, and a chip tapped at the edge
     would otherwise stay half out of view. Centre it within its own row —
     scrolling the row rather than calling scrollIntoView, which would also
     move the page. */
  const centre = (tab: HTMLElement) => {
    const list = tab.parentElement;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      document.querySelectorAll("audio").forEach((o) => o !== el && o.pause());
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className={styles.grid}
      style={{ "--blob": current.color } as React.CSSProperties}
    >
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
              onClick={(e) => {
                setVoice(i);
                centre(e.currentTarget);
              }}
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
        <p className={`text-ui ${styles.gridStageVoice}`}>{current.name}</p>
        <p className={styles.gridStageEmotion}>{currentEmotion.name}</p>

        <div className={styles.gridControls}>
          <button
            type="button"
            className={styles.gridRound}
            disabled={!src}
            aria-label={`Preview the ${current.name} voice`}
          >
            <Volume />
          </button>
          <button
            type="button"
            className={styles.gridRound}
            disabled={!src}
            onClick={toggle}
            aria-label={playing ? "Pause sample" : "Play sample"}
            aria-pressed={playing}
          >
            {playing ? <Pause /> : <Play />}
          </button>
        </div>

        {src ? (
          <audio
            ref={audioRef}
            src={src}
            preload="none"
            onEnded={() => setPlaying(false)}
          />
        ) : null}
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
              onClick={(e) => {
                setEmotion(i);
                centre(e.currentTarget);
              }}
            >
              <span className="text-ui">{e.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
