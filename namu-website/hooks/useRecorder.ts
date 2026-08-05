"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "recording" | "denied";

/**
 * Microphone capture for the playground console.
 *
 * Stops every track on the stream when recording ends — not just the recorder.
 * Leaving them live keeps the browser's recording indicator lit long after the
 * user thinks they have stopped, which reads as the page listening in.
 */
export function useRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resolveRef = useRef<((blob: Blob | null) => void) | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = useCallback(async () => {
    if (state === "recording") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        resolveRef.current?.(blob.size > 0 ? blob : null);
        resolveRef.current = null;
      };

      recorder.start();
      recorderRef.current = recorder;
      setState("recording");
      setSeconds(0);
      clearTimer();
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setState("denied");
    }
  }, [state]);

  /** Resolves with the captured audio, or null if nothing was captured. */
  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    clearTimer();
    setState("idle");
    if (!recorder || recorder.state === "inactive") return Promise.resolve(null);

    return new Promise<Blob | null>((resolve) => {
      resolveRef.current = resolve;
      recorder.stop();
      recorderRef.current = null;
    });
  }, []);

  // A component unmounting mid-recording must not leave the mic open.
  useEffect(
    () => () => {
      clearTimer();
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
    },
    [],
  );

  return { state, seconds, start, stop, recording: state === "recording" };
}

/** mm:ss, for the recording timer. */
export const formatClock = (total: number) =>
  `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
