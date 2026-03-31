"use client";

import { ChevronDown, Copy, Download, Plus, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { streamCreateResponse } from "@/lib/ai/aiService";
import { CreateCanvas } from "@/components/modes/create/CreateCanvas";
import { TemplateCard } from "@/components/modes/create/TemplateCard";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { useAuth } from "@/hooks/useAuth";
import { MicWithSettings } from "@/components/modes/chat/MicWithSettings";
import { useVoice } from "@/hooks/useVoice";
import { useVoiceDictationMerge } from "@/hooks/useVoiceDictationMerge";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { saveCreateOutput } from "@/lib/studio/createService";
import { touchSession } from "@/lib/studio/sessionService";
import { augmentPromptWithFiles } from "@/lib/utils/promptAttachments";

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
  const promptFileRef = useRef<HTMLInputElement>(null);
  const [promptFiles, setPromptFiles] = useState<File[]>([]);
  const outputRef = useRef("");
  const voice = useVoice();
  const promptValue = useMemo(() => (activeSession ? activeSession.createPrompt : draftInput), [activeSession, draftInput]);
  const outputValue = activeSession?.createOutput ?? "";

  const updatePrompt = useCallback(
    (next: string): void => {
      if (activeSession) {
        setCreatePrompt(next);
        return;
      }
      setDraftInput(next);
    },
    [activeSession, setCreatePrompt, setDraftInput]
  );

  const { beginTapDictation, beginHoldDictation } = useVoiceDictationMerge(voice, promptValue, updatePrompt);

  useEffect(() => {
    setWordCount(outputValue.trim().split(/\s+/).filter(Boolean).length);
    outputRef.current = outputValue;
  }, [outputValue]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const addPromptFiles = (list: FileList | File[]): void => {
    const next = Array.from(list);
    const merged = [...promptFiles];
    const max = 8;
    const maxBytes = 12 * 1024 * 1024;
    for (const file of next) {
      if (file.size > maxBytes) {
        pushToast({ title: t("workspace.fileTooLarge"), description: file.name, type: "warning" });
        continue;
      }
      if (merged.length >= max) {
        pushToast({ title: t("workspace.tooManyFiles"), description: String(max), type: "warning" });
        break;
      }
      merged.push(file);
    }
    setPromptFiles(merged);
    if (promptFileRef.current) {
      promptFileRef.current.value = "";
    }
  };

  const generate = async (): Promise<void> => {
    const basePrompt = await augmentPromptWithFiles(promptValue.trim(), promptFiles);
    if (!basePrompt.trim() || !user?.id) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setProcessing(true);
    outputRef.current = "";
    setCreateOutput("");

    const sessionId = activeSession?.id ?? (await startSession(basePrompt.slice(0, 120), "create"));
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
        setPromptFiles([]);
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
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-text-primary">{t("workspace.prompt")}</div>
              <div className="flex items-center gap-2">
                <MicWithSettings
                  voice={voice}
                  supported={voice.supported}
                  onTapDictation={beginTapDictation}
                  onBeginHoldDictation={beginHoldDictation}
                />
                <button
                  type="button"
                  onClick={() => promptFileRef.current?.click()}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition"
                  style={{
                    borderColor: "var(--input-border)",
                    background: "var(--bg-panel)",
                    color: "var(--text-secondary)"
                  }}
                  aria-label={t("workspace.attachFiles")}
                >
                  <Plus className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </button>
                <input
                  ref={promptFileRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.txt,.md,.csv,.json,application/pdf"
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files?.length) {
                      addPromptFiles(files);
                    }
                  }}
                />
              </div>
            </div>

            {promptFiles.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {promptFiles.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-panel)",
                      color: "var(--text-secondary)"
                    }}
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setPromptFiles((prev) => prev.filter((_, i) => i !== index))}
                      className="rounded-full p-0.5 hover:bg-bg-active"
                      aria-label={t("workspace.removeAttachment")}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            <Textarea
              className="min-h-[220px] border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)]"
              value={promptValue}
              onChange={(event) => updatePrompt(event.target.value)}
              placeholder={t("workspace.createPlaceholder")}
            />
            <div className="mt-3 text-xs text-text-muted">
              {!voice.supported ? t("workspace.unsupportedVoice") : t("workspace.hausaVoiceNote")}
            </div>
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
