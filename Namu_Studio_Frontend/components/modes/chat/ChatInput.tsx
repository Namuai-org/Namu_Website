"use client";

import { motion } from "framer-motion";
import { ArrowUp, Plus, Square, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MicWithSettings } from "@/components/modes/chat/MicWithSettings";
import { useVoice } from "@/hooks/useVoice";
import { useVoiceDictationMerge } from "@/hooks/useVoiceDictationMerge";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useShell } from "@/lib/studio/shellContext";
import { useWorkspace } from "@/lib/studio/workspaceContext";

interface ChatInputProps {
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
  variant?: "active" | "home";
  onFocusChange?: (focused: boolean) => void;
  placeholderOverride?: string;
  onMicClick?: () => void;
  streaming?: boolean;
  onStop?: () => void;
}

const homePlaceholders = [
  "Rubuta tambaya a Hausa...",
  "Gaya mani abin da kake son gina...",
  "Yi magana naka da AI yau..."
];

const TEXT_ROW = 36;
const MAX_ATTACHMENTS = 8;
const MAX_BYTES = 12 * 1024 * 1024;

export function ChatInput({
  value,
  setValue,
  onSubmit,
  variant = "active",
  onFocusChange,
  placeholderOverride,
  onMicClick,
  streaming = false,
  onStop
}: ChatInputProps): JSX.Element {
  const { t } = useTranslation();
  const { pushToast } = useShell();
  const { chatAttachments, setChatAttachments } = useWorkspace();
  const voice = useVoice();
  const { beginTapDictation, beginHoldDictation } = useVoiceDictationMerge(voice, value, setValue);
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [placeholderPhase, setPlaceholderPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const [multiLine, setMultiLine] = useState(false);
  const isHome = variant === "home";

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.style.height = `${TEXT_ROW}px`;
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    setMultiLine(el.scrollHeight > TEXT_ROW + 4);
  }, [isHome, value]);

  useEffect(() => {
    if (!isHome) {
      setAnimatedPlaceholder("");
      setPlaceholderPhase("typing");
      return;
    }

    if (focused || value.trim()) {
      setAnimatedPlaceholder("");
      setPlaceholderPhase("typing");
      return;
    }

    if (placeholderOverride) {
      setAnimatedPlaceholder(placeholderOverride);
      setPlaceholderPhase("typing");
      return;
    }

    const currentPlaceholder = homePlaceholders[placeholderIndex];
    const timeout = window.setTimeout(() => {
      if (placeholderPhase === "typing") {
        if (animatedPlaceholder.length < currentPlaceholder.length) {
          setAnimatedPlaceholder(currentPlaceholder.slice(0, animatedPlaceholder.length + 1));
          return;
        }

        setPlaceholderPhase("holding");
        return;
      }

      if (placeholderPhase === "holding") {
        setPlaceholderPhase("deleting");
        return;
      }

      if (animatedPlaceholder.length > 0) {
        setAnimatedPlaceholder(currentPlaceholder.slice(0, animatedPlaceholder.length - 1));
        return;
      }

      setPlaceholderPhase("typing");
      setPlaceholderIndex((current) => (current + 1) % homePlaceholders.length);
    }, placeholderPhase === "typing" ? 40 : placeholderPhase === "holding" ? 1350 : 18);

    return () => window.clearTimeout(timeout);
  }, [animatedPlaceholder, focused, isHome, placeholderIndex, placeholderOverride, placeholderPhase, value]);

  const placeholder = useMemo(() => {
    if (!isHome) return t("workspace.chatPlaceholder");
    if (placeholderOverride) return placeholderOverride;
    return animatedPlaceholder;
  }, [animatedPlaceholder, isHome, placeholderOverride, t]);

  const addFiles = (list: FileList | File[]): void => {
    const next = Array.from(list);
    const merged = [...chatAttachments];
    for (const file of next) {
      if (file.size > MAX_BYTES) {
        pushToast({
          title: t("workspace.fileTooLarge"),
          description: file.name,
          type: "warning"
        });
        continue;
      }
      if (merged.length >= MAX_ATTACHMENTS) {
        pushToast({
          title: t("workspace.tooManyFiles"),
          description: String(MAX_ATTACHMENTS),
          type: "warning"
        });
        break;
      }
      merged.push(file);
    }
    setChatAttachments(merged);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const removeFile = (index: number): void => {
    setChatAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const textClass = isHome ? "text-[15px] leading-5" : "text-sm leading-5";
  const placeholderClass = isHome ? "text-[15px] leading-5" : "text-sm leading-5";

  const attachBtn =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-0 transition hover:opacity-90";

  return (
    <div
      className={isHome ? "w-full" : "border-t px-3 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-3 md:px-4 md:pb-5 md:pt-4"}
      style={isHome ? undefined : { borderColor: "var(--header-border)", background: "var(--actbar-bg)" }}
    >
      <motion.div
        layoutId="main-input"
        className={`mx-auto flex w-full max-w-[760px] flex-col gap-2 border px-3 py-2 transition sm:px-4 ${isHome ? "min-h-14 max-w-[680px] rounded-[22px]" : "rounded-[14px]"}`}
        style={{
          background: "var(--input-bg)",
          borderColor: focused ? "var(--input-focus-border)" : "var(--input-border)",
          boxShadow: focused
            ? "0 0 0 4px var(--input-focus-shadow), 0 8px 32px rgba(26,21,16,0.08)"
            : isHome
              ? "0 1px 2px rgba(26,21,16,0.04), 0 16px 48px rgba(26,21,16,0.07)"
              : undefined
        }}
      >
        <div className={`flex gap-1.5 sm:gap-2 ${multiLine ? "items-end" : "items-center"}`}>
          <MicWithSettings
            voice={voice}
            supported={voice.supported}
            onOpenVoiceMode={onMicClick}
            onTapDictation={beginTapDictation}
            onBeginHoldDictation={beginHoldDictation}
            isHome={isHome}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={attachBtn}
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)"
            }}
            aria-label={t("workspace.attachFiles")}
          >
            <Plus className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </button>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*,.pdf,.txt,.md,.csv,.json,application/pdf"
            onChange={(event) => {
              const files = event.target.files;
              if (files?.length) {
                addFiles(files);
              }
            }}
          />

          <div
            className={`relative flex min-h-[36px] flex-1 min-w-0 ${multiLine ? "items-start" : "items-center"}`}
          >
            {!value ? (
              <span
                className={`pointer-events-none absolute left-0 z-0 max-w-full truncate ${placeholderClass} transition-opacity duration-300 ${
                  multiLine ? "top-2" : "top-1/2 -translate-y-1/2"
                }`}
                style={{ opacity: focused ? 0 : 1, color: "var(--input-placeholder)" }}
              >
                {placeholder}
              </span>
            ) : null}
            <textarea
              ref={ref}
              value={value}
              onFocus={() => {
                setFocused(true);
                onFocusChange?.(true);
              }}
              onBlur={() => {
                setFocused(false);
                onFocusChange?.(false);
              }}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSubmit();
                }
              }}
              rows={1}
              className={`relative z-10 max-h-[200px] min-h-[36px] w-full resize-none bg-transparent py-2 leading-5 outline-none ${textClass}`}
              style={{ color: "var(--input-text)", caretColor: "var(--orange)" }}
            />
          </div>

          {streaming ? (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition"
              style={{ background: "var(--orange)", color: "#ffffff" }}
              aria-label={t("workspace.stop")}
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition"
              style={{
                background: value.trim() || chatAttachments.length ? "var(--orange)" : isHome ? "var(--bg-active)" : "var(--bg-elevated)",
                color: value.trim() || chatAttachments.length ? "#ffffff" : "var(--text-muted)",
                boxShadow: value.trim() || chatAttachments.length ? "0 4px 12px rgba(218,119,86,0.3)" : undefined
              }}
              aria-label={t("common.send")}
            >
              <ArrowUp className="h-[17px] w-[17px]" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {chatAttachments.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 border-t border-border-light/80 pt-2">
            {chatAttachments.map((file, index) => (
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
                  onClick={() => removeFile(index)}
                  className="rounded-full p-0.5 hover:bg-bg-active"
                  aria-label={t("workspace.removeAttachment")}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </motion.div>
      {!isHome ? (
        <p className="mt-3 text-center text-[11px]" style={{ color: "var(--text-placeholder)" }}>
          {t("workspace.disclaimer")}
        </p>
      ) : null}
    </div>
  );
}
