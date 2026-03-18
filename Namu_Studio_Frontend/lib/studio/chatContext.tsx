"use client";

import { createContext, useContext, useMemo, useRef, useState } from "react";

interface ChatContextValue {
  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  typing: boolean;
  setTyping: (value: boolean) => void;
  inlineError: string;
  setInlineError: (value: string) => void;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  lastSubmittedMessage: string;
  setLastSubmittedMessage: (value: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [isStreaming, setIsStreaming] = useState(false);
  const [typing, setTyping] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [lastSubmittedMessage, setLastSubmittedMessage] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const value = useMemo<ChatContextValue>(() => ({
    isStreaming,
    setIsStreaming,
    typing,
    setTyping,
    inlineError,
    setInlineError,
    abortControllerRef,
    lastSubmittedMessage,
    setLastSubmittedMessage
  }), [inlineError, isStreaming, lastSubmittedMessage, typing]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
