"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Clock, Code2, MessageSquare, Mic, PenLine, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { StudioSession } from "@/lib/studio/sessionTypes";

const icons = { chat: MessageSquare, create: PenLine, code: Code2, voice: Mic };

function groupByDate(sessions: StudioSession[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return {
    today: sessions.filter((s) => new Date(s.updatedAt) >= today),
    yesterday: sessions.filter((s) => {
      const date = new Date(s.updatedAt);
      return date >= yesterday && date < today;
    }),
    thisWeek: sessions.filter((s) => {
      const date = new Date(s.updatedAt);
      return date >= weekAgo && date < yesterday;
    }),
    older: sessions.filter((s) => new Date(s.updatedAt) < weekAgo)
  };
}

export function SessionHistoryPanel(): JSX.Element {
  const { sidebarOpen, closeSidebar, sessions, selectSession, refreshSessions, historyLoading, historyError, deleteSession } = useStudio();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSidebar, sidebarOpen]);

  const filtered = useMemo(
    () => sessions.filter((session) => `${session.title} ${session.preview}`.toLowerCase().includes(query.toLowerCase())),
    [query, sessions]
  );
  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <AnimatePresence>
      {sidebarOpen ? (
        <>
          <motion.button aria-label="Close session history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSidebar} className="absolute inset-0 z-20 bg-black/30" />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-0 z-30 flex h-full w-[280px] flex-col border-r bg-bg-panel"
            style={{ borderColor: "var(--actbar-border)" }}
          >
            <div className="flex h-12 items-center justify-between border-b px-4" style={{ borderColor: "var(--actbar-border)" }}>
              <div className="text-sm font-semibold text-text-primary">{t("workspace.sessionHistory")}</div>
              <button type="button" onClick={closeSidebar} className="text-text-muted transition hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative m-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("workspace.searchSessions")} className="h-9 w-full rounded-lg border pl-9 pr-3 text-sm outline-none" style={{ borderColor: "var(--input-border)", background: "var(--input-bg)", color: "var(--input-text)" }} />
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-3">
              {historyLoading ? (
                <div className="space-y-2 px-1">
                  {[0, 1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-11 rounded-[10px] shimmer" style={{ backgroundColor: "var(--bg-elevated)" }} />
                  ))}
                </div>
              ) : historyError ? (
                <div className="grid h-full place-items-center px-4 text-center">
                  <div>
                    <AlertCircle className="mx-auto h-6 w-6 text-status-error" />
                    <p className="mt-3 text-sm text-text-primary">{t("toasts.historyLoadFailed")}</p>
                    <button type="button" onClick={() => void refreshSessions()} className="mt-3 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-elevated">
                      {t("common.tryAgain")}
                    </button>
                  </div>
                </div>
              ) : !filtered.length ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <Clock className="mx-auto h-8 w-8 text-border-bright" />
                    <p className="mt-2 text-sm text-text-muted">{t("workspace.noSessionsYet")}</p>
                  </div>
                </div>
              ) : (
                <>
                  <SessionGroup title="Yau" sessions={grouped.today} pendingDeleteId={pendingDeleteId} setPendingDeleteId={setPendingDeleteId} selectSession={selectSession} deleteSession={deleteSession} emptyPreview={t("workspace.defaultSession")} />
                  <SessionGroup title="Jiya" sessions={grouped.yesterday} pendingDeleteId={pendingDeleteId} setPendingDeleteId={setPendingDeleteId} selectSession={selectSession} deleteSession={deleteSession} emptyPreview={t("workspace.defaultSession")} />
                  <SessionGroup title="Wannan mako" sessions={grouped.thisWeek} pendingDeleteId={pendingDeleteId} setPendingDeleteId={setPendingDeleteId} selectSession={selectSession} deleteSession={deleteSession} emptyPreview={t("workspace.defaultSession")} />
                  <SessionGroup title="Tsofaffi" sessions={grouped.older} pendingDeleteId={pendingDeleteId} setPendingDeleteId={setPendingDeleteId} selectSession={selectSession} deleteSession={deleteSession} emptyPreview={t("workspace.defaultSession")} />
                </>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function SessionGroup({
  title,
  sessions,
  pendingDeleteId,
  setPendingDeleteId,
  selectSession,
  deleteSession,
  emptyPreview
}: {
  title: string;
  sessions: StudioSession[];
  pendingDeleteId: string | null;
  setPendingDeleteId: (value: string | null) => void;
  selectSession: (id: string) => Promise<void>;
  deleteSession: (id: string) => Promise<boolean>;
  emptyPreview: string;
}): JSX.Element | null {
  if (!sessions.length) return null;

  return (
    <div>
      <div className="px-2 pb-1 pt-2 text-[11px] uppercase tracking-[0.06em] text-text-muted">{title}</div>
      {sessions.map((session) => {
        const Icon = icons[session.mode];
        const deleting = pendingDeleteId === session.id;
        return (
          <div key={session.id} className="relative mb-1">
            <button
              type="button"
              onClick={() => void selectSession(session.id)}
              className="group flex h-11 w-full items-center gap-3 rounded-[10px] border px-3 transition hover:bg-bg-elevated"
              style={{ borderColor: "var(--chip-border)", background: "var(--chip-bg)" }}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: "var(--bg-active)", color: "var(--orange)" }}>
                <Icon className="h-3 w-3" />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>{session.title}</span>
                <span className="block truncate text-[11px]" style={{ color: "var(--text-muted)" }}>{session.preview || emptyPreview}</span>
              </span>
              <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-placeholder)" }}>
                {session.timeAgo}
                <ArrowRight className="h-3 w-3" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPendingDeleteId(deleting ? null : session.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted transition hover:bg-bg-active hover:text-status-error"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            {deleting ? (
              <div className="absolute right-0 top-12 z-10 rounded-lg border border-border bg-bg-elevated p-3 shadow-lg">
                <p className="text-xs text-text-secondary">Ka so share wannan zama?</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => void deleteSession(session.id)} className="rounded-md bg-status-error px-2.5 py-1 text-xs text-white">
                    Share
                  </button>
                  <button type="button" onClick={() => setPendingDeleteId(null)} className="rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary">
                    Soke
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
