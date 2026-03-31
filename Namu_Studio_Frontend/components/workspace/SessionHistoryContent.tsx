"use client";

import { AlertCircle, Boxes, Clock, MoreHorizontal, Pencil, Search, Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useStarredSessions } from "@/hooks/useStarredSessions";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { StudioSession } from "@/lib/studio/sessionTypes";
import { cn } from "@/lib/cn";

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

type SessionHistoryContentProps = {
  showSearch?: boolean;
  className?: string;
  listClassName?: string;
};

export function SessionHistoryContent({
  showSearch = true,
  className,
  listClassName
}: SessionHistoryContentProps): JSX.Element {
  const {
    sessions,
    selectSession,
    refreshSessions,
    historyLoading,
    historyError,
    deleteSession,
    activeSessionId,
    renameSessionById,
    pushToast
  } = useStudio();
  const { t } = useTranslation();
  const { starredIds, toggleStar, starRevision, isStarred } = useStarredSessions();
  const [query, setQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");

  const filtered = useMemo(
    () => sessions.filter((session) => `${session.title} ${session.preview}`.toLowerCase().includes(query.toLowerCase())),
    [query, sessions]
  );

  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const sa = starredIds.has(a.id);
      const sb = starredIds.has(b.id);
      if (sa !== sb) return sa ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return list;
  }, [filtered, starredIds, starRevision]);

  const grouped = useMemo(() => groupByDate(sortedFiltered), [sortedFiltered]);

  useEffect(() => {
    if (!menuOpenId) return;
    const onDown = (e: MouseEvent): void => {
      const el = e.target as HTMLElement;
      if (el.closest?.("[data-session-overflow-menu]")) return;
      if (menuOpenId && el.closest?.(`[data-overflow-anchor="${menuOpenId}"]`)) return;
      setMenuOpenId(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpenId]);

  const beginRename = useCallback((session: StudioSession) => {
    setMenuOpenId(null);
    setRenamingId(session.id);
    setRenameDraft(session.title);
  }, []);

  const commitRename = useCallback(async () => {
    if (!renamingId) return;
    const next = renameDraft.trim();
    if (next) await renameSessionById(renamingId, next);
    setRenamingId(null);
    setRenameDraft("");
  }, [renameDraft, renameSessionById, renamingId]);

  const cancelRename = useCallback(() => {
    setRenamingId(null);
    setRenameDraft("");
  }, []);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {showSearch ? (
        <div className="relative mx-2 mt-1 shrink-0">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-45" style={{ color: "var(--text-muted)" }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("workspace.searchSessions")}
            className="h-8 w-full rounded-lg border-0 pl-8 pr-2.5 text-[13px] outline-none ring-1 ring-transparent transition placeholder:opacity-60 focus:ring-1"
            style={{
              background: "rgba(0,0,0,0.04)",
              color: "var(--text-primary)",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)"
            }}
          />
        </div>
      ) : null}
      <div className={cn("min-h-0 flex-1 overflow-y-auto px-1.5 pb-2 pt-1.5", listClassName)}>
        {historyLoading ? (
          <div className="space-y-2 px-1 pt-1">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-7 rounded-md shimmer" style={{ backgroundColor: "rgba(0,0,0,0.05)" }} />
            ))}
          </div>
        ) : historyError ? (
          <div className="grid h-full place-items-center px-4 text-center">
            <div>
              <AlertCircle className="mx-auto h-6 w-6 text-status-error" />
              <p className="mt-3 text-sm text-text-primary">{t("toasts.historyLoadFailed")}</p>
              <button
                type="button"
                onClick={() => void refreshSessions()}
                className="mt-3 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-elevated"
              >
                {t("common.tryAgain")}
              </button>
            </div>
          </div>
        ) : !sortedFiltered.length ? (
          <div className="grid h-full min-h-[120px] place-items-center text-center">
            <div>
              <Clock className="mx-auto h-8 w-8 opacity-30" style={{ color: "var(--text-muted)" }} />
              <p className="mt-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
                {t("workspace.noSessionsYet")}
              </p>
            </div>
          </div>
        ) : (
          <>
            <SessionGroup
              title={t("workspace.groupToday")}
              sessions={grouped.today}
              activeSessionId={activeSessionId}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              pendingDeleteId={pendingDeleteId}
              setPendingDeleteId={setPendingDeleteId}
              renamingId={renamingId}
              renameDraft={renameDraft}
              setRenameDraft={setRenameDraft}
              onBeginRename={beginRename}
              onCommitRename={commitRename}
              onCancelRename={cancelRename}
              selectSession={selectSession}
              deleteSession={deleteSession}
              isStarred={isStarred}
              toggleStar={toggleStar}
              pushToast={pushToast}
              t={t}
            />
            <SessionGroup
              title={t("workspace.groupYesterday")}
              sessions={grouped.yesterday}
              activeSessionId={activeSessionId}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              pendingDeleteId={pendingDeleteId}
              setPendingDeleteId={setPendingDeleteId}
              renamingId={renamingId}
              renameDraft={renameDraft}
              setRenameDraft={setRenameDraft}
              onBeginRename={beginRename}
              onCommitRename={commitRename}
              onCancelRename={cancelRename}
              selectSession={selectSession}
              deleteSession={deleteSession}
              isStarred={isStarred}
              toggleStar={toggleStar}
              pushToast={pushToast}
              t={t}
            />
            <SessionGroup
              title={t("workspace.groupThisWeek")}
              sessions={grouped.thisWeek}
              activeSessionId={activeSessionId}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              pendingDeleteId={pendingDeleteId}
              setPendingDeleteId={setPendingDeleteId}
              renamingId={renamingId}
              renameDraft={renameDraft}
              setRenameDraft={setRenameDraft}
              onBeginRename={beginRename}
              onCommitRename={commitRename}
              onCancelRename={cancelRename}
              selectSession={selectSession}
              deleteSession={deleteSession}
              isStarred={isStarred}
              toggleStar={toggleStar}
              pushToast={pushToast}
              t={t}
            />
            <SessionGroup
              title={t("workspace.groupOlder")}
              sessions={grouped.older}
              activeSessionId={activeSessionId}
              menuOpenId={menuOpenId}
              setMenuOpenId={setMenuOpenId}
              pendingDeleteId={pendingDeleteId}
              setPendingDeleteId={setPendingDeleteId}
              renamingId={renamingId}
              renameDraft={renameDraft}
              setRenameDraft={setRenameDraft}
              onBeginRename={beginRename}
              onCommitRename={commitRename}
              onCancelRename={cancelRename}
              selectSession={selectSession}
              deleteSession={deleteSession}
              isStarred={isStarred}
              toggleStar={toggleStar}
              pushToast={pushToast}
              t={t}
            />
          </>
        )}
      </div>
    </div>
  );
}

