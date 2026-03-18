"use client";

import { GitBranch } from "lucide-react";

import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function StatusBar(): JSX.Element {
  const { activeMode, activeSession, processing, saveIndicator } = useStudio();
  const { language, t } = useTranslation();
  const contextText =
    !activeSession
      ? t("common.loading")
      : activeMode === "chat"
        ? `Sakon ${activeSession.chatMessages.length}`
        : activeMode === "code"
          ? "Layi 12, Ginshiki 8"
          : activeMode === "create"
            ? `${activeSession.createOutput.split(/\s+/).filter(Boolean).length} kalmomi`
            : activeSession.voiceTranscript
              ? t("workspace.saved")
              : t("workspace.recording");

  return (
    <div
      className="flex h-status items-center justify-between px-4 text-[11px]"
      style={{ background: "var(--status-bg)", color: "var(--status-text)" }}
    >
      <div className="flex items-center gap-3">
        <span>Namu AI-Studio</span>
        <span className="h-3 w-px bg-white/30" />
        <span className="flex items-center gap-1 text-white/70">
          <GitBranch className="h-3 w-3" />
          main
        </span>
      </div>
      <div className="italic">{processing ? t("workspace.processing") : ""}</div>
      <div className="flex items-center gap-3">
        {saveIndicator ? <span>{saveIndicator}</span> : null}
        <span>{contextText}</span>
        <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-medium">
          {language.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
