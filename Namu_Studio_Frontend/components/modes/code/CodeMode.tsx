"use client";

import { ArrowRight, Mic, Sparkles, Square } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { streamCodeResponse } from "@/lib/ai/aiService";
import { CodeEditor } from "@/components/modes/code/CodeEditor";
import { CodeToolbar } from "@/components/modes/code/CodeToolbar";
import { LivePreview } from "@/components/modes/code/LivePreview";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { upsertCodeFile } from "@/lib/studio/codeService";
import { useCodeStore } from "@/lib/studio/codeStore";
import { useVoice } from "@/hooks/useVoice";
import type { CodeFile } from "@/types";

export function CodeMode(): JSX.Element {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    activeSession,
    draftInput,
    setDraftInput,
    setCodePrompt,
    startSession,
    setFiles,
    setProcessing,
    markSaved,
    pushToast,
    mobileCodeTab,
    setMobileCodeTab
  } = useStudio();
  const { activeFileId, setActiveFileId } = useCodeStore();
  const voice = useVoice();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamBufferRef = useRef("");
  const files = activeSession?.files ?? [];
  const promptValue = activeSession?.codePrompt ?? draftInput;
  const activeFile = useMemo(() => files.find((file) => file.id === activeFileId) ?? files[0], [activeFileId, files]);

  useEffect(() => {
    if (!voice.transcript) return;
    if (activeSession) {
      setCodePrompt(voice.transcript);
    } else {
      setDraftInput(voice.transcript);
    }
  }, [activeSession, setCodePrompt, setDraftInput, voice.transcript]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  const sanitizeFiles = (content: string): CodeFile[] => {
    const clean = content.replace(/^```[a-z]*\s*/i, "").replace(/```$/i, "");
    return [
      { id: "html", name: "index.html", language: "html", content: clean || "<div>Hello Namu</div>" },
      { id: "css", name: "styles.css", language: "css", content: "body {\n  font-family: sans-serif;\n}" },
      { id: "js", name: "script.js", language: "javascript", content: "console.log('ready');" }
    ];
  };

  const run = async (): Promise<void> => {
    const prompt = promptValue.trim();
    if (!prompt || !user?.id) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setProcessing(true);
    streamBufferRef.current = "";

    const sessionId = activeSession?.id ?? (await startSession(prompt, "code"));
    if (!sessionId) {
      setProcessing(false);
      pushToast({ title: t("common.somethingWrong"), description: t("toasts.sessionLoadFailed"), type: "error" });
      return;
    }

    await streamCodeResponse(
      prompt,
      activeFile?.content ?? "",
      activeFile?.language ?? "html",
      (token) => {
        streamBufferRef.current += token;
        const nextFiles = sanitizeFiles(streamBufferRef.current);
        setFiles(nextFiles);
        setActiveFileId(nextFiles[0]?.id ?? "html");
      },
      async (fullText) => {
        const nextFiles = sanitizeFiles(fullText);
        setFiles(nextFiles);
        setProcessing(false);
        markSaved(t("workspace.saved"));
      },
      (error) => {
        setProcessing(false);
        pushToast({ title: t("common.aiUnavailable"), description: error, type: "error" });
      },
      abortControllerRef.current.signal
    );
  };

  const handleEditorChange = (value: string): void => {
    if (!activeFile || !user?.id || !activeSession?.projectId) return;
    setFiles(files.map((file) => (file.id === activeFile.id ? { ...file, content: value } : file)));

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(async () => {
      const { error } = await upsertCodeFile(activeSession.projectId!, user.id, activeFile.name, activeFile.language, value);
      if (error) {
        pushToast({ title: t("toasts.saveFailed"), description: t("toasts.saveFailed"), type: "warning" });
        return;
      }
      markSaved(t("workspace.saved"));
    }, 2000);
  };

  const tabs = [
    { id: "prompt" as const, label: t("workspace.prompt") },
    { id: "code" as const, label: "Code" },
    { id: "preview" as const, label: t("workspace.preview") }
  ];

  return (
    <div className="grid h-full min-h-0 md:grid-cols-[180px_1fr_360px]">
      <div className="hidden border-r border-bg-elevated bg-bg-panel md:block">
        <div className="border-b border-bg-elevated px-4 py-3 text-xs uppercase tracking-[0.08em] text-text-muted">
          {t("workspace.explorer")}
        </div>
        <div className="px-3 py-3 text-sm text-text-secondary">
          <div className="mb-3 font-medium text-text-primary">namu-project</div>
          <div className="space-y-1">
            {files.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => setActiveFileId(file.id)}
                className={`block w-full rounded px-2 py-1 text-left ${
                  activeFileId === file.id ? "border-l-2 border-brand-orange bg-bg-active text-text-primary" : ""
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>
          <button type="button" className="mt-4 text-sm text-brand-orange">
            + {t("workspace.newFile")}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="flex gap-2 border-b border-bg-elevated p-2 md:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileCodeTab(tab.id)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm ${mobileCodeTab === tab.id ? "bg-brand-orange/10 text-brand-orange" : "text-text-secondary"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <CodeToolbar files={files} />
        </div>

        <div className="min-h-0 flex-1 bg-bg-base">
          <div className={`${mobileCodeTab === "code" ? "block" : "hidden"} h-full md:block`}>
            {activeFile ? (
              <CodeEditor file={activeFile} onChange={handleEditorChange} />
            ) : (
              <div className="grid h-full place-items-center text-sm text-text-secondary">{t("workspace.focusCode")}</div>
            )}
          </div>

          <div className={`${mobileCodeTab === "preview" ? "block" : "hidden"} h-full md:hidden`}>
            <LivePreview files={files} />
          </div>

          <div className={`${mobileCodeTab === "prompt" ? "flex" : "hidden"} h-full flex-col md:hidden`}>
            <div className="flex h-[52px] items-center gap-3 border-t border-bg-elevated px-4" style={{ background: "var(--actbar-bg)" }}>
              <Sparkles className="h-4 w-4 text-brand-orange" />
              <button
                type="button"
                onClick={() => (voice.recording ? voice.stop() : voice.start())}
                className="grid h-12 w-12 place-items-center rounded-lg border transition"
                style={{
                  borderColor: voice.recording ? "var(--orange)" : "var(--input-border)",
                  background: voice.recording ? "var(--orange-subtle)" : "var(--bg-elevated)",
                  color: voice.recording ? "var(--orange)" : "var(--text-secondary)"
                }}
                aria-label={voice.recording ? t("workspace.stop") : t("workspace.voiceIdle")}
              >
                {voice.recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <input
                value={promptValue}
                onChange={(event) => (activeSession ? setCodePrompt(event.target.value) : setDraftInput(event.target.value))}
                placeholder={t("workspace.codePlaceholder")}
                className="h-12 flex-1 rounded-md border px-3 text-sm outline-none"
                style={{ borderColor: "var(--input-border)", background: "var(--input-bg)", color: "var(--input-text)" }}
              />
              <button
                type="button"
                onClick={() => void run()}
                className={`grid h-12 w-12 place-items-center rounded-lg ${promptValue.trim() ? "bg-brand-orange text-white" : "bg-bg-elevated text-text-muted"}`}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden h-[52px] items-center gap-3 border-t border-bg-elevated px-4 md:flex" style={{ background: "var(--actbar-bg)" }}>
          <Sparkles className="h-4 w-4 text-brand-orange" />
          <button
            type="button"
            onClick={() => (voice.recording ? voice.stop() : voice.start())}
            className="grid h-9 w-9 place-items-center rounded-lg border transition"
            style={{
              borderColor: voice.recording ? "var(--orange)" : "var(--input-border)",
              background: voice.recording ? "var(--orange-subtle)" : "var(--bg-elevated)",
              color: voice.recording ? "var(--orange)" : "var(--text-secondary)"
            }}
            aria-label={voice.recording ? t("workspace.stop") : t("workspace.voiceIdle")}
          >
            {voice.recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <input
            value={promptValue}
            onChange={(event) => (activeSession ? setCodePrompt(event.target.value) : setDraftInput(event.target.value))}
            placeholder={t("workspace.codePlaceholder")}
            className="h-9 flex-1 rounded-md border px-3 text-sm outline-none"
            style={{ borderColor: "var(--input-border)", background: "var(--input-bg)", color: "var(--input-text)" }}
          />
          <button
            type="button"
            onClick={() => void run()}
            className={`grid h-9 w-9 place-items-center rounded-lg ${promptValue.trim() ? "bg-brand-orange text-white" : "bg-bg-elevated text-text-muted"}`}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <LivePreview files={files} />
      </div>
    </div>
  );
}