function SessionGroup({
  title,
  sessions,
  activeSessionId,
  menuOpenId,
  setMenuOpenId,
  pendingDeleteId,
  setPendingDeleteId,
  renamingId,
  renameDraft,
  setRenameDraft,
  onBeginRename,
  onCommitRename,
  onCancelRename,
  selectSession,
  deleteSession,
  isStarred,
  toggleStar,
  pushToast,
  t
}: {
  title: string;
  sessions: StudioSession[];
  activeSessionId: string | null;
  menuOpenId: string | null;
  setMenuOpenId: (id: string | null) => void;
  pendingDeleteId: string | null;
  setPendingDeleteId: (id: string | null) => void;
  renamingId: string | null;
  renameDraft: string;
  setRenameDraft: (v: string) => void;
  onBeginRename: (s: StudioSession) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  selectSession: (id: string) => Promise<void>;
  deleteSession: (id: string) => Promise<boolean>;
  isStarred: (id: string) => boolean;
  toggleStar: (id: string) => void;
  pushToast: (toast: { title: string; description: string; type: "success" | "error" | "warning" | "info" }) => void;
  t: (path: string) => string;
}): JSX.Element | null {
  if (!sessions.length) return null;

  return (
    <div className="mb-1">
      <div
        className="px-2 pb-1.5 pt-3 text-[11px] font-medium tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </div>
      <ul className="space-y-0.5">
        {sessions.map((session) => (
          <li key={session.id} className="list-none">
            <SessionRow
              session={session}
              active={session.id === activeSessionId}
              menuOpen={menuOpenId === session.id}
              onToggleMenu={() => setMenuOpenId(menuOpenId === session.id ? null : session.id)}
              pendingDelete={pendingDeleteId === session.id}
              setPendingDeleteId={setPendingDeleteId}
              renaming={renamingId === session.id}
              renameDraft={renameDraft}
              setRenameDraft={setRenameDraft}
              onBeginRename={onBeginRename}
              onCommitRename={onCommitRename}
              onCancelRename={onCancelRename}
              selectSession={selectSession}
              deleteSession={deleteSession}
              starred={isStarred(session.id)}
              onToggleStar={() => toggleStar(session.id)}
              onCloseMenu={() => setMenuOpenId(null)}
              onAddToProject={() => {
                setMenuOpenId(null);
                pushToast({
                  title: t("workspace.sessionMenuAddToProject"),
                  description: t("workspace.sessionMenuAddToProjectSoon"),
                  type: "info"
                });
              }}
              t={t}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SessionRow({
  session,
  active,
  menuOpen,
  onToggleMenu,
  pendingDelete,
  setPendingDeleteId,
  renaming,
  renameDraft,
  setRenameDraft,
  onBeginRename,
  onCommitRename,
  onCancelRename,
  selectSession,
  deleteSession,
  starred,
  onToggleStar,
  onCloseMenu,
  onAddToProject,
  t
}: {
  session: StudioSession;
  active: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  pendingDelete: boolean;
  setPendingDeleteId: (id: string | null) => void;
  renaming: boolean;
  renameDraft: string;
  setRenameDraft: (v: string) => void;
  onBeginRename: (s: StudioSession) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  selectSession: (id: string) => Promise<void>;
  deleteSession: (id: string) => Promise<boolean>;
  starred: boolean;
  onToggleStar: () => void;
  onCloseMenu: () => void;
  onAddToProject: () => void;
  t: (path: string) => string;
}): JSX.Element {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

  return (
    <div className="group/session relative">
      <div
        className={cn(
          "flex items-center gap-0.5 rounded-lg transition-colors",
          active ? "bg-[var(--bg-active)]" : "hover:bg-[var(--bg-elevated)]"
        )}
      >
        {renaming ? (
          <input
            ref={inputRef}
            value={renameDraft}
            onChange={(e) => setRenameDraft(e.target.value)}
            onBlur={() => void onCommitRename()}
            onKeyDown={(e) => {
              if (e.key === "Enter") void onCommitRename();
              if (e.key === "Escape") onCancelRename();
            }}
            className="min-w-0 flex-1 rounded-lg border-0 bg-transparent py-2 pl-2 pr-1 text-[13px] outline-none ring-1 ring-brand-orange/30"
            style={{ color: "var(--text-primary)" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <button
            type="button"
            onClick={() => void selectSession(session.id)}
            className="min-w-0 flex-1 truncate rounded-lg py-2 pl-2 pr-1 text-left text-[13px] leading-snug transition"
            style={{ color: "var(--text-primary)", fontWeight: active ? 600 : 400 }}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              {starred ? (
                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" aria-hidden />
              ) : null}
              <span className="truncate">{session.title}</span>
            </span>
          </button>
        )}
        {!renaming ? (
          <button
            ref={triggerRef}
            type="button"
            data-overflow-anchor={session.id}
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            className={cn(
              "mr-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition",
              menuOpen ? "bg-[var(--bg-active)] opacity-100" : "opacity-100 md:opacity-0 md:group-hover/session:opacity-100"
            )}
            style={{ color: "var(--text-muted)" }}
            aria-label={t("workspace.sessionOverflowLabel")}
            aria-expanded={menuOpen}
          >
            <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      {menuOpen ? (
        <SessionOverflowMenu
          triggerRef={triggerRef}
          starred={starred}
          onStar={() => {
            onToggleStar();
            onCloseMenu();
          }}
          onRename={() => onBeginRename(session)}
          onAddToProject={onAddToProject}
          onDelete={() => {
            onCloseMenu();
            setPendingDeleteId(session.id);
          }}
          t={t}
        />
      ) : null}

      {pendingDelete ? (
        <div
          className="mt-1 rounded-lg px-2 py-2 text-[12px]"
          style={{ background: "rgba(0,0,0,0.04)", color: "var(--text-secondary)" }}
        >
          <p className="mb-2">{t("workspace.deleteSessionQuestion")}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void deleteSession(session.id)}
              className="rounded-md bg-status-error px-2.5 py-1 text-xs font-medium text-white"
            >
              {t("workspace.deleteSessionConfirmBtn")}
            </button>
            <button
              type="button"
              onClick={() => setPendingDeleteId(null)}
              className="rounded-md border px-2.5 py-1 text-xs font-medium"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {t("workspace.deleteSessionDismissBtn")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SessionOverflowMenu({
  triggerRef,
  starred,
  onStar,
  onRename,
  onAddToProject,
  onDelete,
  t
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  starred: boolean;
  onStar: () => void;
  onRename: () => void;
  onAddToProject: () => void;
  onDelete: () => void;
  t: (path: string) => string;
}): JSX.Element | null {
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const position = (): void => {
      const r = el.getBoundingClientRect();
      const menuWidth = 216;
      let left = r.right - menuWidth;
      left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
      const top = r.bottom + 4;
      const maxH = window.innerHeight - top - 12;
      setStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${menuWidth}px`,
        maxHeight: `min(280px, ${maxH}px)`,
        overflowY: "auto",
        zIndex: 10020
      });
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [triggerRef]);

  if (!mounted) return null;

  return createPortal(
    <div
      data-session-overflow-menu=""
      className="namu-workspace-cream rounded-xl border py-1 shadow-lg"
      style={{ ...style, borderColor: "var(--border)", background: "var(--bg-panel)" }}
    >
      <OverflowItem
        icon={
          <Star
            className={cn("h-4 w-4", starred ? "fill-amber-400 text-amber-600" : "text-current")}
            strokeWidth={1.75}
          />
        }
        label={starred ? t("workspace.sessionMenuUnstar") : t("workspace.sessionMenuStar")}
        onClick={onStar}
      />
      <OverflowItem
        icon={<Pencil className="h-4 w-4" strokeWidth={1.75} />}
        label={t("workspace.sessionMenuRename")}
        onClick={onRename}
      />
      <OverflowItem
        icon={<Boxes className="h-4 w-4" strokeWidth={1.75} />}
        label={t("workspace.sessionMenuAddToProject")}
        onClick={onAddToProject}
      />
      <div className="my-1 h-px" style={{ background: "var(--border)" }} />
      <OverflowItem
        icon={<Trash2 className="h-4 w-4" strokeWidth={1.75} />}
        label={t("workspace.sessionMenuDelete")}
        onClick={onDelete}
        danger
      />
    </div>,
    document.body
  );
}

function OverflowItem({
  icon,
  label,
  onClick,
  danger
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition hover:bg-[var(--bg-active)]",
        danger ? "text-status-error" : ""
      )}
      style={{ color: danger ? undefined : "var(--text-primary)" }}
    >
      <span className={cn("shrink-0", danger ? "text-status-error" : "opacity-80")}>{icon}</span>
      <span className="min-w-0 flex-1">{label}</span>
    </button>
  );
}
