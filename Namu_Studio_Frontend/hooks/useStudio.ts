"use client";

import { useMemo } from "react";

import { useChat } from "@/lib/studio/chatContext";
import { useSession } from "@/lib/studio/sessionContext";
import { useShell } from "@/lib/studio/shellContext";
import { useWorkspace } from "@/lib/studio/workspaceContext";
import type { StudioSession } from "@/lib/studio/sessionTypes";
import type { AppMode, ChatMessage, CodeFile } from "@/types";

export function useStudio() {
  const shell = useShell();
  const session = useSession();
  const chat = useChat();
  const workspace = useWorkspace();

  const activeSession = useMemo<StudioSession | null>(
    () => session.sessions.find((item) => item.id === session.activeSessionId) ?? null,
    [session.activeSessionId, session.sessions]
  );

  return {
    ...shell,
    ...session,
    ...chat,
    ...workspace,
    sidebarOpen: shell.historyOpen,
    activeSession,
    hasActiveSession: Boolean(activeSession),
    hasVisitedWorkspace: session.sessions.length > 0,
    startSession: async (prompt: string, mode: AppMode = shell.activeMode): Promise<string | null> => {
      const sessionId = await session.createSessionRecord(prompt, mode);
      if (sessionId) {
        workspace.setDraftInput(prompt.trim());
        shell.setMode(mode);
      }
      return sessionId;
    },
    resetToHome: () => {
      shell.setMode("chat");
      shell.closeSidebar();
      shell.closeSettings();
      shell.closeHelp();
      session.setActiveSessionId(null);
      workspace.resetHome();
      chat.abortControllerRef.current?.abort();
      chat.setTyping(false);
      chat.setIsStreaming(false);
      chat.setInlineError("");
    },
    renameSession: async (name: string) => {
      if (!session.activeSessionId) return;
      await session.renameSession(session.activeSessionId, name);
    },
    selectSession: async (id: string) => {
      const selected = session.sessions.find((item) => item.id === id);
      if (selected) {
        shell.setMode(selected.mode);
      }
      await session.selectSession(id);
      shell.closeSidebar();
    },
    addChatMessage: (message: ChatMessage) => {
      if (!session.activeSessionId || !activeSession) return;
      session.patchSession(session.activeSessionId, {
        chatMessages: [...activeSession.chatMessages, message],
        preview: message.content,
        timeAgo: "Yanzu"
      });
    },
    setCreatePrompt: (prompt: string) => {
      if (!session.activeSessionId) return;
      session.patchSession(session.activeSessionId, { createPrompt: prompt });
    },
    setCreateOutput: (output: string) => {
      if (!session.activeSessionId) return;
      session.patchSession(session.activeSessionId, { createOutput: output, preview: output });
    },
    setCodePrompt: (prompt: string) => {
      if (!session.activeSessionId) return;
      session.patchSession(session.activeSessionId, { codePrompt: prompt });
    },
    setFiles: (files: CodeFile[]) => {
      if (!session.activeSessionId) return;
      session.patchSession(session.activeSessionId, { files });
    },
    setVoice: (transcript: string, response: string) => {
      if (!session.activeSessionId) return;
      session.patchSession(session.activeSessionId, {
        voiceTranscript: transcript,
        voiceResponse: response,
        preview: transcript
      });
    }
  };
}
