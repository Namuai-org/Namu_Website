"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/lib/studio/profileService";

interface OnboardingContextValue {
  currentStep: number;
  isComplete: boolean;
  setStep: (step: number) => void;
  complete: () => void;
  reset: () => void;
  ready: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { user } = useAuth();
  const [complete, setCompleteState] = useState(false);
  const [step, setStep] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setCompleteState(false);
      setStep(1);
      setReady(true);
      return;
    }
    setCompleteState(Boolean(user.onboardingComplete));
    setStep(user.onboardingComplete ? 5 : 1);
    setReady(true);
  }, [user]);

  const value = useMemo<OnboardingContextValue>(() => ({
    currentStep: step,
    isComplete: complete,
    ready,
    setStep,
    complete: () => {
      setCompleteState(true);
      setStep(5);
      if (user?.id) {
        void updateProfile(user.id, { onboarding_complete: true });
      }
    },
    reset: () => {
      setCompleteState(false);
      setStep(1);
      if (user?.id) {
        void updateProfile(user.id, { onboarding_complete: false });
      }
    }
  }), [complete, ready, step, user?.id]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingContext(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboardingContext must be used within OnboardingProvider");
  }
  return context;
}
