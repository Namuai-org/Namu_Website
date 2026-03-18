"use client";

export function OnboardingProgress({ step }: { step: number }): JSX.Element {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }, (_, index) => {
        const active = index + 1 === step;
        return <div key={index} className={`h-2 rounded-full transition-all ${active ? "w-5 bg-brand-orange" : "w-2 bg-border-light"}`} />;
      })}
    </div>
  );
}
