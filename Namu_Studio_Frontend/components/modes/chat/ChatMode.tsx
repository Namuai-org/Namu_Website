"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { streamChatResponse } from "@/lib/ai/aiService";
import { saveMessage } from "@/lib/studio/messageService";
import { touchSession } from "@/lib/studio/sessionService";
import { ChatInput } from "@/components/modes/chat/ChatInput";
import { ChatMessage } from "@/components/modes/chat/ChatMessage";
import { TypingIndicator } from "@/components/modes/chat/TypingIndicator";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function ChatMode(): JSX.Element {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    activeSession,
    activeSessionId,
    draftInput,
    setDraftInput,
    addChatMessage,
    pushToast,
    setProcessing,
    messagesLoading,
    startSession,
    setIsStreaming,
    isStreaming,
    typing,
    setTyping,
    abortControllerRef,
    inlineError,
    setInlineError,
    setLastSubmittedMessage,
    lastSubmittedMessage,
    patchSession,
    refreshSessions
  } = useStudio();

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [abortControllerRef]);

  useEffect(() => {
    if (!activeSession || activeSession.chatMessages.length || !draftInput.trim()) {
      return;
    }
    void handleSubmit(draftInput);
  }, [activeSession?.id]);

  const handleSubmit = async (submittedValue?: string): Promise<void> => {
    const content = (submittedValue ?? draftInput).trim();
    if (!content || !user?.id || isStreaming) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = await startSession(content, "chat");
      if (!sessionId) {
        pushToast({ title: t("common.somethingWrong"), description: t("toasts.sessionLoadFailed"), type: "error" });
        return;
      }
      await refreshSessions();
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content,
      createdAt: new Date().toISOString()
    };
    addChatMessage(userMessage);
    setDraftInput("");
    setProcessing(true);
    setTyping(true);
    setIsStreaming(true);
    setInlineError("");
    setLastSubmittedMessage(content);

    await saveMessage(sessionId, user.id, "user", content);

    const priorMessages = (activeSession?.chatMessages ?? [])
      .slice(-10)
      .map((message) => ({ role: message.role, content: message.content }));
    const contextMessages = [...priorMessages, { role: "user", content }];

    const aiMessageId = crypto.randomUUID();
    addChatMessage({
      id: aiMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      streaming: true
    });

    let fullResponse = "";
    await streamChatResponse(
      contextMessages,
      (token) => {
        if (!sessionId) return;
        fullResponse += token;
        setTyping(false);
        patchSession(sessionId, (session) => ({
          chatMessages: [
            ...session.chatMessages.filter((message) => message.id !== aiMessageId),
            { id: aiMessageId, role: "assistant", content: fullResponse, createdAt: new Date().toISOString(), streaming: true }
          ]
        }));
      },
      async (complete) => {
        if (!sessionId) return;
        setTyping(false);
        setIsStreaming(false);
        setProcessing(false);
        patchSession(sessionId, (session) => ({
          chatMessages: [
            ...session.chatMessages.filter((message) => message.id !== aiMessageId),
            { id: aiMessageId, role: "assistant", content: complete, createdAt: new Date().toISOString() }
          ],
          preview: complete
        }));
        await saveMessage(sessionId, user.id, "assistant", complete);
        await touchSession(sessionId);
        await refreshSessions();
      },
      (error) => {
        if (!sessionId) return;
        setTyping(false);
        setIsStreaming(false);
        setProcessing(false);
        patchSession(sessionId, (session) => ({
          chatMessages: session.chatMessages.filter((message) => message.id !== aiMessageId)
        }));
        setInlineError(error);
        pushToast({ title: t("common.aiUnavailable"), description: error, type: "error" });
      },
      abortControllerRef.current.signal
    );
  };

  const messages = activeSession?.chatMessages ?? [];

  return (
    <div className="flex h-full flex-col">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 overflow-y-auto px-3 py-4 md:px-4 md:py-6">
        <div className="mx-auto w-full max-w-[760px]">
          {messagesLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className={`h-20 w-[88%] rounded-2xl shimmer md:w-[75%] ${item % 2 ? "ml-auto" : ""}`}
                  style={{ backgroundColor: "var(--bg-elevated)" }}
                />
              ))}
            </div>
          ) : null}
          {!messagesLoading && messages.length === 0 ? (
            <div className="grid h-full place-items-center py-12 text-center">
              <div>
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-[10px] bg-brand-orange text-lg font-bold text-white">N</div>
                <h2 className="mt-4 text-xl font-semibold text-text-primary">{t("workspace.chatEmptyTitle")}</h2>
                <p className="mt-2 text-sm text-text-secondary">{t("workspace.chatEmptyBody")}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {[t("prompts.chat1"), t("prompts.chat2"), t("prompts.chat3")].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setDraftInput(prompt)}
                      className="rounded-full border px-4 py-2 text-sm transition hover:border-brand-orange hover:text-text-primary"
                      style={{ background: "var(--bg-panel)", borderColor: "var(--border)", color: "var(--text-secondary)" }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onCopy={(content) =>
                  pushToast({
                    title: t("toasts.copied"),
                    description: content.slice(0, 48),
                    type: "info"
                  })
                }
                onRegenerate={lastSubmittedMessage ? () => void handleSubmit(lastSubmittedMessage) : undefined}
              />
            ))}
          </AnimatePresence>
          {typing ? <TypingIndicator /> : null}
          {inlineError ? (
            <div className="mt-3 rounded-2xl border border-status-error/30 bg-status-error/5 p-4 text-sm text-text-primary">
              Ban iya samun amsa.
              <Button variant="outlineOrange" size="sm" className="ml-3" onClick={() => void handleSubmit(lastSubmittedMessage)}>
                {t("common.tryAgain")}
              </Button>
            </div>
          ) : null}
        </div>
      </motion.div>
      <ChatInput
        value={draftInput}
        setValue={setDraftInput}
        onSubmit={() => void handleSubmit()}
        streaming={isStreaming}
        onStop={() => {
          abortControllerRef.current?.abort();
          setTyping(false);
          setIsStreaming(false);
          setProcessing(false);
        }}
      />
    </div>
  );
}
