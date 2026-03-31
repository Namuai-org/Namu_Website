"use client";

import { Code2, MessageSquare, Mic, PanelLeftClose, PanelRightOpen, PenLine, Plus } from "lucide-react";

import { Tooltip } from "@/components/shared/Tooltip";
import { ProfileAccountMenu } from "@/components/workspace/ProfileAccountMenu";
import { SessionHistoryContent } from "@/components/workspace/SessionHistoryContent";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function ActivityBar(): JSX.Element {
  const { activeMode, setMode, resetToHome, sidebarExpanded, toggleSidebarExpanded } = useStudio();
  const { t } = useTranslation();
  const items = [
    { id: "chat" as const, icon: MessageSquare, label: t("workspace.chat") },
    { id: "create" as const, icon: PenLine, label: t("workspace.create") },
    { id: "code" as const, icon: Code2, label: t("workspace.code") },
    { id: "voice" as const, icon: Mic, label: t("workspace.voice") }
  ];

  return (
    <aside
      className="hidden h-full min-h-0 flex-col border-r font-sans transition-[width] duration-200 ease-out md:flex"
      style={{
        borderColor: "var(--actbar-border)",
        background: "var(--actbar-bg)",
        width: sidebarExpanded ? "min(280px, 88vw)" : "64px"
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 space-y-0.5 px-2.5 py-3">
          <Tooltip content={sidebarExpanded ? t("workspace.collapseSidebar") : t("workspace.expandSidebar")}>
            <button
              type="button"
              onClick={toggleSidebarExpanded}
              className="flex h-10 w-full items-center justify-center rounded-[10px] text-[var(--actbar-icon)] transition hover:bg-bg-elevated hover:text-text-secondary"
              aria-expanded={sidebarExpanded}
            >
              {sidebarExpanded ? <PanelLeftClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
            </button>
          </Tooltip>

          {sidebarExpanded ? (
            <button
              type="button"
              onClick={resetToHome}
              className="flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-left text-[13px] font-normal text-text-secondary transition hover:bg-[var(--bg-elevated)]"
            >
              <Plus className="h-5 w-5 shrink-0 text-[var(--actbar-icon)]" />
              <span className="truncate">{t("common.newSession")}</span>
            </button>
          ) : (
            <Tooltip content={t("common.newSession")}>
              <button
                type="button"
                onClick={resetToHome}
                className="flex h-10 w-full items-center justify-center rounded-[10px] text-[var(--actbar-icon)] transition hover:bg-bg-elevated hover:text-text-secondary"
              >
                <Plus className="h-5 w-5" />
              </button>
            </Tooltip>
          )}

          <div className={sidebarExpanded ? "space-y-px pt-1.5" : "space-y-1"}>
            {items.map((item) =>
              sidebarExpanded ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`relative flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-left text-[13px] font-normal transition ${
                    activeMode === item.id
                      ? "bg-[var(--bg-active)] text-[var(--actbar-active)]"
                      : "text-text-secondary hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  {activeMode === item.id ? <span className="absolute left-0 h-4 w-[3px] rounded-r bg-brand-orange" /> : null}
                  <item.icon className="h-[18px] w-[18px] shrink-0 opacity-70" style={{ color: "var(--actbar-icon)" }} />
                  <span className="truncate">{item.label}</span>
                </button>
              ) : (
                <Tooltip key={item.id} content={item.label}>
                  <button
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`relative flex h-10 w-full items-center justify-center rounded-[10px] transition ${
                      activeMode === item.id ? "bg-brand-orange/10 text-[var(--actbar-active)]" : "text-[var(--actbar-icon)] hover:bg-bg-elevated hover:text-text-secondary"
                    }`}
                  >
                    {activeMode === item.id ? <span className="absolute -left-0.5 h-5 w-[3px] rounded-r bg-brand-orange" /> : null}
                    <item.icon className="h-5 w-5" />
                  </button>
                </Tooltip>
              )
            )}
          </div>
        </div>

        {sidebarExpanded ? (
          <>
            <div className="mx-2.5 mt-2 shrink-0 border-t pt-3" style={{ borderColor: "var(--actbar-border)" }}>
              <div className="px-1 pb-2 text-[11px] font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>
                {t("workspace.recents")}
              </div>
            </div>
            <SessionHistoryContent className="min-h-0" />
          </>
        ) : null}
      </div>

      <div className="shrink-0 border-t px-2 py-2" style={{ borderColor: "var(--actbar-border)" }}>
        <ProfileAccountMenu variant="sidebar" sidebarRailCompact={!sidebarExpanded} />
      </div>
    </aside>
  );
}
