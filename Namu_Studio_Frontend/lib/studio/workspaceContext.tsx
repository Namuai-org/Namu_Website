"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface WorkspaceContextValue {
  draftInput: string;
  setDraftInput: (value: string) => void;
  processing: boolean;
  setProcessing: (value: boolean) => void;
  homeResetCount: number;
  resetHome: () => void;
  saveIndicator: string;
  markSaved: (label?: string) => void;
  clearWorkspaceState: () => void;
  mobileCodeTab: "prompt" | "code" | "preview";
  setMobileCodeTab: (tab: "prompt" | "code" | "preview") => void;
  createOptionsOpen: boolean;
  setCreateOptionsOpen: (value: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [draftInput, setDraftInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [homeResetCount, setHomeResetCount] = useState(0);
  const [saveIndicator, setSaveIndicator] = useState("");
  const [mobileCodeTab, setMobileCodeTab] = useState<"prompt" | "code" | "preview">("prompt");
  const [createOptionsOpen, setCreateOptionsOpen] = useState(false);

  useEffect(() => {
    if (!saveIndicator) return;
    const timer = window.setTimeout(() => setSaveIndicator(""), 2000);
    return () => window.clearTimeout(timer);
  }, [saveIndicator]);

  const resetHome = useCallback(() => {
    setDraftInput("");
    setProcessing(false);
    setHomeResetCount((current) => current + 1);
  }, []);

  const markSaved = useCallback((label = "An ajiye") => {
    setSaveIndicator(`✓ ${label}`);
  }, []);

  const clearWorkspaceState = useCallback(() => {
    setDraftInput("");
    setProcessing(false);
    setHomeResetCount(0);
    setSaveIndicator("");
    setMobileCodeTab("prompt");
    setCreateOptionsOpen(false);
  }, []);

  const value = useMemo<WorkspaceContextValue>(() => ({
    draftInput,
    setDraftInput,
    processing,
    setProcessing,
    homeResetCount,
    resetHome,
    saveIndicator,
    markSaved,
    clearWorkspaceState,
    mobileCodeTab,
    setMobileCodeTab,
    createOptionsOpen,
    setCreateOptionsOpen
  }), [
    clearWorkspaceState,
    createOptionsOpen,
    draftInput,
    homeResetCount,
    markSaved,
    mobileCodeTab,
    processing,
    resetHome,
    saveIndicator
  ]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
