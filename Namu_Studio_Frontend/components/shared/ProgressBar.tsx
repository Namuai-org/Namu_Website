"use client";

export function ProgressBar({ value }: { value: number }): JSX.Element {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-border">
      <div className="h-full rounded-full bg-brand-orange transition-all duration-300 ease-spring" style={{ width: `${value}%` }} />
    </div>
  );
}
