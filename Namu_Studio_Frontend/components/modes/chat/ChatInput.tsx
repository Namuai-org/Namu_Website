"use client";

import { motion } from "framer-motion";
import { ArrowUp, Mic, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "@/lib/i18n/useTranslation";

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
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [placeholderPhase, setPlaceholderPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const isHome = variant === "home";

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = isHome ? "28px" : "24px";
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 200)}px`;
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

  return (
    <div
      className={isHome ? "w-full" : "border-t px-3 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-3 md:px-4 md:pb-5 md:pt-4"}
      style={isHome ? undefined : { borderColor: "var(--header-border)", background: "var(--actbar-bg)" }}
    >
      <motion.div
        layoutId="main-input"
        className={`mx-auto flex w-full max-w-[760px] items-end gap-3 border px-4 py-3 transition ${isHome ? "min-h-14 max-w-[680px] rounded-2xl" : "rounded-[14px]"}`}
        style={{
          background: "var(--input-bg)",
          borderColor: focused ? "var(--input-focus-border)" : "var(--input-border)",
          boxShadow: focused
            ? "0 0 0 4px var(--input-focus-shadow), 0 4px 24px rgba(0,0,0,0.12)"
            : isHome
              ? "0 0 0 1px var(--orange-subtle), 0 4px 24px rgba(0,0,0,0.12)"
              : undefined
        }}
      >
        <button
          type="button"
          onClick={onMicClick}
          className={`grid min-h-12 min-w-12 place-items-center transition md:min-h-0 md:min-w-0 ${isHome ? "h-9 w-9 rounded-lg p-1.5" : "h-12 w-12 rounded-full md:h-7 md:w-7"}`}
          style={{
            background: isHome ? "var(--orange-subtle)" : "var(--bg-elevated)",
            color: "var(--orange)"
          }}
        >
          <Mic className={isHome ? "h-4 w-4" : "h-3.5 w-3.5"} />
        </button>
        <div className="relative flex-1">
          {!value ? (
            <span
              className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHome ? "text-[15px]" : "text-sm"}`}
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
            className={`max-h-[200px] min-h-6 w-full resize-none bg-transparent leading-[1.65] outline-none ${isHome ? "text-[15px]" : "text-sm"}`}
            style={{ color: "var(--input-text)", caretColor: "var(--orange)" }}
          />
        </div>
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            className="grid h-12 w-12 place-items-center rounded-full transition md:h-9 md:w-9"
            style={{ background: "var(--orange)", color: "#ffffff" }}
            aria-label={t("workspace.stop")}
          >
            <Square className="h-[16px] w-[16px]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="grid h-12 w-12 place-items-center rounded-full transition md:h-9 md:w-9"
            style={{
              background: value.trim() ? "var(--orange)" : isHome ? "var(--bg-active)" : "var(--bg-elevated)",
              color: value.trim() ? "#ffffff" : "var(--text-muted)",
              boxShadow: value.trim() ? "0 4px 12px rgba(214,112,63,0.3)" : undefined
            }}
            aria-label={t("common.send")}
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </button>
        )}
      </motion.div>
      {!isHome ? (
        <p className="mt-3 text-center text-[11px]" style={{ color: "var(--text-placeholder)" }}>
          {t("workspace.disclaimer")}
        </p>
      ) : null}
    </div>
  );
}
