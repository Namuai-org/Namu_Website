"use client";

import { ArrowRight, Plus, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { streamCodeResponse } from "@/lib/ai/aiService";
import { CodeEditor } from "@/components/modes/code/CodeEditor";
import { CodeToolbar } from "@/components/modes/code/CodeToolbar";
import { LivePreview } from "@/components/modes/code/LivePreview";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { upsertCodeFile } from "@/lib/studio/codeService";
import { augmentPromptWithFiles } from "@/lib/utils/promptAttachments";
import { useCodeStore } from "@/lib/studio/codeStore";
import { MicWithSettings } from "@/components/modes/chat/MicWithSettings";
import { useVoice } from "@/hooks/useVoice";
import { useVoiceDictationMerge } from "@/hooks/useVoiceDictationMerge";
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
  const promptFileRef = useRef<HTMLInputElement>(null);
  const [promptFiles, setPromptFiles] = useState<File[]>([]);
  const files = activeSession?.files ?? [];
  const promptValue = activeSession?.codePrompt ?? draftInput;
  const activeFile = useMemo(() => files.find((file) => file.id === activeFileId) ?? files[0], [activeFileId, files]);

  const setPromptValue = useCallback(
    (next: string): void => {
      if (activeSession) {
        setCodePrompt(next);
        return;
      }
      setDraftInput(next);
    },
    [activeSession, setCodePrompt, setDraftInput]
  );

  const { beginTapDictation, beginHoldDictation } = useVoiceDictationMerge(voice, promptValue, setPromptValue);

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

  const run = async (): Promise<void> => {
    const prompt = promptValue.trim();
    const augmented = await augmentPromptWithFiles(prompt, promptFiles);
    if (!augmented.trim() || !user?.id) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setProcessing(true);
    streamBufferRef.current = "";

    const sessionId = activeSession?.id ?? (await startSession(augmented.slice(0, 120), "code"));
    if (!sessionId) {
      setProcessing(false);
      pushToast({ title: t("common.somethingWrong"), description: t("toasts.sessionLoadFailed"), type: "error" });
      return;
    }

    await streamCodeResponse(
      augmented,
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
        setPromptFiles([]);
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
            {promptFiles.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 border-b border-bg-elevated px-3 py-2" style={{ background: "var(--actbar-bg)" }}>
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
            <div className="flex min-h-[40px] items-center gap-2 border-t border-bg-elevated px-3 py-2" style={{ background: "var(--actbar-bg)" }}>
              <Sparkles className="h-4 w-4 shrink-0 self-center text-brand-orange" />
              <MicWithSettings
                voice={voice}
                supported={voice.supported}
                onTapDictation={beginTapDictation}
                onBeginHoldDictation={beginHoldDictation}
              />
              <button
                type="button"
                onClick={() => promptFileRef.current?.click()}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition"
                style={{
                  borderColor: "var(--input-border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-secondary)"
                }}
                aria-label={t("workspace.attachFiles")}
              >
                <Plus className="h-[18px] w-[18px]" strokeWidth={2.25} />
              </button>
              <input
                value={promptValue}
                onChange={(event) => setPromptValue(event.target.value)}
                placeholder={t("workspace.codePlaceholder")}
                className="box-border h-9 min-h-9 min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm leading-5 outline-none"
                style={{ borderColor: "var(--input-border)", background: "var(--input-bg)", color: "var(--input-text)" }}
              />
              <button
                type="button"
                onClick={() => void run()}
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  promptValue.trim() || promptFiles.length ? "bg-brand-orange text-white" : "bg-bg-elevated text-text-muted"
                }`}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden flex-col border-t border-bg-elevated md:flex" style={{ background: "var(--actbar-bg)" }}>
          {promptFiles.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 border-b border-bg-elevated px-4 py-2">
              {promptFiles.map((file, index) => (
                <span
                  key={`${file.name}-${index}-d`}
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
          <div className="flex min-h-[40px] items-center gap-2 px-4 py-2">
            <Sparkles className="h-4 w-4 shrink-0 self-center text-brand-orange" />
            <MicWithSettings
              voice={voice}
              supported={voice.supported}
              onTapDictation={beginTapDictation}
              onBeginHoldDictation={beginHoldDictation}
            />
            <button
              type="button"
              onClick={() => promptFileRef.current?.click()}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition"
              style={{
                borderColor: "var(--input-border)",
                background: "var(--bg-elevated)",
                color: "var(--text-secondary)"
              }}
              aria-label={t("workspace.attachFiles")}
            >
              <Plus className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </button>
            <input
              value={promptValue}
              onChange={(event) => setPromptValue(event.target.value)}
              placeholder={t("workspace.codePlaceholder")}
              className="box-border h-9 min-h-9 min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm leading-5 outline-none"
              style={{ borderColor: "var(--input-border)", background: "var(--input-bg)", color: "var(--input-text)" }}
            />
            <button
              type="button"
              onClick={() => void run()}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                promptValue.trim() || promptFiles.length ? "bg-brand-orange text-white" : "bg-bg-elevated text-text-muted"
              }`}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <LivePreview files={files} />
      </div>
    </div>
  );
}
