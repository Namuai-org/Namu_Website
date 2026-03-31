"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { ToastViewport } from "@/components/shared/ToastViewport";
import { WorkspaceLoadingScreen } from "@/components/workspace/WorkspaceLoadingScreen";
import { HelpModal } from "@/components/workspace/HelpModal";
import { HomeState } from "@/components/workspace/HomeState";
import { ActivityBar } from "@/components/workspace/ActivityBar";
import { MobileBottomNav } from "@/components/workspace/MobileBottomNav";
import { ModeRouter } from "@/components/workspace/ModeRouter";
import { SettingsPanel } from "@/components/workspace/SettingsPanel";
import { SessionHistoryPanel } from "@/components/workspace/SessionHistoryPanel";
import { StatusBar } from "@/components/workspace/StatusBar";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useStudio } from "@/hooks/useStudio";

export function WorkspaceShell(): JSX.Element {
  const { initialized } = useAuth();
  const { setMode, resetToHome, hasActiveSession, startSession, activeMode, homeResetCount, workspaceLoading, offline } = useStudio();
  const { currentStep, setStep } = useOnboarding();
  const params = useSearchParams();

  useEffect(() => {
    const mode = params.get("mode");
    if (mode === "chat" || mode === "create" || mode === "code" || mode === "voice") {
      setMode(mode);
    }
  }, [params, setMode]);

  useKeyboard([
    { key: "1", handler: () => setMode("chat") },
    { key: "2", handler: () => setMode("create") },
    { key: "3", handler: () => setMode("code") },
    { key: "4", handler: () => setMode("voice") },
    { key: "k", meta: true, handler: resetToHome }
  ]);

  useEffect(() => {
    if (params.get("tour") === "1" && currentStep < 5) {
      setStep(3);
    }
  }, [currentStep, params, setStep]);

  useEffect(() => {
    const prompt = params.get("prompt");
    const mode = params.get("mode");
    if (prompt && !hasActiveSession) {
      startSession(prompt, mode === "create" || mode === "code" || mode === "voice" || mode === "chat" ? mode : activeMode);
    }
  }, [activeMode, hasActiveSession, params, startSession]);

  if (!initialized || workspaceLoading) {
    return <WorkspaceLoadingScreen />;
  }

  return (
    <div className="namu-workspace-cream flex h-screen flex-col bg-bg-base font-sans">
      {offline ? (
        <div className="px-4 py-2 text-center text-xs text-[var(--navy)]" style={{ background: "var(--warning)" }}>
          Babu haɗin intanet
        </div>
      ) : null}
      <WorkspaceHeader />
      <div className="flex min-h-0 flex-1">
        <ActivityBar />
        <div className="relative min-h-0 flex-1 overflow-hidden pb-16 md:pb-0">
          <SessionHistoryPanel />
          <SettingsPanel />
          <AnimatePresence mode="wait">
            {!hasActiveSession && activeMode === "chat" ? (
              <HomeState key={homeResetCount} />
            ) : (
              <ModeRouter key={`${activeMode}:${hasActiveSession ? "session" : "draft"}`} />
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="hidden md:block">
        <StatusBar />
      </div>
      <MobileBottomNav />
      <ToastViewport />
      <OnboardingOverlay />
      <HelpModal />
    </div>
  );
}
