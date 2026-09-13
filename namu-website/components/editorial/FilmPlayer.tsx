"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  IconFullscreen,
  IconFullscreenExit,
  IconPause,
  IconPlay,
  IconReplay,
  IconSoundOff,
  IconSoundOn,
} from "./icons";
import styles from "./film.module.css";

/**
 * - loading: waiting to start on its own; nothing drawn over the poster yet.
 * - idle: will not start on its own (reduced motion, or autoplay refused), so
 *   the play button is showing.
 * - suspended: paused by the page — scrolled away, or the tab hidden — and
 *   resumes by itself, so it is drawn as if still playing.
 * - error: neither file would play. The poster stays and the controls go.
 */
type Phase = "loading" | "idle" | "playing" | "paused" | "suspended" | "ended" | "error";

/** How long the controls stay up once the pointer stops — the reference's own delay. */
const HIDE_AFTER_MS = 2000;
/** A tap has no pointer to bring them back, so they stay up a little longer. */
const HIDE_AFTER_TOUCH_MS = 3000;
/** How much of the frame must be on screen before the film starts by itself. */
const PLAY_THRESHOLD = 0.4;
const SEEK_STEP = 5;
const PAGE_STEP = 10;

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
/** iPhone Safari cannot put an arbitrary element full screen, only the video. */
type InlineVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

export function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Keyboard focus, as opposed to the focus a mouse click leaves on a button.
 *  Browsers too old for :focus-visible throw on it; count those as keyboard,
 *  which errs towards keeping the controls on screen. */
function isKeyboardFocus(element: Element | null) {
  if (!element) return false;
  try {
    return element.matches(":focus-visible");
  } catch {
    return true;
  }
}

type Props = {
  webm?: string;
  mp4: string;
  /** Held until the film starts, and for good if neither file will decode. */
  poster: string;
  /** Accessible name for the player. */
  title: string;
  /** Text alternative: what the film shows and says. */
  description: string;
  /** Known length in seconds, for the time label before metadata arrives. */
  duration?: number;
  className?: string;
};

/**
 * A film that starts by itself, silently, as it scrolls into view — Aya's
 * watching model — in the anatomy of the reference's core-video: a poster, a
 * large round play button, and controls that surface when the pointer moves
 * and sink two seconds after it stops.
 *
 * Sound is never more than one tap away. While the film plays muted an
 * "Unmute" pill sits in the corner, because a phone has no hover to reveal a
 * control bar and this film has a score worth hearing.
 *
 * A mouse click on the picture plays and pauses, as on the reference. A tap
 * on a phone shows or hides the controls instead, the way native players
 * behave, so reaching for the scrubber does not stop the film.
 */
