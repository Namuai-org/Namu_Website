"use client";

import { Button } from "@/components/shared/Button";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";

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
  return (
    <div className="w-[320px] rounded-2xl bg-white p-7 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-text-quiet">{step} / 5</span>
        <OnboardingProgress step={step} />
      </div>
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-brand-pale text-brand-orange">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-bold text-text-dark">{title}</h3>
      <p className="mt-2 text-sm leading-[1.65] text-text-quiet">{body}</p>
      {children ? <div className="mt-4">{children}</div> : null}
      <div className="mt-5 flex items-center justify-between">
        {onSkip ? (
          <button type="button" onClick={onSkip} className="text-sm font-medium text-[#cccccc] transition hover:text-text-quiet">
            Skip tour
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
