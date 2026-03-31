"use client";

import { useEffect, useState } from "react";

export function usePreviewMediaStream(deviceId: string | null, enabled: boolean): MediaStream | null {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStream(null);
      return;
    }

    let cancelled = false;
    let active: MediaStream | null = null;

    const constraints: MediaStreamConstraints = {
      audio: deviceId ? { deviceId: { exact: deviceId } } : true
    };

    void navigator.mediaDevices.getUserMedia(constraints).then((media) => {
      if (cancelled) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      active = media;
      setStream(media);
    }).catch(() => {
      if (!cancelled) setStream(null);
    });

    return () => {
      cancelled = true;
      active?.getTracks().forEach((t) => t.stop());
      setStream(null);
    };
  }, [deviceId, enabled]);

  return stream;
}

export function useAudioLevel(stream: MediaStream | null): number {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      return;
    }

    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;

    const tick = (): void => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) {
        sum += data[i];
      }
      const avg = sum / data.length / 255;
      setLevel(Math.min(1, avg * 2.8));
      raf = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.cancelAnimationFrame(raf);
      void ctx.close();
    };
  }, [stream]);

  return level;
}