export function FilmPlayer({
  webm,
  mp4,
  poster,
  title,
  description,
  duration: knownDuration = 0,
  className = "",
}: Props) {
  const { t } = useTranslation();
  const descriptionId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const barToggleRef = useRef<HTMLButtonElement>(null);
  const soundTileRef = useRef<HTMLButtonElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);

  const [phase, setPhase] = useState<Phase>("loading");
  const phaseRef = useRef<Phase>("loading");
  phaseRef.current = phase;
  const [muted, setMuted] = useState(true);
  const [controls, setControls] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [duration, setDuration] = useState(knownDuration);
  const [scrubbing, setScrubbing] = useState(false);

  /* Refs for what the media events and timers need without re-subscribing. */
  const durationRef = useRef(knownDuration);
  const started = useRef(false);
  const userPaused = useRef(false);
  const pageIsPausing = useRef(false);
  const scrubbingRef = useRef(false);
  const lastPointer = useRef("mouse");
  const hideTimer = useRef(0);
  const lastSecond = useRef(-1);
  const ofLabel = useRef(t("film.of"));
  ofLabel.current = t("film.of");

  /* Progress is written straight to the DOM every frame — a CSS variable for
     the bar, text for the clock — rather than through React state, which
     would re-render the player sixty times a second. */
  const paint = useCallback(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;

    const total = durationRef.current || video.duration || 1;
    root.style.setProperty("--p", Math.min(1, video.currentTime / total).toFixed(4));

    const second = Math.floor(video.currentTime);
    if (second === lastSecond.current) return;
    lastSecond.current = second;

    if (currentRef.current) currentRef.current.textContent = formatTime(second);
    const slider = sliderRef.current;
    if (slider) {
      slider.setAttribute("aria-valuenow", String(second));
      slider.setAttribute(
        "aria-valuetext",
        `${formatTime(second)} ${ofLabel.current} ${formatTime(total)}`,
      );
    }
  }, []);

  const reveal = useCallback((ms: number) => {
    setControls(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      const video = videoRef.current;
      // Keyboard focus keeps them up; a mouse click on a button does not.
      const keyboardFocus =
        rootRef.current?.contains(document.activeElement) &&
        isKeyboardFocus(document.activeElement);
      if (video && !video.paused && !scrubbingRef.current && !keyboardFocus) {
        setControls(false);
      }
    }, ms);
  }, []);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    userPaused.current = false;
    // The first deliberate press means "watch this", so it comes with sound.
    // After that the sound stays wherever the viewer left it.
    if (!started.current) video.muted = false;
    if (video.ended) video.currentTime = 0;
    video.play().catch(() => {
      if (!started.current) setPhase("idle");
    });
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    userPaused.current = true;
    video.pause();
  }, []);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) play();
    else pause();
  }, [play, pause]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 1;
  }, []);

  const seekTo = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;
      const total = durationRef.current || video.duration || 0;
      video.currentTime = Math.min(Math.max(0, time), Math.max(0, total - 0.05));
      paint();
    },
    [paint],
  );

  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current as FullscreenElement | null;
    const video = videoRef.current as InlineVideo | null;
    const doc = document as FullscreenDocument;
    if (!root || !video) return;

    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
      else doc.webkitExitFullscreen?.();
      return;
    }
    // The whole frame, so the controls come along; failing that, the video
    // alone in the system player.
    if (root.requestFullscreen && document.fullscreenEnabled) {
      root.requestFullscreen().catch(() => {});
    } else if (root.webkitRequestFullscreen) {
      root.webkitRequestFullscreen();
    } else {
      video.webkitEnterFullscreen?.();
    }
  }, []);

  /* Media events are the single source of truth for what the player shows. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React does not reliably write `muted` as an attribute, and autoplay
    // policies read the element's state when play() is called.
    video.muted = true;
    video.defaultMuted = true;

    let raf = 0;
    const loop = () => {
      paint();
      raf = requestAnimationFrame(loop);
    };

    const onPlaying = () => {
      started.current = true;
      setPhase("playing");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const onPause = () => {
      cancelAnimationFrame(raf);
      paint();
      if (video.ended) return;
      if (pageIsPausing.current || document.hidden) {
        pageIsPausing.current = false;
        setPhase("suspended");
        return;
      }
      setPhase("paused");
      setControls(true);
      window.clearTimeout(hideTimer.current);
    };
    const onEnded = () => {
      cancelAnimationFrame(raf);
      paint();
      // Treated as the viewer's stop: scrubbing back into a finished film and
      // scrolling past should not set it running again on its own.
      userPaused.current = true;
      setPhase("ended");
      // The bar steps aside for the end card; keep keyboard focus in play.
      const root = rootRef.current;
      if (root?.contains(document.activeElement) && isKeyboardFocus(document.activeElement)) {
        requestAnimationFrame(() => replayRef.current?.focus());
      }
      window.clearTimeout(hideTimer.current);
      setControls(false);
    };
    const onVolume = () => setMuted(video.muted);
    const onMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
        setDuration(video.duration);
      }
    };
    const onSeeked = () => {
      paint();
      // Seeking back from the last frame leaves "ended" without any event
      // saying so.
      if (phaseRef.current === "ended" && !video.ended) {
        setPhase("paused");
        setControls(true);
      }
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("volumechange", onVolume);
    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("seeked", onSeeked);
    if (video.readyState >= 1) onMetadata();

    // Only the last source's failure means nothing will play.
    const sources = video.querySelectorAll("source");
    const lastSource = sources[sources.length - 1];
    const onSourceError = () => setPhase("error");
    lastSource?.addEventListener("error", onSourceError);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("volumechange", onVolume);
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("seeked", onSeeked);
      lastSource?.removeEventListener("error", onSourceError);
    };
  }, [paint]);

  /* Starts when enough of it is on screen, stops when none of it is, and picks
     up again on the way back unless the viewer paused it themselves. */
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setPhase((current) => (current === "loading" ? "idle" : current));

    // Buffer a screen ahead, so the opening line is ready the moment it arrives.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        video.preload = "auto";
        near.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(root);

    const view = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= PLAY_THRESHOLD) {
          if (reduced || userPaused.current || video.ended || !video.paused) return;
          video.play().catch(() => {
            if (!started.current) setPhase("idle");
          });
        } else if (!entry.isIntersecting && !video.paused) {
          pageIsPausing.current = true;
          video.pause();
        }
      },
      { threshold: [0, PLAY_THRESHOLD] },
    );
    view.observe(root);

    return () => {
      near.disconnect();
      view.disconnect();
    };
  }, []);

  useEffect(() => {
    const doc = document as FullscreenDocument;
    const onChange = () => {
      const element = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setFullscreen(element !== null && element === rootRef.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  /* The slider's spoken value belongs to paint(), not to render — a re-render
     writing it from props would snap it back to 0:00 mid-film. Rewritten here
     whenever its wording or the length changes. */
  useEffect(() => {
    lastSecond.current = -1;
    paint();
  }, [duration, t, paint]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  /** Runs a control, then lets the bar sink after the usual delay. */
  const act = (fn: () => void) => () => {
    fn();
    reveal(lastPointer.current === "mouse" ? HIDE_AFTER_MS : HIDE_AFTER_TOUCH_MS);
  };

  const onUnmuteChip = () => {
    const fromKeyboard = isKeyboardFocus(document.activeElement);
    toggleMute();
    // The pill leaves once there is sound; keep keyboard focus on the bar's
    // sound control, which is where the same switch lives.
    if (fromKeyboard) requestAnimationFrame(() => soundTileRef.current?.focus());
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    lastPointer.current = e.pointerType;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") reveal(HIDE_AFTER_MS);
  };

  const onPointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (e.pointerType !== "mouse" || !video || video.paused || scrubbingRef.current) return;
    window.clearTimeout(hideTimer.current);
    setControls(false);
  };

  const onFrameClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, [role='slider']")) return;
    const video = videoRef.current;
    if (!video || phase === "error") return;

    if (lastPointer.current === "mouse") {
      toggle();
      reveal(HIDE_AFTER_MS);
      return;
    }
    if (video.paused) {
      play();
      reveal(HIDE_AFTER_TOUCH_MS);
    } else if (controls) {
      window.clearTimeout(hideTimer.current);
      setControls(false);
    } else {
      reveal(HIDE_AFTER_TOUCH_MS);
    }
  };

  const onBigPlay = () => {
    const fromKeyboard = isKeyboardFocus(document.activeElement);
    play();
    reveal(HIDE_AFTER_MS);
    // The round button disappears once the film runs; hand keyboard focus to
    // the bar's own play control rather than dropping it on the page.
    if (fromKeyboard) requestAnimationFrame(() => barToggleRef.current?.focus());
  };

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (!isKeyboardFocus(e.target as HTMLElement)) return;
    window.clearTimeout(hideTimer.current);
    setControls(true);
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    const video = videoRef.current;
    if (video && !video.paused) reveal(HIDE_AFTER_MS);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || phase === "error") return;
    const target = e.target as HTMLElement;
    const onSlider = target.getAttribute("role") === "slider";
    const video = videoRef.current;
    if (!video) return;

    switch (e.key) {
      case " ":
        // A focused button already answers Space with its own click.
        if (target.tagName === "BUTTON") return;
        toggle();
        break;
      case "k":
      case "K":
        toggle();
        break;
      case "m":
      case "M":
        toggleMute();
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      case "ArrowLeft":
        seekTo(video.currentTime - SEEK_STEP);
        break;
      case "ArrowRight":
        seekTo(video.currentTime + SEEK_STEP);
        break;
      case "PageDown":
        if (!onSlider) return;
        seekTo(video.currentTime - PAGE_STEP);
        break;
      case "PageUp":
        if (!onSlider) return;
        seekTo(video.currentTime + PAGE_STEP);
        break;
      case "Home":
        if (!onSlider) return;
        seekTo(0);
        break;
      case "End":
        if (!onSlider) return;
        seekTo(durationRef.current);
        break;
      default:
        return;
    }
    e.preventDefault();
    reveal(HIDE_AFTER_MS);
  };

  const scrubFrom = (clientX: number) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    seekTo(ratio * (durationRef.current || videoRef.current?.duration || 0));
  };

  const onScrubDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubbingRef.current = true;
    setScrubbing(true);
    window.clearTimeout(hideTimer.current);
    setControls(true);
    scrubFrom(e.clientX);
  };

  const onScrubMove = (e: PointerEvent<HTMLDivElement>) => {
    if (scrubbingRef.current) scrubFrom(e.clientX);
  };

  const onScrubEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (!scrubbingRef.current) return;
    scrubbingRef.current = false;
    setScrubbing(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    reveal(e.pointerType === "mouse" ? HIDE_AFTER_MS : HIDE_AFTER_TOUCH_MS);
  };

  const onReplay = () => {
    const fromKeyboard = isKeyboardFocus(document.activeElement);
    play();
    reveal(lastPointer.current === "mouse" ? HIDE_AFTER_MS : HIDE_AFTER_TOUCH_MS);
    if (fromKeyboard) requestAnimationFrame(() => barToggleRef.current?.focus());
  };

  const playing = phase === "playing" || phase === "suspended";

  return (
    <div
      ref={rootRef}
      className={`${styles.player} ${className}`.trim()}
      role="group"
      aria-label={title}
      data-phase={phase}
      data-controls={controls}
      data-muted={muted}
      data-scrubbing={scrubbing}
      data-fullscreen={fullscreen}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onFrameClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <video
        ref={videoRef}
        className={`${styles.video} scale-out`}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        aria-label={title}
        aria-describedby={descriptionId}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
      <p id={descriptionId} className="sr-only">
        {description}
      </p>

      <button
        type="button"
        className={styles.bigPlay}
        onClick={onBigPlay}
        aria-label={t("film.play")}
        title={t("film.play")}
      >
        <IconPlay className={styles.bigIconPlay} />
      </button>

      {/* The film signs off on the Namu mark. A round button in the middle
          would sit right on top of it, so the way back in is a pill below. */}
      <button ref={replayRef} type="button" className={styles.replay} onClick={onReplay}>
        <IconReplay />
        <span>{t("film.replay")}</span>
      </button>

      <button type="button" className={styles.chip} onClick={onUnmuteChip}>
        <IconSoundOff />
        <span>{t("film.unmute")}</span>
      </button>

      <div className={styles.bar}>
        <button
          ref={barToggleRef}
          type="button"
          className={styles.tile}
          onClick={act(toggle)}
          aria-label={playing ? t("film.pause") : t("film.play")}
          title={playing ? t("film.pause") : t("film.play")}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </button>

        <span ref={currentRef} className={styles.time}>
          0:00
        </span>

        <div
          ref={sliderRef}
          className={styles.scrub}
          role="slider"
          tabIndex={0}
          aria-label={t("film.progress")}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          onPointerDown={onScrubDown}
          onPointerMove={onScrubMove}
          onPointerUp={onScrubEnd}
          onPointerCancel={onScrubEnd}
        >
          <span className={styles.scrubRail} aria-hidden="true" />
          <span className={styles.scrubFill} aria-hidden="true" />
          <span className={styles.scrubHead} aria-hidden="true">
            <span className={styles.scrubThumb} />
          </span>
        </div>

        <span className={`${styles.time} ${styles.timeTotal}`}>{formatTime(duration)}</span>

        <button
          ref={soundTileRef}
          type="button"
          className={styles.tile}
          onClick={act(toggleMute)}
          aria-label={muted ? t("film.unmute") : t("film.mute")}
          title={muted ? t("film.unmute") : t("film.mute")}
        >
          {muted ? <IconSoundOff /> : <IconSoundOn />}
        </button>

        <button
          type="button"
          className={styles.tile}
          onClick={act(toggleFullscreen)}
          aria-label={fullscreen ? t("film.exitFullscreen") : t("film.fullscreen")}
          title={fullscreen ? t("film.exitFullscreen") : t("film.fullscreen")}
        >
          {fullscreen ? <IconFullscreenExit /> : <IconFullscreen />}
        </button>
      </div>
    </div>
  );
}
