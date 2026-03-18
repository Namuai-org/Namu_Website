"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { createCodeProject, getSessionProject } from "@/lib/studio/codeService";
import { getSessionOutputs } from "@/lib/studio/createService";
import { getSessionMessages } from "@/lib/studio/messageService";
import { createSession, deleteSession as removeSession, generateSessionTitle, getUserSessions, updateSessionTitle } from "@/lib/studio/sessionService";
import type { StudioSession } from "@/lib/studio/sessionTypes";
import type { CodeFileRecord, CreateOutput, Message, Session as DbSession } from "@/lib/supabase/types";
import type { AppMode, ChatMessage, CodeFile } from "@/types";

interface SessionContextValue {
  sessions: StudioSession[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  workspaceLoading: boolean;
  historyLoading: boolean;
  historyError: boolean;
  messagesLoading: boolean;
  refreshSessions: () => Promise<void>;
  createSessionRecord: (prompt: string, mode: AppMode, title?: string) => Promise<string | null>;
  renameSession: (id: string, title: string) => Promise<void>;
  deleteSession: (id: string) => Promise<boolean>;
  selectSession: (id: string) => Promise<void>;
  patchSession: (
    id: string,
    updates: Partial<StudioSession> | ((session: StudioSession) => Partial<StudioSession>)
  ) => void;
  resetSessions: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const initialFiles: CodeFile[] = [
  { id: "html", name: "index.html", language: "html", content: "<!-- Start building -->" },
  { id: "css", name: "styles.css", language: "css", content: "body {\n  margin: 0;\n}" },
  { id: "js", name: "script.js", language: "javascript", content: "document.body.dataset.ready = 'true';" }
];

function formatTimeAgo(timestamp: string): string {
  const now = Date.now();
  const diffHours = Math.floor((now - new Date(timestamp).getTime()) / (1000 * 60 * 60));
  if (diffHours <= 0) return "Yanzu";
  if (diffHours < 24) return `${diffHours} sa'o'i`;
  if (diffHours < 48) return "Jiya";
  return `Kwana ${Math.floor(diffHours / 24)}`;
}

function mapMessage(row: Message): ChatMessage {
  return { id: row.id, role: row.role, content: row.content, createdAt: row.created_at };
}

function mapCodeFile(row: CodeFileRecord): CodeFile {
  return {
    id: row.id,
    name: row.filename,
    language: row.language === "html" || row.language === "css" ? row.language : "javascript",
    content: row.content
  };
}

function mapDbSession(row: DbSession, previous?: StudioSession): StudioSession {
  return {
    id: row.id,
    mode: row.mode,
    title: row.title,
    preview: previous?.preview ?? "",
    timeAgo: formatTimeAgo(row.updated_at),
    updatedAt: row.updated_at,
    prompt: previous?.prompt,
    chatMessages: previous?.chatMessages ?? [],
    createOutput: previous?.createOutput ?? "",
    createPrompt: previous?.createPrompt ?? "",
    codePrompt: previous?.codePrompt ?? "",
    files: previous?.files ?? initialFiles,
    voiceTranscript: previous?.voiceTranscript ?? "",
    voiceResponse: previous?.voiceResponse ?? "",
    projectId: previous?.projectId ?? null
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { user, initialized } = useAuth();
  const [sessions, setSessions] = useState<StudioSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const refreshSessions = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      setSessions([]);
      setWorkspaceLoading(false);
      return;
    }

    setHistoryLoading(true);
    setHistoryError(false);
    const { data, error } = await getUserSessions(user.id);
    if (error) {
      setHistoryError(true);
      setHistoryLoading(false);
      setWorkspaceLoading(false);
      return;
    }

    setSessions((current) =>
      ((data as DbSession[] | null) ?? []).map((row) => mapDbSession(row, current.find((item) => item.id === row.id)))
    );
    setHistoryLoading(false);
    setWorkspaceLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (!initialized) return;
    void refreshSessions();
  }, [initialized, refreshSessions]);

  const patchSession = useCallback((
    id: string,
    updates: Partial<StudioSession> | ((session: StudioSession) => Partial<StudioSession>)
  ) => {
    setSessions((current) =>
      current.map((session) => {
        if (session.id !== id) return session;
        const nextUpdates = typeof updates === "function" ? updates(session) : updates;
        return { ...session, ...nextUpdates };
      })
    );
  }, []);

  const createSessionRecord = useCallback(async (prompt: string, mode: AppMode, title?: string): Promise<string | null> => {
    if (!user?.id) return null;
    const sessionTitle = title ?? (prompt.trim() ? generateSessionTitle(prompt) : "Sabon Zama");
    const { data, error } = await createSession(user.id, mode, sessionTitle);
    if (error || !data) {
      return null;
    }

    const nextSession = mapDbSession(data as DbSession);
    setSessions((current) => [nextSession, ...current.filter((item) => item.id !== nextSession.id)]);
    setActiveSessionId(nextSession.id);

    if (mode === "code") {
      const projectResult = await createCodeProject(nextSession.id, user.id);
      const projectData = projectResult.data as { id: string } | null;
      if (projectData) {
        patchSession(nextSession.id, { projectId: projectData.id });
      }
    }

    return nextSession.id;
  }, [patchSession, user?.id]);

  const renameSession = useCallback(async (id: string, title: string): Promise<void> => {
    patchSession(id, { title });
    await updateSessionTitle(id, title);
  }, [patchSession]);

  const deleteSession = useCallback(async (id: string): Promise<boolean> => {
    setSessions((current) => current.filter((session) => session.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
    const { error } = await removeSession(id);
    if (error) {
      await refreshSessions();
      return false;
    }
    return true;
  }, [activeSessionId, refreshSessions]);

  const selectSession = useCallback(async (id: string): Promise<void> => {
    setActiveSessionId(id);
    setMessagesLoading(true);

    const [{ data: messageRows }, { data: outputs }, { data: project }] = await Promise.all([
      getSessionMessages(id),
      getSessionOutputs(id),
      getSessionProject(id)
    ]);

    const typedMessages = (messageRows as Message[] | null) ?? [];
    const latestOutput = ((outputs as CreateOutput[] | null) ?? [])[0] ?? null;
    const codeFiles = ((project as { code_files?: CodeFileRecord[] } | null)?.code_files ?? []).map(mapCodeFile);

    patchSession(id, {
      chatMessages: typedMessages.map(mapMessage),
      preview: typedMessages.at(-1)?.content ?? latestOutput?.output ?? "",
      createPrompt: latestOutput?.prompt ?? "",
      createOutput: latestOutput?.output ?? "",
      files: codeFiles.length ? codeFiles : initialFiles,
      projectId: (project as { id?: string } | null)?.id ?? null
    });
    setMessagesLoading(false);
  }, [patchSession]);

  const resetSessions = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
    setWorkspaceLoading(true);
    setHistoryLoading(false);
    setHistoryError(false);
    setMessagesLoading(false);
  }, []);

  const value = useMemo<SessionContextValue>(() => ({
    sessions,
    activeSessionId,
    setActiveSessionId,
    workspaceLoading,
    historyLoading,
    historyError,
    messagesLoading,
    refreshSessions,
    createSessionRecord,
    renameSession,
    deleteSession,
    selectSession,
    patchSession,
    resetSessions
  }), [
    activeSessionId,
    createSessionRecord,
    deleteSession,
    historyError,
    historyLoading,
    messagesLoading,
    patchSession,
    refreshSessions,
    renameSession,
    selectSession,
    sessions,
    workspaceLoading,
    resetSessions
  ]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}
