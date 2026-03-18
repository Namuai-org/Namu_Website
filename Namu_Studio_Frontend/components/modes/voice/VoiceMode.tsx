"use client";

import { useEffect, useRef, useState } from "react";

import { streamChatResponse } from "@/lib/ai/aiService";
import { Button } from "@/components/shared/Button";
import { VoiceControls } from "@/components/modes/voice/VoiceControls";
import { VoiceTranscript } from "@/components/modes/voice/VoiceTranscript";
import { VoiceWaveform } from "@/components/modes/voice/VoiceWaveform";
import { useAuth } from "@/hooks/useAuth";
import { useVoice } from "@/hooks/useVoice";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { saveMessage } from "@/lib/studio/messageService";
import { touchSession } from "@/lib/studio/sessionService";

export function VoiceMode(): JSX.Element {
  const voice = useVoice();
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    activeSession,
    startSession,
    setVoice,
    setProcessing,
    pushToast,
    activeSessionId
  } = useStudio();
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const finalTranscript = voice.transcript.trim();
    if (!finalTranscript || voice.recording || voice.processing || !user?.id) return;

    const run = async (): Promise<void> => {
      const sessionId = activeSessionId ?? (await startSession(finalTranscript, "voice"));
      if (!sessionId) return;

      setProcessing(true);
      setStreaming(true);
      setResponse("");
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      await saveMessage(sessionId, user.id, "user", finalTranscript);

      await streamChatResponse(
        [{ role: "user", content: finalTranscript }],
        (token) => setResponse((current) => `${current}${token}`),
        async (fullText) => {
          setStreaming(false);
          setProcessing(false);
          setVoice(finalTranscript, fullText);
          await saveMessage(sessionId, user.id, "assistant", fullText);
          await touchSession(sessionId);
        },
        (error) => {
          setStreaming(false);
          setProcessing(false);
          pushToast({ title: t("common.aiUnavailable"), description: error, type: "error" });
        },
        abortControllerRef.current.signal
      );
    };

    void run();
  }, [activeSessionId, pushToast, setProcessing, setVoice, startSession, t, user?.id, voice.processing, voice.recording, voice.transcript]);

  const handleToggle = (): void => {
    if (!voice.supported) return;
    if (voice.recording) {
      voice.stop();
      return;
    }
    setProcessing(true);
    voice.start();
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[680px] flex-col items-center px-4 py-8 md:px-6 md:py-10">
      {!voice.supported ? (
        <div className="mt-10 w-full rounded-2xl border border-border bg-bg-elevated p-6 text-center">
          <p className="text-base text-text-primary">{t("workspace.unsupportedVoice")}</p>
        </div>
      ) : null}
      {voice.recording ? (
        <div className="mb-4 text-base text-text-primary">
          {t("workspace.recording")} · 0:{voice.seconds.toString().padStart(2, "0")}
        </div>
      ) : null}
      <VoiceControls recording={voice.recording} onToggle={handleToggle} />
      <VoiceWaveform active={voice.recording} />
      <p className="mt-4 text-sm text-text-secondary">{t("workspace.hausaVoiceNote")}</p>
      {voice.processing ? <div className="mt-8 text-sm text-text-secondary">{t("workspace.transcribing")}</div> : null}
      {voice.displayTranscript ? (
        <div className="mt-8 w-full space-y-4">
          <VoiceTranscript label={t("workspace.whatYouSaid")} content={voice.displayTranscript} streaming={voice.recording} />
          <VoiceTranscript label={t("workspace.aiResponse")} content={response || activeSession?.voiceResponse || ""} streaming={streaming} />
          <Button variant="outlineOrange" size="lg" onClick={voice.reset}>
            {t("workspace.askMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
