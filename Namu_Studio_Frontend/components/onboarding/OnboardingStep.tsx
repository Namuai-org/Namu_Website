"use client";

import { Button } from "@/components/shared/Button";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function OnboardingStep({
  step,
  title,
  body,
  icon: Icon,
  children,
  onContinue,
  continueLabel,
  disabled,
  onSkip
}: {
  step: number;
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
  onContinue?: () => void;
  continueLabel: string;
  disabled?: boolean;
  onSkip?: () => void;
}): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="namu-workspace-cream studio-apple-frame w-full max-w-[min(420px,calc(100vw-2rem))] p-8">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
          {step} / 5
        </span>
        <OnboardingProgress step={step} />
      </div>
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl border border-[rgba(218,119,86,0.2)] bg-[rgba(218,119,86,0.08)] text-brand-orange">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="studio-editorial !mx-0 max-w-none text-left">{title}</h3>
      <p className="studio-editorial-sub mt-3 !mx-0 max-w-none text-left">{body}</p>
      {children ? <div className="mt-5">{children}</div> : null}
      <div className="mt-6 flex items-center justify-between gap-3">
        {onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-medium transition"
            style={{ color: "var(--text-muted)" }}
          >
            {t("onboarding.skipTour")}
          </button>
        ) : (
          <span />
        )}
        <Button size="sm" disabled={disabled} onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}
