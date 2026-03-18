"use client";

import { ChevronDown, Copy, Download, Mic, Sparkles, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { streamCreateResponse } from "@/lib/ai/aiService";
import { CreateCanvas } from "@/components/modes/create/CreateCanvas";
import { TemplateCard } from "@/components/modes/create/TemplateCard";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { useAuth } from "@/hooks/useAuth";
import { useVoice } from "@/hooks/useVoice";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { saveCreateOutput } from "@/lib/studio/createService";
import { touchSession } from "@/lib/studio/sessionService";

const templates = ["Wasiƙa", "Shirin aiki", "CV / Résumé", "Post na social media", "Rahoto", "Imel"];

export function CreateMode(): JSX.Element {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    activeSession,
    draftInput,
    setDraftInput,
    setCreatePrompt,
    setCreateOutput,
    startSession,
    setProcessing,
    pushToast,
    createOptionsOpen,
    setCreateOptionsOpen
  } = useStudio();
  const [tone, setTone] = useState(t("workspace.professional"));
  const [length, setLength] = useState(t("workspace.medium"));
  const [wordCount, setWordCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const outputRef = useRef("");
  const voice = useVoice();

  const promptValue = useMemo(() => (activeSession ? activeSession.createPrompt : draftInput), [activeSession, draftInput]);
  const outputValue = activeSession?.createOutput ?? "";

  useEffect(() => {
    if (!voice) return;
    if (!voice.transcript) return;
    if (activeSession) {
      setCreatePrompt(voice.transcript);
    } else {
      setDraftInput(voice.transcript);
    }
  }, [activeSession, setCreatePrompt, setDraftInput, voice]);

  useEffect(() => {
    setWordCount(outputValue.trim().split(/\s+/).filter(Boolean).length);
    outputRef.current = outputValue;
  }, [outputValue]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const updatePrompt = (value: string): void => {
    if (activeSession) {
      setCreatePrompt(value);
      return;
    }
    setDraftInput(value);
  };

  const generate = async (): Promise<void> => {
    const basePrompt = promptValue.trim();
    if (!basePrompt || !user?.id) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setProcessing(true);
    outputRef.current = "";
    setCreateOutput("");

    const sessionId = activeSession?.id ?? (await startSession(basePrompt, "create"));
    if (!sessionId) {
      setProcessing(false);
      pushToast({ title: t("common.somethingWrong"), description: t("toasts.sessionLoadFailed"), type: "error" });
      return;
    }

    await streamCreateResponse(
      basePrompt,
      tone,
      length,
      (token) => {
        const nextOutput = `${outputRef.current}${token}`;
        outputRef.current = nextOutput;
        setCreateOutput(nextOutput);
        setWordCount(nextOutput.trim().split(/\s+/).filter(Boolean).length);
      },
      async (fullText) => {
        setCreateOutput(fullText);
        setWordCount(fullText.trim().split(/\s+/).filter(Boolean).length);
        setProcessing(false);
        await saveCreateOutput(sessionId, user.id, basePrompt, fullText, { tone, length });
        await touchSession(sessionId);
      },
      (error) => {
        setProcessing(false);
        pushToast({ title: t("common.aiUnavailable"), description: error, type: "error" });
      },
      abortControllerRef.current.signal
    );
  };

  return (
    <div className="grid h-full min-h-0 md:grid-cols-[40%_60%]">
      <div className="min-h-0 overflow-y-auto border-r border-bg-elevated bg-bg-panel p-4 md:p-6">
        <div className="mx-auto flex w-full max-w-[520px] flex-col">
          <h2 className="text-[18px] font-semibold text-text-primary">{t("workspace.createTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{t("workspace.createSubtitle")}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <TemplateCard key={template} label={template} onClick={() => updatePrompt(template)} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-bg-elevated p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-text-primary">{t("workspace.prompt")}</div>
              {voice ? (
                <button
                  type="button"
                  onClick={() => (voice.recording ? voice.stop() : voice.start())}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-xs transition"
                  style={{
                    borderColor: voice.recording ? "var(--orange)" : "var(--input-border)",
                    background: voice.recording ? "var(--orange-subtle)" : "var(--bg-panel)",
                    color: voice.recording ? "var(--orange)" : "var(--text-secondary)"
                  }}
                >
                  {voice.recording ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  {voice.recording ? `${t("workspace.stop")} 0:${voice.seconds.toString().padStart(2, "0")}` : t("workspace.voiceIdle")}
                </button>
              ) : null}
            </div>

            <Textarea
              className="min-h-[220px] border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)]"
              value={promptValue}
              onChange={(event) => updatePrompt(event.target.value)}
              placeholder={t("workspace.createPlaceholder")}
            />
            {voice ? (
              <div className="mt-3 text-xs text-text-muted">
                {!voice.supported ? t("workspace.unsupportedVoice") : t("workspace.hausaVoiceNote")}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setCreateOptionsOpen(!createOptionsOpen)}
            className="mt-5 flex h-11 items-center justify-between rounded-xl border border-border bg-bg-elevated px-4 text-sm text-text-primary md:hidden"
          >
            Options
            <ChevronDown className={`h-4 w-4 transition ${createOptionsOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`${createOptionsOpen ? "block" : "hidden"} md:block`}>
            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-text-secondary">
                {t("workspace.tone")}
              </div>
              <div className="flex flex-wrap gap-2">
                {[t("workspace.professional"), t("workspace.friendly"), t("workspace.casual"), t("workspace.formal")].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTone(item)}
                    className={`min-h-11 rounded-full border px-3 py-1.5 text-xs ${
                      tone === item
                        ? "border-brand-orange/30 bg-brand-orange/10 text-brand-orange"
                        : "border-border bg-bg-elevated text-text-secondary"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-text-secondary">
                {t("workspace.length")}
              </div>
              <div className="flex flex-wrap gap-2">
                {[t("workspace.short"), t("workspace.medium"), t("workspace.long")].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLength(item)}
                    className={`min-h-11 rounded-full border px-3 py-1.5 text-xs ${
                      length === item
                        ? "border-brand-orange/30 bg-brand-orange/10 text-brand-orange"
                        : "border-border bg-bg-elevated text-text-secondary"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button className="mt-6 w-full" size="lg" onClick={() => void generate()}>
            <Sparkles className="h-4 w-4" />
            {t("workspace.generate")}
          </Button>
        </div>
      </div>

      <CreateCanvas
        output={outputValue}
        wordCount={wordCount}
        actions={
          <div className="flex gap-2">
            <Button variant="dark" size="sm" onClick={() => navigator.clipboard.writeText(outputValue)} disabled={!outputValue}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="dark" size="sm" disabled={!outputValue}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        }
      />
    </div>
  );
}
