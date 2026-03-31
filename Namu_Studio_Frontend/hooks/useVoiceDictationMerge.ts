"use client";

import { useCallback, useEffect, useRef } from "react";

type Voice = ReturnType<typeof import("@/hooks/useVoice").useVoice>;

/**
 * Merges Web Speech output into the text field while keeping any text that was present when dictation started.
 */
export function useVoiceDictationMerge(voice: Voice, value: string, setValue: (next: string) => void): {
  beginTapDictation: () => void;
  beginHoldDictation: () => void;
} {
  const baseRef = useRef("");

  const beginTapDictation = useCallback(() => {
    baseRef.current = value;
    voice.start();
  }, [value, voice]);

  const beginHoldDictation = useCallback(() => {
    baseRef.current = value;
    voice.startHold();
  }, [value, voice]);

  useEffect(() => {
    if (!voice.recording && !voice.processing) return;
    const merged = [baseRef.current, voice.displayTranscript].filter(Boolean).join(" ").trim();
    setValue(merged);
  }, [voice.displayTranscript, voice.recording, voice.processing, setValue]);

  return { beginTapDictation, beginHoldDictation };
}
