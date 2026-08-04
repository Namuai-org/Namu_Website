"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "./icons";
import styles from "./voice.module.css";

const format = (s: number) => {
  if (!Number.isFinite(s)) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

type Props = {
  /** Clip URL. Without one the player renders in its resting state. */
  src?: string;
  /** Shown above the transport. */
  title?: string;
  /** Compact form: just the round button, no scrubber or timecodes. */
  compact?: boolean;
  className?: string;
};

/**
 * The transport used by every sample on the page: play/pause, a scrubber and
 * the elapsed/total timecodes.
 *
 * `src` is optional on purpose — the clips are not recorded yet. Without one
 * the player still lays out exactly as it will with audio, but the controls
 * are disabled rather than pretending to work. Pass a `src` and it plays.
 */
export function AudioSample({ src, title, compact = false, className = "" }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  /* Only one clip plays at a time — starting this one stops whatever else is
     going, which matters on a page with a dozen of them. */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onPlay = () => {
      document.querySelectorAll("audio").forEach((other) => {
        if (other !== el) other.pause();
      });
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
    };

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setPlaying(false));
    else el.pause();
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      className={`${compact ? styles.audioCompact : styles.audio} ${className}`.trim()}
    >
      {title ? <h3 className={`text-large ${styles.audioTitle}`}>{title}</h3> : null}

      <div className={styles.audioTransport}>
        <button
          type="button"
          className={styles.audioButton}
          onClick={toggle}
          disabled={!src}
          aria-label={playing ? "Pause audio" : "Play audio"}
          aria-pressed={playing}
        >
          {playing ? <Pause /> : <Play />}
        </button>

        {!compact && (
          <>
            <input
              type="range"
              className={styles.audioSlider}
              min={0}
              max={duration || 1}
              step={0.01}
              value={current}
              disabled={!src}
              aria-label="Audio progress"
              style={{ "--progress": `${progress}%` } as React.CSSProperties}
              onChange={(e) => {
                const el = audioRef.current;
                if (!el) return;
                el.currentTime = Number(e.target.value);
                setCurrent(Number(e.target.value));
              }}
            />
            <span className={styles.audioTime}>
              {format(current)} <span aria-hidden="true">/</span>{" "}
              {format(duration)}
            </span>
          </>
        )}
      </div>

      {src ? <audio ref={audioRef} src={src} preload="metadata" /> : null}
    </div>
  );
}
