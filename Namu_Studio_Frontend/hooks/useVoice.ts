"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "@/lib/i18n/useTranslation";

type SpeechRecognitionAlternativeLike = { transcript: string };
type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export function useVoice() {
  const { language } = useTranslation();
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const holdRef = useRef(false);

  useEffect(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    setSupported(Boolean(Recognition));
  }, []);

  useEffect(() => {
    if (!recording) return;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [recording]);

  const stopRecognition = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const reset = useCallback((): void => {
    holdRef.current = false;
    stopRecognition();
    setRecording(false);
    setProcessing(false);
    setSeconds(0);
    setTranscript("");
    setInterimTranscript("");
  }, [stopRecognition]);

  const stop = useCallback((): void => {
    holdRef.current = false;
    if (!recording) return;
    setRecording(false);
    setProcessing(true);
    stopRecognition();
  }, [recording, stopRecognition]);

  const stopHold = useCallback((): void => {
    holdRef.current = false;
    stopRecognition();
    setRecording(false);
    setProcessing(false);
    setInterimTranscript("");
  }, [stopRecognition]);

  const start = useCallback((): void => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setSupported(false);
      return;
    }

    holdRef.current = false;
    reset();
    const recognition = new Recognition() as SpeechRecognitionLike;
    recognition.lang = language === "ha" ? "ha" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setRecording(true);
      setProcessing(false);
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript((current) => `${current} ${finalText}`.trim());
      }
      setInterimTranscript(interimText.trim());
    };

    recognition.onerror = () => {
      setRecording(false);
      setProcessing(false);
    };

    recognition.onend = () => {
      setRecording(false);
      setProcessing(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, reset]);

  const startHold = useCallback((): void => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setSupported(false);
      return;
    }

    holdRef.current = true;
    reset();
    const recognition = new Recognition() as SpeechRecognitionLike;
    recognition.lang = language === "ha" ? "ha" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setRecording(true);
      setProcessing(false);
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript((current) => `${current} ${finalText}`.trim());
      }
      setInterimTranscript(interimText.trim());
    };

    recognition.onerror = () => {
      holdRef.current = false;
      setRecording(false);
      setProcessing(false);
    };

    recognition.onend = () => {
      if (holdRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          holdRef.current = false;
          setRecording(false);
          setProcessing(false);
          setInterimTranscript("");
        }
      } else {
        setRecording(false);
        setProcessing(false);
        setInterimTranscript("");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, reset]);

  useEffect(() => stopRecognition, [stopRecognition]);

  const displayTranscript = useMemo(
    () => [transcript, interimTranscript].filter(Boolean).join(" ").trim(),
    [interimTranscript, transcript]
  );

  return {
    recording,
    processing,
    seconds,
    transcript,
    interimTranscript,
    displayTranscript,
    supported,
    start,
    startHold,
    stop,
    stopHold,
    reset,
    setTranscript
  };
}
