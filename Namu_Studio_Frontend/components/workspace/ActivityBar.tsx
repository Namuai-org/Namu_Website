"use client";

import { Clock, Code2, MessageSquare, Mic, PenLine, Settings } from "lucide-react";

import { Tooltip } from "@/components/shared/Tooltip";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ThemeSwitcher } from "@/components/workspace/ThemeSwitcher";

export function ActivityBar(): JSX.Element {
  const { activeMode, setMode, openSidebar, openSettings } = useStudio();
  const { t } = useTranslation();
  const items = [
    { id: "chat" as const, icon: MessageSquare, label: t("workspace.chat") },
    { id: "create" as const, icon: PenLine, label: t("workspace.create") },
    { id: "code" as const, icon: Code2, label: t("workspace.code") },
    { id: "voice" as const, icon: Mic, label: t("workspace.voice") }
  ];

  return (
    <aside className="hidden w-sidebar flex-col border-r bg-[var(--actbar-bg)] py-3 md:flex" style={{ borderColor: "var(--actbar-border)" }}>
      <div className="space-y-1 px-2">
        {items.map((item) => (
          <Tooltip key={item.id} content={item.label}>
            <button
              type="button"
              onClick={() => setMode(item.id)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-[10px] transition ${activeMode === item.id ? "bg-brand-orange/10 text-[var(--actbar-active)]" : "text-[var(--actbar-icon)] hover:bg-bg-elevated hover:text-text-secondary"}`}
            >
              {activeMode === item.id ? <span className="absolute -left-2 h-5 w-[3px] rounded-r bg-brand-orange" /> : null}
              <item.icon className="h-5 w-5" />
            </button>
          </Tooltip>
        ))}
      </div>
      <div className="mt-auto space-y-1 px-2">
        <Tooltip content={t("workspace.sessionHistory")}>
          <button type="button" onClick={openSidebar} className="flex h-10 w-10 items-center justify-center rounded-[10px] text-[var(--actbar-icon)] transition hover:bg-bg-elevated hover:text-text-secondary">
            <Clock className="h-5 w-5" />
          </button>
        </Tooltip>
        <ThemeSwitcher />
        <Tooltip content={t("workspace.settings")}>
          <button
            type="button"
            onClick={openSettings}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] text-[var(--actbar-icon)] transition hover:bg-bg-elevated hover:text-text-secondary"
          >
            <Settings className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
