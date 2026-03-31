"use client";

import { Code2, MessageSquare, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { OnboardingStep } from "@/components/onboarding/OnboardingStep";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function OnboardingOverlay(): JSX.Element | null {
  const { t } = useTranslation();
  const { currentStep, setStep, isComplete, complete } = useOnboarding();
  const { setDraftInput, setMode, activeMode, hasActiveSession } = useStudio();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (currentStep === 3 && hasActiveSession) {
      setStep(4);
    }
    if (currentStep === 4 && activeMode === "code") {
      setStep(5);
    }
  }, [activeMode, currentStep, hasActiveSession, setStep]);

  if (isComplete) return null;

  const proceed = (): void => {
    if (currentStep === 1) {
      setStep(2);
      return;
    }
    if (currentStep === 2) {
      setMode("chat");
      setDraftInput(input || t("prompts.home7"));
      setStep(3);
      return;
    }
    if (currentStep === 5) {
      complete();
    }
  };

  const skip = (): void => complete();

  return (
    <div className="fixed inset-0 z-[1000] bg-[rgba(245,239,230,0.88)] backdrop-blur-md">
      <div className="relative flex min-h-screen items-center justify-center p-6 font-sans">
        {currentStep === 1 ? (
          <OnboardingStep
            step={1}
            title={t("onboarding.welcomeTitle")}
            body={t("onboarding.welcomeBody")}
            icon={Sparkles}
            continueLabel={t("onboarding.start")}
            onContinue={proceed}
          >
            <div className="mt-4 flex flex-wrap gap-2 font-sans text-[12px] font-medium">
              {["Chat", "Code", "Murya"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border px-3 py-1.5"
                  style={{
                    background: "var(--chip-bg)",
                    borderColor: "var(--chip-border)",
                    color: "var(--chip-text)"
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </OnboardingStep>
        ) : currentStep === 2 ? (
          <OnboardingStep
            step={2}
            title={t("onboarding.step2Title")}
            body={t("onboarding.step2Body")}
            icon={MessageSquare}
            continueLabel={t("common.continue")}
            disabled={input.trim().length < 3}
            onContinue={proceed}
            onSkip={skip}
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t("onboarding.step2Placeholder")}
              className="h-12 rounded-xl"
            />
            <button type="button" onClick={() => setInput(t("prompts.home7"))} className="mt-2 text-xs text-brand-orange">
              {t("onboarding.step2Suggestion")}
            </button>
          </OnboardingStep>
        ) : currentStep === 3 ? (
          <OnboardingStep
            step={3}
            title={t("onboarding.step3Title")}
            body={t("onboarding.step3Body")}
            icon={Send}
            continueLabel={t("common.continue")}
            disabled
            onSkip={skip}
          />
        ) : currentStep === 4 ? (
          <OnboardingStep
            step={4}
            title={t("onboarding.step4Title")}
            body={t("onboarding.step4Body")}
            icon={Code2}
            continueLabel={t("common.continue")}
            disabled
            onSkip={skip}
          />
        ) : (
          <div className="namu-workspace-cream studio-apple-frame w-full max-w-[min(400px,calc(100vw-2rem))] p-8 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border-2 border-status-success text-status-success">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="studio-editorial max-w-none text-center">{t("onboarding.completeTitle")}</h3>
            <p className="studio-editorial-sub mt-3 max-w-none text-center">{t("onboarding.completeBody")}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Chat da AI", "Gina code", "Koyo da Hausa"].map((pill) => (
                <span key={pill} className="rounded-full border border-status-success bg-status-success/5 px-3 py-1.5 text-xs font-medium text-status-success">
                  ✓ {pill}
                </span>
              ))}
            </div>
            <Button className="mt-6 w-full" size="lg" onClick={proceed}>
              {t("onboarding.completeAction")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
