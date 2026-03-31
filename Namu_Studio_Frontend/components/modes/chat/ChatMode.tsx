"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { streamChatResponse } from "@/lib/ai/aiService";
import { prepareChatAttachments } from "@/lib/ai/prepareAttachments";
import { saveMessage } from "@/lib/studio/messageService";
import { touchSession } from "@/lib/studio/sessionService";
import { ChatInput } from "@/components/modes/chat/ChatInput";
import { ChatMessage } from "@/components/modes/chat/ChatMessage";
import { TypingIndicator } from "@/components/modes/chat/TypingIndicator";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";

function buildChatUserContent(text: string, files: File[]): string {
  const t = text.trim();
  if (!files.length) {
    return t;
  }
  const line = `[Attached: ${files.map((f) => f.name).join(", ")}]`;
  return t ? `${t}\n\n${line}` : line;
}

export function ChatMode(): JSX.Element {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    activeSession,
    activeSessionId,
    draftInput,
    setDraftInput,
    chatAttachments,
    setChatAttachments,
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
    if (!activeSession || activeSession.chatMessages.length) {
      return;
    }
    if (!draftInput.trim() && !chatAttachments.length) {
      return;
    }
    void handleSubmit(draftInput);
  }, [activeSession?.id]);

  const handleSubmit = async (submittedValue?: string): Promise<void> => {
    const raw = (submittedValue ?? draftInput).trim();
    const files = chatAttachments;
    if ((!raw && !files.length) || !user?.id || isStreaming) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const preparedAttachments = files.length ? await prepareChatAttachments(files) : undefined;
    const contentForUi = buildChatUserContent(raw, files);

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = await startSession(raw || files[0]?.name || "", "chat");
      if (!sessionId) {
        pushToast({ title: t("common.somethingWrong"), description: t("toasts.sessionLoadFailed"), type: "error" });
        return;
      }
      await refreshSessions();
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: contentForUi,
      createdAt: new Date().toISOString()
    };
    addChatMessage(userMessage);
    setDraftInput("");
    setChatAttachments([]);
    setProcessing(true);
    setTyping(true);
    setIsStreaming(true);
    setInlineError("");
    setLastSubmittedMessage(raw || contentForUi);

    await saveMessage(sessionId, user.id, "user", contentForUi);

    const priorMessages = (activeSession?.chatMessages ?? [])
      .slice(-10)
      .map((message) => ({ role: message.role, content: message.content }));
    const contextMessages = [...priorMessages, { role: "user", content: contentForUi }];

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
      abortControllerRef.current.signal,
      preparedAttachments
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
              <div className="studio-apple-frame w-full max-w-[min(520px,100%)] px-8 py-10 font-sans">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-brand-orange text-lg font-bold text-white shadow-sm">
                  N
                </div>
                <h2 className="studio-editorial mt-5 max-w-none">{t("workspace.chatEmptyTitle")}</h2>
                <p className="studio-editorial-sub mt-3 max-w-none">{t("workspace.chatEmptyBody")}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[t("prompts.chat1"), t("prompts.chat2"), t("prompts.chat3")].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setDraftInput(prompt)}
                      className="rounded-full border px-4 py-2 text-[13px] transition hover:border-brand-orange hover:text-text-primary"
                      style={{ background: "var(--chip-bg)", borderColor: "var(--chip-border)", color: "var(--chip-text)" }}
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
