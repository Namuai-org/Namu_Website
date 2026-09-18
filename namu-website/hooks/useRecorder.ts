"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "recording" | "denied";

/**
 * How loud the microphone is right now, 0–1.
 *
 * A plain object rather than state: the 3D park reads this sixty times a
 * second to drive the sound rings and the stepping stones, and a re-render per
 * frame would cost far more than the reading is worth. There is one
 * microphone, so there is one reading.
 */
export const micLevel = { value: 0 };

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
  const audioRef = useRef<{ context: AudioContext; frame: number } | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  /** Follows the stream's loudness while it records, and nothing else. */
  const listen = (stream: MediaStream) => {
    try {
      const context = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      // The context is built after an await, so the gesture that started the
      // recording may no longer be counted: without this it stays suspended
      // and every reading is silence.
      void context.resume().catch(() => {});
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.7;
      context.createMediaStreamSource(stream).connect(analyser);

      const samples = new Uint8Array(analyser.frequencyBinCount);
      const read = () => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
          const v = (samples[i] - 128) / 128;
          sum += v * v;
        }
        // Speech sits low in a linear reading, so lift it into a usable range.
        const rms = Math.sqrt(sum / samples.length);
        micLevel.value = Math.min(1, Math.pow(rms * 3.4, 0.7));
        audioRef.current = { context, frame: requestAnimationFrame(read) };
      };
      audioRef.current = { context, frame: requestAnimationFrame(read) };
    } catch {
      /* No analyser is not a reason to refuse a recording. */
    }
  };

  const stopListening = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    micLevel.value = 0;
    if (!audio) return;
    cancelAnimationFrame(audio.frame);
    audio.context.close().catch(() => {});
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
        stopListening();
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        resolveRef.current?.(blob.size > 0 ? blob : null);
        resolveRef.current = null;
      };

      recorder.start();
      listen(stream);
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
    if (!recorder || recorder.state === "inactive") {
      stopListening();
      return Promise.resolve(null);
    }

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
      stopListening();
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
